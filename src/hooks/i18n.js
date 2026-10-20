import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enText from "../languages/eng.json";
import itText from "../languages/it.json";
import { getLocaleFromPathname } from "../utils/locale";

// The prerender switches the language per route before rendering it.
const initialLocale = typeof window === "undefined"
    ? "en"
    : getLocaleFromPathname(window.location.pathname);

i18n
.use(initReactI18next)
.init({
    lng: initialLocale,
    resources: {
        en: { translation: enText },
        it: { translation: itText }
    },
    supportedLngs: ["en", "it"],
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
