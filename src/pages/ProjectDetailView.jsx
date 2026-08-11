import { useLayoutEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { allProjects, professionalProjects } from "../data/projects";

import visitIcon from "../assets/icon/lets-icons_out.svg"

import Footer from "../components/section/Footer";
import Seo from "../components/seo/Seo";
import useScrollReveal from "../hooks/useScrollReveal";
import {
    getAbsoluteSiteUrl,
    siteConfig,
} from "../config/site";

function ProjectDetailView(){
    const { id } = useParams();
    useScrollReveal();

    useLayoutEffect(() => {
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;

        root.style.scrollBehavior = "auto";
        window.scrollTo(0, 0);
        root.style.scrollBehavior = previousScrollBehavior;
    }, [id]);

    const project = allProjects.find(
        (item) => String(item.id) === id
    );

    if(!project){
        return <Navigate to="/404" replace />;
    }

    const isProfessionalProject = professionalProjects.some(
        (item) => String(item.id) === id
    );
    const projectType = isProfessionalProject
        ? "Professional project"
        : "Personal exploration";
    const projectFocus = isProfessionalProject
        ? "Production-ready work"
        : "Concept and experimentation";
    const overview = project.accurateDescription?.trim() || project.description;
    const overviewParagraphs = overview
        .split(/\n\s*\n/)
        .filter(Boolean);
    const projectPath = `/project/${encodeURIComponent(project.id)}`;
    const projectSocialImage = `/og/projects/${encodeURIComponent(project.id)}.jpg`;
    const projectUrl = getAbsoluteSiteUrl(projectPath);
    const homeUrl = getAbsoluteSiteUrl("/");
    const projectImageUrl = getAbsoluteSiteUrl(projectSocialImage);
    const projectStructuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${projectUrl}#webpage`,
                url: projectUrl,
                name: `${project.title} | Project by ${siteConfig.name}`,
                description: overview,
                inLanguage: siteConfig.language,
                isPartOf: {
                    "@id": `${homeUrl}#website`,
                },
            },
            {
                "@type": "CreativeWork",
                "@id": `${projectUrl}#project`,
                url: projectUrl,
                name: project.title,
                description: overview,
                image: projectImageUrl,
                inLanguage: siteConfig.language,
                mainEntityOfPage: {
                    "@id": `${projectUrl}#webpage`,
                },
                creator: {
                    "@type": "Person",
                    "@id": `${homeUrl}#person`,
                    name: siteConfig.name,
                },
                ...(project.url ? { sameAs: project.url } : {}),
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
                        name: project.title,
                        item: projectUrl,
                    },
                ],
            },
        ],
    };

    return(
        <>
            <Seo
                title={`${project.title} | Project by Mirko Freschi`}
                description={project.description}
                path={projectPath}
                type="article"
                image={projectSocialImage}
                imageAlt={`Preview of ${project.title}, a project by Mirko Freschi`}
                imageType="image/jpeg"
                imageWidth={String(project.width)}
                imageHeight={String(project.height)}
                structuredData={projectStructuredData}
            />
            <main className="relative px-4 pt-8 pb-16 overflow-hidden sm:px-8 sm:pt-10 sm:pb-20 lg:pt-16 lg:pb-24">
                <div className="relative">
                    <div
                        className="
                        hidden
                        sm:block
                        -z-1
                        absolute
                        -right-80
                        -top-40
                        w-187.5
                        aspect-square
                        rounded-full
                        bg-radial
                        from-shadow to-transparent
                        blur-xl
                        pointer-events-none"
                    />
                </div>

                <div className="w-full max-w-6xl mx-auto">
                    <Link
                        to="/#portfolio"
                        className="inline-flex items-center gap-2 text-sm font-bold transition-colors font-body text-body hover:text-primary"
                    >
                        <span aria-hidden="true">←</span>
                        Back to portfolio
                    </Link>

                    <section data-reveal className="grid gap-8 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:gap-10">
                        <div>
                            <p className="inline-flex px-3 py-2 text-xs font-bold border rounded-full border-border bg-surface font-body text-primary sm:px-4 sm:text-sm">
                                {projectType}
                            </p>
                            <h1 className="max-w-4xl mt-5 text-3xl font-bold leading-tight font-display text-heading sm:mt-6 sm:text-5xl lg:text-6xl">
                                {project.title}
                            </h1>
                            <p className="max-w-3xl mt-5 text-sm leading-7 font-body text-body sm:mt-6 sm:text-lg">
                                {project.description}
                            </p>
                        </div>

                        <div className="interactive-card p-5 border rounded-card border-border bg-surface sm:p-6">
                            <dl className="space-y-5 font-body">
                                <div>
                                    <dt className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                                        Project type
                                    </dt>
                                    <dd className="mt-2 text-base font-bold text-heading">
                                        {projectType}
                                    </dd>
                                </div>
                                <div className="pt-5 border-t border-border">
                                    <dt className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                                        Focus
                                    </dt>
                                    <dd className="mt-2 text-base font-bold text-heading">
                                        {projectFocus}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </section>

                    <figure data-reveal className="interactive-card group p-2 overflow-hidden border rounded-card border-border bg-surface sm:p-3">
                        <img
                            src={project.img}
                            alt={`Preview of ${project.title}`}
                            width={project.width}
                            height={project.height}
                            fetchPriority="high"
                            className="aspect-4/3 w-full object-cover object-top transition-transform duration-700 ease-out rounded-card group-hover:scale-[1.01] sm:aspect-video"
                        />
                        <figcaption className="sr-only">
                            Project preview for {project.title}
                        </figcaption>
                    </figure>

                    <section data-reveal className="grid gap-10 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
                        <article>
                            <p className="text-sm font-bold font-display text-primary">
                                Project overview
                            </p>
                            <h2 className="mt-3 text-2xl font-bold font-display text-heading sm:text-4xl">
                                About the project
                            </h2>
                            <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
                                {overviewParagraphs.map((paragraph, index) => (
                                    <p
                                        key={`${project.id}-paragraph-${index}`}
                                        className="text-sm leading-7 font-body text-body sm:text-base sm:leading-8"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </article>

                        <aside className="interactive-card h-fit border border-border bg-surface p-5 rounded-card sm:p-7 lg:sticky lg:top-8">
                            <p className="text-sm font-bold font-display text-primary">
                                Live website
                            </p>
                            <h2 className="mt-3 text-xl font-bold leading-snug font-display text-heading sm:text-2xl">
                                Explore the complete project.
                            </h2>
                            <p className="mt-4 text-sm leading-6 font-body text-body">
                                Open the hosted version to experience the interface,
                                content and interactions in their final context.
                            </p>

                            {project.url ? (
                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-7 inline-flex w-full items-center justify-center rounded-button bg-primary px-6 py-4 text-sm font-bold font-display text-heading transition-transform hover:-translate-y-0.5"
                                >
                                    Visit live website
                                    <span className="ml-2" aria-hidden="true">
                                        <img className="h-5 w-5 brightness-0 invert" src={visitIcon} alt="" />
                                    </span>
                                </a>
                            ) : (
                                <p
                                    className="px-6 py-4 text-sm font-bold text-center border mt-7 rounded-button border-border font-display text-body"
                                >
                                    Live link coming soon
                                </p>
                            )}
                        </aside>
                    </section>
                </div>
            </main>

            <footer className="w-full px-5 py-12 border-t border-border sm:px-8 sm:py-16 lg:px-12.5">
                <Footer />
            </footer>
        </>
    );
}

export default ProjectDetailView;
