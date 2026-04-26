const formsWithHandler = new WeakSet<HTMLFormElement>();

export default function initContactForm(): void {
  const form = document.getElementById('contact__form') as HTMLFormElement;
  if (!form || formsWithHandler.has(form)) return;

  formsWithHandler.add(form);

  const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]');
  const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
  const messageInput = form.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const responseEl = document.getElementById('contact__form__response');

  if (!nameInput || !emailInput || !messageInput || !button || !responseEl) return;

  let responseHideTimer: ReturnType<typeof setTimeout> | undefined;

  const scheduleResponseHide = () => {
    if (responseHideTimer !== undefined) clearTimeout(responseHideTimer);
    responseHideTimer = setTimeout(() => {
      responseEl.classList.add('hidden');
      responseEl.innerHTML = '';
      responseHideTimer = undefined;
    }, 5000);
  };

  const setError = (input: HTMLInputElement | HTMLTextAreaElement, message: string) => {
    const errorEl = input.parentElement?.querySelector('.error-message');
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    input.classList.add('border-red-500');
  };

  const clearError = (input: HTMLInputElement | HTMLTextAreaElement) => {
    const errorEl = input.parentElement?.querySelector('.error-message');
    if (!errorEl) return;
    errorEl.classList.add('hidden');
    input.classList.remove('border-red-500');
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener('input', () => clearError(input));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (button.disabled) return;

    let isValid = true;

    [nameInput, emailInput, messageInput].forEach(clearError);

    if (!nameInput.value.trim()) {
      setError(nameInput, 'Full name is required');
      isValid = false;
    }

    if (!emailInput.value.trim()) {
      setError(emailInput, 'Email is required');
      isValid = false;
    } else if (!validateEmail(emailInput.value)) {
      setError(emailInput, 'Enter a valid email');
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      setError(messageInput, 'Message is required');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      setError(messageInput, 'Minimum 10 characters required');
      isValid = false;
    }

    if (!isValid) return;

    button.disabled = true;
    button.innerText = 'Sending...';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          message: messageInput.value.trim(),
        }),
      });

      const raw = await res.text();
      let data: { error?: string } = {};
      if (raw) {
        try {
          data = JSON.parse(raw) as { error?: string };
        } catch {
          data = { error: raw.slice(0, 200) };
        }
      }

      if (res.ok) {
        form.reset();
        responseEl.innerHTML =
          '<span class="text-green-600">Message sent successfully!</span>';
      } else {
        responseEl.innerHTML = `<span class="text-red-600">${data.error ?? res.statusText ?? 'Something went wrong'}</span>`;
      }

      responseEl.classList.remove('hidden');
      scheduleResponseHide();
    } catch {
      responseEl.innerHTML =
        '<span class="text-red-600">Network error</span>';
      responseEl.classList.remove('hidden');
      scheduleResponseHide();
    }

    button.disabled = false;
    button.innerText = 'Submit';
  });
}
