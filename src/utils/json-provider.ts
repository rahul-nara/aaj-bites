import type { HomeConfig, PrivacyPolicyConfig, SiteConfig } from "@app-types/config";

import homeConfigJson from "@config/home.json";
import siteConfigJson from "@config/site.json";
import privacyPolicyJson from "@config/privacy-policy.json";

export const siteConfig = siteConfigJson as SiteConfig;
export const homeConfig = homeConfigJson as HomeConfig;
export const privacyPolicyConfig = privacyPolicyJson as PrivacyPolicyConfig;
