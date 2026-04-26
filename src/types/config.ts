export interface SiteConfig {
	id: string;
	title: string;
	description: string;
	faviconUrl: string;
	theme: string;
    logo: {
        url: string;
        width: number;
        height: number;
        mobileWidth: number;
        mobileHeight: number;
        alt: string;
    };
    header: {
        links: {
            label: string;
            url: string;
        }[];
    };
    footer: {
        logo: {
            url: string;
            width: number;
            height: number;
            mobileWidth: number;
            mobileHeight: number;
            alt: string;
        };
        footerContent: string;
        copyright: string;
        email: string;
        phone: string;
        socialLinks: {
            label: string;
            url: string;
            icon: string;
        }[];
        navigation: {
            label: string;
            url: string;
        }[];
    };
}

export interface HomeConfig {
	id: string;
	meta: {
		title: string;
		description: string;
	};
	hero: {
		title: string;
		description: string;
		heroImage: {
			url: string;
			width: number;
			height: number;
			alt: string;
		};
	};
    aboutUs: {
        title: string;
        description: string;
        aboutUsImage: {
            url: string;
            width: number;
            height: number;
            alt: string;
        };
    };
    products: {
        title: string;
        description: string;
        tabs: {
            tabTitle: string;
            products: {
                title: string;
                description: string;
                price: string;
                rating: number;
                image: {
                    url: string;
                    width: number;
                    height: number;
                    alt: string;
                };
            }[];
        }[];
    };
    whyChooseUs: {
        title: string;
        description: string;
        whyChooseUsImage: {
            url: string;
            width: number;
            height: number;
            alt: string;
        };
    };
    contactForm: {
        title: string;
        description: string;
    };
    productOrder: {
        ctaLabel: string;
    };
}

export interface PrivacyPolicyConfig {
    id: string;
    meta: {
        title: string;
        description: string;
    };
    privacyPolicy: {
        date: string;
        title: string;
        content: string;
    };
}
