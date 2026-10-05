import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CookieBanner from "../banner/CookieBanner";
import { CookieConsentProvider } from "../../hooks/useCookieConsent";
import { resolveLocale } from "../../utils/locale";

function SiteLayout() {
    const { i18n } = useTranslation();
    const { pathname } = useLocation();

    useEffect(() => {
        const activeLocale = resolveLocale(pathname);
        i18n.changeLanguage(activeLocale);
        document.documentElement.lang = activeLocale;
    }, [i18n, pathname]);
    return (
        <CookieConsentProvider>
            <Outlet />
            <CookieBanner />
        </CookieConsentProvider>
    );
}

export default SiteLayout;
