import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/navigation/Navbar";
import Seo from "../components/seo/Seo";
import useScrollReveal from "../hooks/useScrollReveal";
import { getLocaleFromPathname, localizePath } from "../utils/locale";

function PageNotFound(){
    const { t } = useTranslation();
    useScrollReveal();
    const { pathname } = useLocation();
    const homePath = localizePath('/', getLocaleFromPathname(pathname));

    return(
        <>
            <Seo
                title={t("notFound.title")}
                description={t("notFound.description")}
                robots="noindex, follow"
                canonical={false}
                structuredData={null}
            />
            <header>
                <Navbar />
            </header>
            <main className="flex min-h-[75vh] items-center px-5 py-16 sm:px-8 sm:py-24">
                <div data-reveal className="max-w-3xl mx-auto text-center">
                    <p className="text-6xl font-bold font-display text-primary sm:text-8xl">404</p>
                    <h1 className="mt-5 text-3xl font-bold font-display text-heading sm:mt-6 sm:text-4xl">
                        {t("notFound.heading")}
                    </h1>
                    <p className="mt-4 text-base leading-7 font-body sm:text-lg">
                        {t("notFound.body")}
                    </p>
                    <Link
                        to={`${homePath}#hero`}
                        className="inline-block px-6 py-4 mt-8 transition-transform duration-200 bg-primary rounded-button text-heading hover:-translate-y-0.5 sm:mt-10 sm:px-7.5"
                    >
                        {t("notFound.cta")}
                    </Link>
                </div>
            </main>
        </>
    );
}

export default PageNotFound;
