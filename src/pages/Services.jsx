import Navbar from "../components/navigation/Navbar";
import CardServices from "../components/card/CardServices";
import Footer from "../components/section/Footer";
import CardDetails from "../components/card/CardDetails";
import CardEngagement from "../components/card/CardEngagement";
import Contact from "../components/section/Contact";
import CardPortfolio from "../components/card/CardPortfolio";
import Seo from "../components/seo/Seo";
import useScrollReveal from "../hooks/useScrollReveal";
import {
    getAbsoluteSiteUrl,
    siteConfig,
} from "../config/site";

import { servicesData } from "../data/servicesData";
import { detailsData } from "../data/detailsData";
import { engagementData } from "../data/engagementData";
import { moreProjects } from "../data/projects";
import { useTranslation } from "react-i18next";

function Services(){
    const {t} = useTranslation();
    useScrollReveal();
    const servicesUrl = getAbsoluteSiteUrl("/services");
    const homeUrl = getAbsoluteSiteUrl("/");
    const servicesDescription =
        t("service.description");
    const servicesStructuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${servicesUrl}#webpage`,
                url: servicesUrl,
                name: "Web, iOS & UI/UX Development Services",
                description: servicesDescription,
                inLanguage: siteConfig.language,
                isPartOf: {
                    "@id": `${homeUrl}#website`,
                },
                about: {
                    "@id": `${homeUrl}#person`,
                },
            },
            {
                "@type": "ItemList",
                "@id": `${servicesUrl}#services`,
                name: "Development and design services",
                itemListElement: servicesData.map((service, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    item: {
                        "@type": "Service",
                        name: service.title,
                        description: service.description,
                        url: `${servicesUrl}#services`,
                        provider: {
                            "@type": "Person",
                            "@id": `${homeUrl}#person`,
                            name: siteConfig.name,
                        },
                    },
                })),
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: homeUrl,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Services",
                        item: servicesUrl,
                    },
                ],
            },
        ],
    };

    return(
        <>
            <Seo
                title="Web, iOS & UI/UX Development Services | Mirko Freschi"
                description={servicesDescription}
                path="/services"
                structuredData={servicesStructuredData}
            />
            <header>
                <Navbar />
            </header>
            <main className="min-h-[75vh] py-16 sm:py-20 lg:py-24">
                <div className="flex flex-col gap-20 sm:gap-24 lg:gap-32">
                    <section id="services"
                    data-reveal
                    className="flex flex-col items-center justify-center gap-6 px-5 text-center"
                    >
                        <p className="text-sm font-body text-heading">
                            {t("service.section")}
                        </p>
                        <h1 className="text-3xl font-bold font-display text-heading sm:text-4xl lg:text-5xl">
                            {t("service.title")}
                        </h1>
                        <p className="max-w-3xl text-sm leading-6 font-body sm:text-base">
                            {t("service.description")}
                        </p>
                        <div className="grid w-full max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {servicesData.map((service) => (
                                <CardServices 
                                key={service.id}
                                {...service}
                                />
                            ))}
                        </div>
                    </section>

                    <section id="details"
                    data-reveal
                    className="flex flex-col items-center justify-center gap-6 px-5 text-center"
                    >
                        <p className="text-sm font-body text-heading">
                            {t("service.hosting.detail")}
                        </p>
                        <h2 className="text-3xl font-bold font-display text-heading sm:text-4xl lg:text-5xl">
                            {t("service.hosting.title")}
                        </h2>
                        <p className="max-w-3xl text-sm leading-6 font-body sm:text-base">
                            {t("service.hosting.description")}
                        </p>
                        <div className="grid w-full max-w-6xl grid-cols-1 gap-5 md:grid-cols-2">
                            {detailsData.map((detail) => (
                                <CardDetails 
                                key={detail.id}
                                {...detail}
                                />
                            ))}
                        </div>
                    </section>

                    {moreProjects.length > 0 && (
                        <section id="moreProject"
                        data-reveal
                        className="w-full bg-surface"
                        >
                            <div
                            className="px-5 py-12 sm:px-8 sm:py-16 lg:p-15">
                                <p className="text-sm font-body text-heading">
                                    {t("moreproject.section")}
                                </p>
                                <h2 className="mt-2 text-3xl font-bold font-display text-heading sm:text-4xl lg:text-5xl">
                                    {t("moreproject.title")}
                                </h2>
                                <p className="max-w-3xl mt-3 text-sm leading-6 font-body sm:text-base">
                                    {t("moreproject.description")}
                                </p>
                                <div
                                className="flex flex-row gap-5 px-1 py-5 mt-3 overflow-x-auto overscroll-x-contain touch-pan-x sm:px-2 snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden"
                                >
                                    {moreProjects.map((project) => (
                                        <div
                                        key={project.id}
                                        className="shrink-0 snap-start basis-[85%] md:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-2.5rem)/3)]"
                                        >
                                            <CardPortfolio {...project}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    <section id="engagement"
                    data-reveal
                    className="flex flex-col items-center justify-center gap-6 px-5 text-center"
                    >
                        <p className="text-sm font-body text-heading">
                            {t("engagment.section")}
                        </p>
                        <h2 className="text-3xl font-bold font-display text-heading sm:text-4xl lg:text-5xl">
                            {t("engagment.title")}
                        </h2>
                        <p className="max-w-3xl text-sm leading-6 font-body sm:text-base">
                            {t("engagment.description")}
                        </p>
                        <div className="grid w-full max-w-6xl grid-cols-1 gap-5 md:grid-cols-2">
                            {engagementData.map((engagement) => (
                                <CardEngagement
                                key={engagement.id}
                                {...engagement}
                                />
                            ))}
                        </div>
                    </section>

                    <section id="contact"
                    data-reveal
                    className="px-5 py-16 bg-surface sm:px-8 sm:py-20">
                        <Contact />
                    </section>
                </div>
            </main>

            <footer className="w-full px-5 py-12 mt-20 border-t border-border sm:px-8 sm:py-16 sm:mt-28 lg:px-12.5">
                <Footer />
            </footer>
        </>
    );
}

export default Services;
