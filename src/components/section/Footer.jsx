import facebook from "../../assets/social/facebook.svg"
import github from "../../assets/social/github.svg"
import instagram from "../../assets/social/instagram.svg"
import linkedin from "../../assets/social/linkedin.svg"
import tiktok from "../../assets/social/tiktok.svg"
import email from "../../assets/icon/Email.svg"

import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useCookieConsent } from "../../hooks/useCookieConsent";
import { getLocaleFromPathname, localizePath } from "../../utils/locale";

function Footer(){
    const { t } = useTranslation();
    const { openPreferences } = useCookieConsent();
    const { pathname } = useLocation();
    const privacyPath = localizePath('/privacy-policy', getLocaleFromPathname(pathname));

    return(
        <div className="flex flex-col items-center justify-between py-6 w-full max-w-7xl gap-6 mx-auto text-center md:flex-row md:text-left">
            <div className="leading-5">
                <p className="text-xl font-bold text-heading font-body">
                    Mirko Freschi
                </p>
                <p
                className="text-sm">
                    &copy; 2026 All rights reserved
                </p>
            </div>
            <div className="flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-5">
                <a
                target="_blank"
                rel="noreferrer"
                className="transition-transform duration-200 hover:-translate-y-0.5"
                href="https://www.instagram.com/mirkofreschi.dev/">
                    <img src={instagram} alt="instagram" />
                </a>
                <a
                target="_blank"
                rel="noreferrer"
                className="transition-transform duration-200 hover:-translate-y-0.5"
                href="https://www.tiktok.com/@mirkofreschi.dev">
                    <img src={tiktok} alt="TikTok" />
                </a>
                <a
                target="_blank"
                rel="noreferrer"
                className="transition-transform duration-200 hover:-translate-y-0.5"
                href="https://www.facebook.com/mirkofreschi.dev">
                    <img src={facebook} alt="Facebook" />
                </a>
                <a
                target="_blank"
                rel="noreferrer"
                className="transition-transform duration-200 hover:-translate-y-0.5"
                href="https://github.com/Sc0rpii">
                    <img src={github} alt="Github" />
                </a>
                <a
                target="_blank"
                rel="noreferrer"
                className="transition-transform duration-200 hover:-translate-y-0.5"
                href="https://www.linkedin.com/in/mirko-freschi-1b292b286/">
                    <img src={linkedin} alt="LinkedIn" />
                </a>
                <a
                target="_blank"
                rel="noreferrer"
                className="transition-transform duration-200 hover:-translate-y-0.5"
                href="mailto:mirkofreschi.dev@gmail.com">
                    <img src={email} alt="email" />
                </a>
            </div>

            <Link
                to={privacyPath}
                className="inline-block text-sm transition-colors duration-200 font-display hover:text-primary">
                    Privacy & Policy
            </Link>

            <button
                type="button"
                onClick={openPreferences}
                className="inline-block text-sm underline transition-colors duration-200 font-display underline-offset-4 hover:text-primary"
            >
                {t("cookie.manage")}
            </button>
        </div>
    );
}

export default Footer;
