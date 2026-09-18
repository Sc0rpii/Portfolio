import "./style/Privacy.css";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/section/Footer";
import Seo from "../components/seo/Seo";
import { useTranslation } from "react-i18next";

function Privacy(){
    const { t } = useTranslation();

    return(
    <>
    <Seo
        title={`${t("privacy.title")} | Mirko Freschi`}
        description={t("privacy.intro1")}
        path="/privacy-policy"
        robots="noindex, follow"
        structuredData={null}
    />
    <Navbar />
    <header className="ml-5 text-body">
        <h1>
            {t("privacy.title")}
        </h1>
        <sub>{t("privacy.lastUpdated")} <b>{t("privacy.date")}</b></sub>
        <p>
            {t("privacy.intro1")}
        </p>
        <p>
            {t("privacy.intro2")}
        </p>
    </header>

    <div id="privacy-body" className="ml-5 text-body">
        <article>
            <header>
                <h2>
                    {t("privacy.owner.title")}
                </h2>
            </header>
            <p>
                {t("privacy.owner.desc")}
            </p>
            <ul>
                <li>
                    <b>{t("privacy.owner.name")} Mirko Freschi</b>
                </li>
                <li>
                    <b>{t("privacy.owner.location")}</b> Palermo
                </li>
                <li>
                    <b>{t("privacy.owner.email")}</b> <a href="mailto:mirkofreschi.dev@gmail.com">mirkofreschi.dev@gmail.com</a>
                </li>
            </ul>
        </article>

        <article>
            <h2>
                {t("privacy.analytics.title")}
            </h2>
            <p>
                {t("privacy.analytics.desc1")} <b>Google Analytics (G4A)</b>, {t("privacy.analytics.desc2")}
            </p>
            <p>
                {t("privacy.analytics.desc3")}
            </p>
            <ul>
                <li>
                    <b>{t("privacy.analytics.ip")}</b> {t("privacy.analytics.ipDesc")}
                </li>
                <li>
                    <b>{t("privacy.analytics.sharing")}</b> {t("privacy.analytics.sharingDesc")}
                </li>
                <li>
                    <b>{t("privacy.analytics.forms")}</b> {t("privacy.analytics.formsDesc")}
                </li>
            </ul>
            <br />
            <p>
                {t("privacy.analytics.conclusion")}
            </p>
        </article>

        <article>
            <h2>
                {t("privacy.consent.title")}
            </h2>
            <p>
                {t("privacy.consent.desc1")} <b>{t("privacy.consent.desc2")}</b> {t("privacy.consent.desc3")}
            </p>
        </article>

        <article>
            <h2>
                {t("privacy.cookies.title")}
            </h2>
            <p>
                {t("privacy.cookies.desc")}
            </p>
            <ol>
                <li>
                    <b>{t("privacy.cookies.technical")}</b> {t("privacy.cookies.technicalDesc")}
                </li>
                <li>
                    <b>{t("privacy.cookies.statistical")}</b> {t("privacy.cookies.statisticalDesc")}
                    <ul>
                        <li>
                            <b>`_ga`:</b> {t("privacy.cookies.gaDesc")}
                        </li>
                        <li>
                            <b>`_ga_*`:</b> {t("privacy.cookies.gaStarDesc")}
                        </li>
                    </ul>
                </li>
            </ol>
        </article>

        <article>
            <h2>
                {t("privacy.rights.title")}
            </h2>
            <p>
                {t("privacy.rights.desc")}
            </p>
        </article>
    </div>  
    <Footer />
    </>
    );
}

export default Privacy;