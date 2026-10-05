function hasLocaleSuffix(segments) {
    const routeCanHaveLocaleSuffix =
        (["services", "privacy-policy"].includes(segments[0]) && segments.length === 2)
        || (segments[0] === "project" && segments.length === 3);

    return routeCanHaveLocaleSuffix && ["it", "eng"].includes(segments.at(-1));
}

export function getExplicitLocaleFromPathname(pathname) {
    const segments = pathname.split("/").filter(Boolean);
    const prefixLocale = ["it", "eng"].includes(segments[0]) ? segments[0] : null;
    const localeSegment = prefixLocale
        ?? (hasLocaleSuffix(segments) ? segments.at(-1) : null);

    if (localeSegment === "it") return "it";
    if (localeSegment === "eng") return "en";

    return null;
}

export function getLocaleFromPathname(pathname) {
    return getExplicitLocaleFromPathname(pathname) ?? "en";
}

export function stripLocaleFromPathname(pathname) {
    const withoutPrefix = pathname.replace(/^\/(?:it|eng)(?=\/|$)/, "");
    const segments = withoutPrefix.split("/").filter(Boolean);
    const withoutSuffix = hasLocaleSuffix(segments)
        ? withoutPrefix.replace(/\/(?:it|eng)$/, "")
        : withoutPrefix;

    return withoutSuffix || "/";
}

function usesLocaleSuffix(pathname) {
    return !/^\/(?:it|eng)(?=\/|$)/.test(pathname)
        && stripLocaleFromPathname(pathname) !== pathname;
}

export function localizePath(path, locale, currentPathname) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const basePath = stripLocaleFromPathname(normalizedPath);

    if (currentPathname && usesLocaleSuffix(currentPathname)) {
        const localeSegment = locale === "it" ? "it" : "eng";
        return basePath === "/" ? `/${localeSegment}` : `${basePath}/${localeSegment}`;
    }

    if (currentPathname && /^\/(?:it|eng)(?=\/|$)/.test(currentPathname)) {
        const localeSegment = locale === "it" ? "it" : "eng";
        return basePath === "/" ? `/${localeSegment}` : `/${localeSegment}${basePath}`;
    }

    if (locale !== "it") {
        return basePath;
    }

    return basePath === "/" ? "/it" : `/it${basePath}`;
}

export function getBrowserLocale() {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    return languages[0]?.toLowerCase().startsWith("it") ? "it" : "en";
}

// /eng always forces English; /it never forces Italian on non-Italian browsers.
export function resolveLocale(pathname) {
    return getExplicitLocaleFromPathname(pathname) ?? getBrowserLocale();
}
