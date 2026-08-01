export const siteConfig = {
    name: "Mirko Freschi",
    role: "Web & iOS Developer",
    url: "https://mirkofreschi.com/",
    locale: "en_US",
    language: "en",
    description:
        "Portfolio of Mirko Freschi, a freelance Web and iOS Developer creating fast, accessible and maintainable digital products.",
    socialProfiles: [
        "https://www.instagram.com/mirkofreschi.dev/",
        "https://www.tiktok.com/@mirkofreschi.dev",
        "https://www.facebook.com/mirkofreschi.dev",
        "https://github.com/Sc0rpii",
        "https://www.linkedin.com/in/mirko-freschi-1b292b286/",
    ],
};

const configuredSiteUrl =
    import.meta.env.VITE_SITE_URL?.trim() || siteConfig.url;

function normalizeBaseUrl(value) {
    if (!value) {
        return "";
    }

    try {
        const url = new URL(value);

        if (!["http:", "https:"].includes(url.protocol)) {
            return "";
        }

        url.hash = "";
        url.search = "";
        url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;

        return url.href;
    } catch {
        return "";
    }
}

export function getSiteBaseUrl() {
    const configuredBaseUrl = normalizeBaseUrl(configuredSiteUrl);

    if (configuredBaseUrl) {
        return configuredBaseUrl;
    }

    if (typeof window !== "undefined") {
        return normalizeBaseUrl(
            new URL(import.meta.env.BASE_URL, window.location.origin).href,
        );
    }

    return "";
}

export function getAbsoluteSiteUrl(path = "") {
    const baseUrl = getSiteBaseUrl();

    if (!baseUrl) {
        return "";
    }

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    const base = new URL(baseUrl);
    const inputPath = String(path);

    if (
        inputPath.startsWith("/") &&
        base.pathname !== "/" &&
        inputPath.startsWith(base.pathname)
    ) {
        return new URL(inputPath, base.origin).href;
    }

    const normalizedPath = path === "/" ? "" : inputPath.replace(/^\/+/, "");

    return new URL(normalizedPath, baseUrl).href;
}
