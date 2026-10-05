import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enText from "../languages/eng.json";
import itText from "../languages/it.json";
import { resolveLocale } from "../utils/locale";

const initialLocale = resolveLocale(window.location.pathname);

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