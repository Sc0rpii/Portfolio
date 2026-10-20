// Every page has exactly one URL per language: English lives at the root and
// Italian under /it, so each URL always serves the same content. The visitor's
// language is picked before the page loads, in the vercel.json redirects:
// Italian browsers go to the /it URL, every other browser to the English one,
// while crawlers, which send no Accept-Language, reach every version unchanged.
// /eng and /it?lang=it force a language for one day.

export const LOCALE_COOKIE = "lang";

// While this cookie is set, the redirects follow it instead of the browser
// language. A preference the visitor asked for, so it needs no consent.
export function forceLocale(locale) {
    document.cookie = `${LOCALE_COOKIE}=${locale}; Max-Age=86400; Path=/; SameSite=Lax`;
}

export function getLocaleFromPathname(pathname) {
    return /^\/it(?=\/|$)/.test(pathname) ? "it" : "en";
}

export function stripLocaleFromPathname(pathname) {
    return pathname.replace(/^\/it(?=\/|$)/, "") || "/";
}

export function localizePath(path, locale) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const basePath = stripLocaleFromPathname(normalizedPath);

    if (locale !== "it") {
        return basePath;
    }

    return basePath === "/" ? "/it" : `/it${basePath}`;
}
