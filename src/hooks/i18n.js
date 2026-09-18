import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enText from "../languages/eng.json";
import itText from "../languages/it.json";

i18n
.use(LanguageDetector)
.use(initReactI18next)
.init({
    resources: {
        en: { translation: enText },
        it: { translation: itText }
    },
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    }
});

export default i18n;