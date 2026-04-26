import type { APIRoute } from 'astro';

function isDevOrPreviewHost(requestUrl: string): boolean {
  if (import.meta.env.DEV) return true;
  try {
    const host = new URL(requestUrl).hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1')
      return true;
  } catch {
    /* ignore */
  }
  return requestUrl.includes('.pages.dev');
}

/** Browser checks: this route only accepts POST with JSON. */
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      message:
        'Send POST with Content-Type: application/json and body { name, email, message }.',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );

export const POST: APIRoute = async ({ request }) => {
  try {
    let name: string, email: string, message: string;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      ({ name, email, message } = await request.json());
    } else {
      const formData = await request.formData();
      name = formData.get('name') as string;
      email = formData.get('email') as string;
      message = formData.get('message') as string;
    }

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'All fields required' }), {
        status: 400,
      });
    }

    const isDevOrPreview = isDevOrPreviewHost(request.url);

    if (isDevOrPreview) {
      console.log('DEV/STAGING FORM:', { name, email, message });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
      });
    }

    const contactEmails = (import.meta.env.CONTACT_EMAILS || '')
      .split(',')
      .map((e: string) => e.trim())
      .filter(Boolean);

    const fromEmail = import.meta.env.FROM_EMAIL;

    if (!fromEmail || contactEmails.length === 0) {
      console.error('ENV ERROR:', { fromEmail, contactEmails });

      return new Response(
        JSON.stringify({ error: 'Email config missing' }),
        { status: 500 }
      );
    }

    const emailRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: contactEmails.map((email: string) => ({ email })),
          },
        ],
        from: {
          email: fromEmail,
          name: 'Website Contact',
        },
        subject: `New Contact Form Submission from ${name}`,
        content: [
          {
            type: 'text/plain',
            value: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
          },
        ],
      }),
    });

    const result = await emailRes.text();
    console.log('MailChannels:', result);

    if (!emailRes.ok) {
      return new Response(JSON.stringify({ error: result }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });

  } catch (err) {
    console.error('API ERROR:', err);

    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    });
  }
};
