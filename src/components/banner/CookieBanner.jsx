import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useCookieConsent } from "../../hooks/useCookieConsent";

function CookieBanner() {
    const { t } = useTranslation();
    const { isPromptOpen, acceptCookies, rejectCookies } = useCookieConsent();
    const dialogRef = useRef(null);
    const acceptButtonRef = useRef(null);

    useEffect(() => {
        if (!isPromptOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        acceptButtonRef.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isPromptOpen]);

    const handleKeyDown = (event) => {
        if (event.key !== "Tab") {
            return;
        }

        const focusableElements = dialogRef.current?.querySelectorAll(
            'a[href], button:not([disabled])',
        );
        const firstElement = focusableElements?.[0];
        const lastElement = focusableElements?.[focusableElements.length - 1];

        if (!firstElement || !lastElement) {
            return;
        }

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    };

    if (!isPromptOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto z-9999 bg-black/75 backdrop-blur-sm sm:p-6"
            role="presentation"
        >
            <section
                ref={dialogRef}
                aria-describedby="cookie-banner-description"
                aria-labelledby="cookie-banner-title"
                aria-modal="true"
                onKeyDown={handleKeyDown}
                role="dialog"
                className="w-full max-w-xl p-5 border shadow-2xl rounded-card border-border bg-surface sm:p-8"
            >
                <h1 id="cookie-banner-title" className="text-2xl font-semibold text-primary font-display sm:text-3xl">
                    {t("cookie.title")}
                </h1>

                <p id="cookie-banner-description" className="mt-4 text-sm leading-6 font-body sm:text-base">
                    {t("cookie.body")}
                </p>
                <p className="mt-3 text-sm leading-6 font-body sm:text-base">
                    {t("cookie.privacy")}
                    <Link
                        to="/privacy-policy"
                        className="font-semibold underline transition-colors text-primary underline-offset-4 hover:text-heading"
                    >
                        Privacy &amp; Cookie Policy
                    </Link>
                </p>

                <div className="flex flex-col-reverse gap-3 mt-6 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={rejectCookies}
                        className="w-full rounded-button border border-border px-5 py-3 font-semibold text-heading font-heading transition-colors hover:border-primary focus-visible:outline-offset-4 sm:w-auto"
                    >
                        {t("cookie.reject")}
                    </button>
                    <button
                        ref={acceptButtonRef}
                        type="button"
                        onClick={acceptCookies}
                        className="w-full rounded-button bg-primary px-5 py-3 font-semibold text-background font-heading transition-transform hover:-translate-y-0.5 focus-visible:outline-offset-4 sm:w-auto"
                    >
                        {t("cookie.button")}
                    </button>
                </div>
            </section>
        </div>
    );
}

export default CookieBanner;
