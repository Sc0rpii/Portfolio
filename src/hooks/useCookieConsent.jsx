import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
    clearGoogleAnalyticsCookies,
    disableGoogleAnalytics,
    loadGoogleAnalytics,
} from "../utils/analytics";

const STORAGE_KEY = "cookie-consent";
const CONSENT_DURATION_MS = 180 * 24 * 60 * 60 * 1000; // 6 months, matches the Privacy Policy.

function readStoredConsent() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw);

        if (parsed?.status !== "accepted" && parsed?.status !== "rejected") {
            return null;
        }

        if (typeof parsed.timestamp !== "number" || Date.now() - parsed.timestamp > CONSENT_DURATION_MS) {
            return null;
        }

        return parsed.status;
    } catch {
        return null;
    }
}

function writeStoredConsent(status) {
    try {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ status, timestamp: Date.now() }),
        );
    } catch {
        // Consent still applies for the current session when storage is unavailable.
    }
}

const CookieConsentContext = createContext(null);

export function CookieConsentProvider({ children }) {
    const [consent, setConsent] = useState(() => readStoredConsent());
    const [isPromptOpen, setIsPromptOpen] = useState(() => readStoredConsent() === null);

    useEffect(() => {
        if (consent === "accepted") {
            loadGoogleAnalytics();
        } else {
            disableGoogleAnalytics();
        }
    }, [consent]);

    const acceptCookies = useCallback(() => {
        writeStoredConsent("accepted");
        setConsent("accepted");
        setIsPromptOpen(false);
    }, []);

    const rejectCookies = useCallback(() => {
        writeStoredConsent("rejected");
        clearGoogleAnalyticsCookies();
        setConsent("rejected");
        setIsPromptOpen(false);
    }, []);

    const openPreferences = useCallback(() => {
        setIsPromptOpen(true);
    }, []);

    const value = useMemo(
        () => ({ consent, isPromptOpen, acceptCookies, rejectCookies, openPreferences }),
        [consent, isPromptOpen, acceptCookies, rejectCookies, openPreferences],
    );

    return (
        <CookieConsentContext.Provider value={value}>
            {children}
        </CookieConsentContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCookieConsent() {
    const context = useContext(CookieConsentContext);

    if (!context) {
        throw new Error("useCookieConsent must be used within a CookieConsentProvider");
    }

    return context;
}
