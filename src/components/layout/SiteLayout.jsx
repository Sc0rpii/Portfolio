import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CookieBanner from "../banner/CookieBanner";
import { CookieConsentProvider } from "../../hooks/useCookieConsent";

function SiteLayout({ locale }) {
    const { i18n } = useTranslation();

    useEffect(() => {
        // Only the /it prefix forces a language; every other route keeps i18next's automatic browser detection.
        if (!locale) {
            return;
        }

        i18n.changeLanguage(locale);
        document.documentElement.lang = locale;
    }, [i18n, locale]);
    return (
        <CookieConsentProvider>
            <Outlet />
            <CookieBanner />
        </CookieConsentProvider>
    );
}

export default SiteLayout;
