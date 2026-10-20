import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CookieBanner from "../banner/CookieBanner";
import { CookieConsentProvider } from "../../hooks/useCookieConsent";
import { forceLocale, getLocaleFromPathname, LOCALE_COOKIE } from "../../utils/locale";

function SiteLayout() {
    const { i18n } = useTranslation();
    const { pathname, search, hash } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const activeLocale = getLocaleFromPathname(pathname);
        i18n.changeLanguage(activeLocale);
        document.documentElement.lang = activeLocale;
    }, [i18n, pathname]);

    // /eng redirects here with ?lang=en, /it?lang=it forces Italian: store the
    // choice, then drop the parameter so the address bar shows the canonical URL.
    useEffect(() => {
        const params = new URLSearchParams(search);
        const forcedLocale = params.get(LOCALE_COOKIE);

        if (forcedLocale !== "en" && forcedLocale !== "it") {
            return;
        }

        forceLocale(forcedLocale);
        params.delete(LOCALE_COOKIE);
        const remainingSearch = params.toString();
        navigate(
            { pathname, search: remainingSearch ? `?${remainingSearch}` : "", hash },
            { replace: true },
        );
    }, [navigate, pathname, search, hash]);

    return (
        <CookieConsentProvider>
            <Outlet />
            <CookieBanner />
        </CookieConsentProvider>
    );
}

export default SiteLayout;
