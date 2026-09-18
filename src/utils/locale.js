export function getLocaleFromPathname(pathname) {
    return pathname === "/it" || pathname.startsWith("/it/") ? "it" : "en";
}

export function localizePath(path, locale) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    if (locale !== "it" || normalizedPath === "/it" || normalizedPath.startsWith("/it/")) {
        return normalizedPath;
    }

    return normalizedPath === "/" ? "/it" : `/it${normalizedPath}`;
}

export function stripLocaleFromPathname(pathname) {
    const withoutLocale = pathname.replace(/^\/it(?=\/|$)/, "");
    return withoutLocale || "/";
}

export function getAlternateLocalePath(pathname) {
    const currentLocale = getLocaleFromPathname(pathname);
    const basePath = stripLocaleFromPathname(pathname);
    const targetLocale = currentLocale === "it" ? "en" : "it";

    return {
        locale: targetLocale,
        path: localizePath(basePath, targetLocale),
    };
}
