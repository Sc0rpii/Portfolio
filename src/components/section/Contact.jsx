import { useTranslation } from "react-i18next";
import facebook from "../../assets/social/facebook.svg"
import instagram from "../../assets/social/instagram.svg"
import tiktok from "../../assets/social/tiktok.svg"

function Contact(){
    const {t} = useTranslation();
    return(
        <div className="flex flex-col items-center justify-center w-full gap-5 text-center sm:gap-6">
            <h2 className="text-3xl font-bold font-display text-heading sm:text-4xl">
                {t("contact.title")}
            </h2>
            <p className="max-w-2xl text-sm leading-6 font-body text-body sm:text-base">
                {t("contact.subtitle")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <a
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-primary transition-transform duration-200 hover:-translate-y-1 hover:scale-105"
                href="https://www.instagram.com/mirkofreschi.dev/">
                    <img src={instagram} alt="instagram" />
                </a>
                <a
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-primary transition-transform duration-200 hover:-translate-y-1 hover:scale-105"
                href="https://www.tiktok.com/@mirkofreschi.dev">
                    <img src={tiktok} alt="TikTok" />
                </a>
                <a
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-primary transition-transform duration-200 hover:-translate-y-1 hover:scale-105"
                href="https://www.facebook.com/mirkofreschi.dev">
                    <img src={facebook} alt="Facebook" />
                </a>
            </div>
        </div>
    );
}

export default Contact;
