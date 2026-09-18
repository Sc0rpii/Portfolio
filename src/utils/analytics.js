export const GA_MEASUREMENT_ID =
    import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || "G-ZZX7MYJ9E7";

const GA_SCRIPT_ID = "ga-gtag-script";

function getDisableFlagName() {
    return `ga-disable-${GA_MEASUREMENT_ID}`;
}

// GA reads this flag on every call and drops hits when it is true.
export function disableGoogleAnalytics() {
    if (typeof window === "undefined") {
        return;
    }

    window[getDisableFlagName()] = true;
}

export function loadGoogleAnalytics() {
    if (typeof window === "undefined" || document.getElementById(GA_SCRIPT_ID)) {
        return;
    }

    window[getDisableFlagName()] = false;
    window.dataLayer = window.dataLayer || [];

    window.gtag = window.gtag || function gtag() {
        window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });

    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
}

// Best-effort cleanup so a revoked consent stops sending data immediately,
// even though a cookie already set by a third party cannot be deleted from JS.
export function clearGoogleAnalyticsCookies() {
    if (typeof document === "undefined") {
        return;
    }

    const hostname = window.location.hostname;
    const domains = [hostname, `.${hostname}`];
    const cookieNames = document.cookie
        .split(";")
        .map((cookie) => cookie.split("=")[0]?.trim())
        .filter((name) => name && (name === "_ga" || name.startsWith("_ga_") || name === "_gid"));

    cookieNames.forEach((name) => {
        domains.forEach((domain) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
        });
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    });
}
