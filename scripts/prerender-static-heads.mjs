import {
    existsSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { loadEnv } from "vite";

const projectRoot = process.cwd();
const mode = process.env.NODE_ENV || "production";
const env = {
    ...loadEnv(mode, projectRoot, ""),
    ...process.env,
};
const preserveRenderedHtml = env.PRERENDERED_HTML === "true";

function getSiteUrl(value) {
    if (!value) {
        return "";
    }

    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("VITE_SITE_URL must use http or https.");
    }

    url.hash = "";
    url.search = "";
    url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;

    return url.href;
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function setTitle(html, title) {
    return html.replace(
        /<title>[\s\S]*?<\/title>/i,
        `<title>${escapeHtml(title)}</title>`,
    );
}

function setMeta(html, attribute, key, value) {
    const pattern = new RegExp(
        `<meta\\s+[^>]*${attribute}="${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`,
        "i",
    );
    const tag = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;

    if (pattern.test(html)) {
        return html.replace(pattern, tag);
    }

    return html.replace("</head>", `    ${tag}\n  </head>`);
}

function setCanonical(html, url) {
    const tag = `<link rel="canonical" href="${escapeHtml(url)}" />`;

    if (/<link\s+[^>]*rel="canonical"[^>]*>/i.test(html)) {
        return html.replace(/<link\s+[^>]*rel="canonical"[^>]*>/i, tag);
    }

    return html.replace("</head>", `    ${tag}\n  </head>`);
}

function removeCanonical(html) {
    return html
        .replace(/\s*<link\s+[^>]*rel="canonical"[^>]*>/i, "")
        .replace(/\s*<meta\s+[^>]*property="og:url"[^>]*>/i, "");
}

function setHtmlLang(html, lang) {
    return html.replace(/<html\s+lang="[^"]*"/i, `<html lang="${escapeHtml(lang)}"`);
}

function setAlternateLinks(html, alternates) {
    let output = html.replace(
        /\s*<link\s+[^>]*rel="alternate"\s+hreflang="[^"]*"[^>]*>/gi,
        "",
    );
    const tags = Object.entries(alternates)
        .map(([hreflang, href]) => `    <link rel="alternate" hreflang="${hreflang}" href="${escapeHtml(href)}" />`)
        .join("\n");

    return output.replace("</head>", `${tags}\n  </head>`);
}

function setStructuredData(html, data) {
    const script = `<script id="route-structured-data" type="application/ld+json">${JSON.stringify(data).replaceAll("<", "\\u003c")}</script>`;
    const pattern =
        /<script\s+id="route-structured-data"[^>]*>[\s\S]*?<\/script>/i;

    if (pattern.test(html)) {
        return html.replace(pattern, script);
    }

    return html.replace("</head>", `    ${script}\n  </head>`);
}

function setPageMetadata(html, {
    title,
    description,
    canonicalUrl,
    robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    type = "website",
    imageUrl,
    imageType,
    imageWidth,
    imageHeight,
    imageAlt,
    structuredData,
    lang,
    alternates,
}) {
    let output = setTitle(html, title);

    [
        ["name", "description", description],
        ["name", "robots", robots],
        ["name", "googlebot", robots],
        ["property", "og:title", title],
        ["property", "og:description", description],
        ["property", "og:type", type],
        ["name", "twitter:title", title],
        ["name", "twitter:description", description],
    ].forEach(([attribute, key, value]) => {
        output = setMeta(output, attribute, key, value);
    });

    if (lang) {
        output = setHtmlLang(output, lang);
        output = setMeta(output, "property", "og:locale", lang === "it" ? "it_IT" : "en_US");
    }

    if (alternates) {
        output = setAlternateLinks(output, alternates);
    }

    if (canonicalUrl) {
        output = setCanonical(output, canonicalUrl);
        output = setMeta(output, "property", "og:url", canonicalUrl);
    } else {
        output = removeCanonical(output);
    }

    if (imageUrl) {
        [
            ["property", "og:image", imageUrl],
            ["property", "og:image:secure_url", imageUrl],
            ["property", "og:image:type", imageType],
            ["property", "og:image:width", String(imageWidth)],
            ["property", "og:image:height", String(imageHeight)],
            ["property", "og:image:alt", imageAlt],
            ["name", "twitter:image", imageUrl],
            ["name", "twitter:image:alt", imageAlt],
        ].forEach(([attribute, key, value]) => {
            output = setMeta(output, attribute, key, value);
        });
    }

    return structuredData
        ? setStructuredData(output, structuredData)
        : output.replace(
            /\s*<script\s+id="route-structured-data"[^>]*>[\s\S]*?<\/script>/i,
            "",
        );
}

const englishTranslations = JSON.parse(
    readFileSync(resolve(projectRoot, "src/languages/eng.json"), "utf8"),
);
const italianTranslations = JSON.parse(
    readFileSync(resolve(projectRoot, "src/languages/it.json"), "utf8"),
);
const translationsByLocale = { en: englishTranslations, it: italianTranslations };

function getTranslation(locale, key) {
    const value = key.split(".").reduce(
        (translation, segment) => translation?.[segment],
        translationsByLocale[locale],
    );

    if (typeof value !== "string") {
        throw new Error(`Missing ${locale} translation for key "${key}".`);
    }

    return value;
}

function getEnglishTranslation(key) {
    return getTranslation("en", key);
}

function readProjectMetadata() {
    const projectsDirectory = resolve(projectRoot, "src/data/projects");
    const stringLiteral = '"(?:\\\\.|[^"\\\\])*"';
    const objectPattern = new RegExp(
        `\\{[\\s\\S]*?\\bid:\\s*(${stringLiteral})[\\s\\S]*?\\bwidth:\\s*(\\d+)[\\s\\S]*?\\bheight:\\s*(\\d+)[\\s\\S]*?\\btitle:\\s*(${stringLiteral})[\\s\\S]*?\\bdescriptionKey:\\s*(${stringLiteral})[\\s\\S]*?\\}`,
        "g",
    );

    return readdirSync(projectsDirectory)
        .filter((fileName) => fileName.endsWith("Projects.js"))
        .flatMap((fileName) => {
            const source = readFileSync(
                resolve(projectsDirectory, fileName),
                "utf8",
            );

            return [...source.matchAll(objectPattern)].map((match) => ({
                id: JSON.parse(match[1]),
                width: Number(match[2]),
                height: Number(match[3]),
                title: JSON.parse(match[4]),
                descriptionKey: JSON.parse(match[5]),
                description: getEnglishTranslation(JSON.parse(match[5])),
            }));
        });
}

function writeHtml(outputPath, html) {
    let output = html;

    if (preserveRenderedHtml && existsSync(outputPath)) {
        const renderedHtml = readFileSync(outputPath, "utf8");
        const renderedBody = renderedHtml.match(/<body\b[^>]*>[\s\S]*<\/body>/i);

        if (renderedBody) {
            output = output.replace(
                /<body\b[^>]*>[\s\S]*<\/body>/i,
                renderedBody[0],
            );
        }
    }

    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, output, "utf8");
}

function writeRouteHtml(routePath, html) {
    writeHtml(resolve(projectRoot, "dist", routePath, "index.html"), html);
}

function removeAppleDoubleFiles(directory) {
    readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
        const entryPath = resolve(directory, entry.name);

        if (entry.name.startsWith("._")) {
            rmSync(entryPath, { force: true, recursive: entry.isDirectory() });
            return;
        }

        if (entry.isDirectory()) {
            removeAppleDoubleFiles(entryPath);
        }
    });
}

function cleanBuildMetadata(directory) {
    if (process.platform === "darwin") {
        spawnSync("xattr", ["-cr", directory], { stdio: "ignore" });
    }

    removeAppleDoubleFiles(directory);
}

const siteUrl = getSiteUrl(env.VITE_SITE_URL);

if (!siteUrl) {
    cleanBuildMetadata(resolve(projectRoot, "dist"));
    console.info(
        "SEO: VITE_SITE_URL is not configured; static route metadata was skipped.",
    );
    process.exit(0);
}

const indexPath = resolve(projectRoot, "dist/index.html");
const baseHtml = readFileSync(indexPath, "utf8");
const personId = `${siteUrl}#person`;
const websiteId = `${siteUrl}#website`;
const socialProfiles = [
    "https://www.instagram.com/mirkofreschi.dev/",
    "https://www.tiktok.com/@mirkofreschi.dev",
    "https://www.facebook.com/mirkofreschi.dev",
    "https://github.com/Sc0rpii",
    "https://www.linkedin.com/in/mirko-freschi-1b292b286/",
];
const locales = ["en", "it"];

function getLocalizedRoutePath(routePath, locale) {
    if (locale !== "it") {
        return routePath;
    }

    return routePath ? `it/${routePath}` : "it";
}

function getLocalizedUrl(routePath, locale) {
    return new URL(getLocalizedRoutePath(routePath, locale), siteUrl).href;
}

function getAlternates(routePath) {
    return {
        en: getLocalizedUrl(routePath, "en"),
        it: getLocalizedUrl(routePath, "it"),
        "x-default": getLocalizedUrl(routePath, "en"),
    };
}

locales.forEach((locale) => {
    const homeUrl = getLocalizedUrl("", locale);
    const homeDescription = getTranslation(locale, "seo.homeDescription");
    const homeTitle = getTranslation(locale, "seo.homeTitle");
    const homeStructuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": personId,
                name: "Mirko Freschi",
                url: siteUrl,
                jobTitle: "Web & iOS Developer",
                description: homeDescription,
                sameAs: socialProfiles,
                knowsAbout: [
                    "Web Development",
                    "iOS Development",
                    "React",
                    "Tailwind CSS",
                    "Swift",
                    "SwiftUI",
                    "UI/UX Design",
                ],
            },
            {
                "@type": "WebSite",
                "@id": websiteId,
                url: homeUrl,
                name: "Mirko Freschi",
                description: homeDescription,
                inLanguage: locale,
                author: { "@id": personId },
            },
            {
                "@type": "ProfilePage",
                url: homeUrl,
                name: `Mirko Freschi — ${getTranslation(locale, "hero.subtitle")}`,
                description: homeDescription,
                inLanguage: locale,
                mainEntity: { "@id": personId },
                isPartOf: { "@id": websiteId },
            },
        ],
    };
    const homeHtml = setPageMetadata(baseHtml, {
        title: homeTitle,
        description: homeDescription,
        canonicalUrl: homeUrl,
        structuredData: homeStructuredData,
        lang: locale,
        alternates: getAlternates(""),
    });
    writeRouteHtml(getLocalizedRoutePath("", locale), homeHtml);
});

locales.forEach((locale) => {
    const servicesUrl = getLocalizedUrl("services", locale);
    const homeUrl = getLocalizedUrl("", locale);
    const servicesDescription = getTranslation(locale, "service.description");
    const servicesTitle = getTranslation(locale, "seo.servicesTitle");
    const serviceItems = [
        [
            getTranslation(locale, "service.services.web.title"),
            getTranslation(locale, "service.services.web.description"),
        ],
        [
            getTranslation(locale, "service.services.ios.title"),
            getTranslation(locale, "service.services.ios.description"),
        ],
        [
            getTranslation(locale, "service.services.ui.title"),
            getTranslation(locale, "service.services.ui.description"),
        ],
    ];
    const servicesHtml = setPageMetadata(baseHtml, {
        title: servicesTitle,
        description: servicesDescription,
        canonicalUrl: servicesUrl,
        lang: locale,
        alternates: getAlternates("services"),
        structuredData: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebPage",
                    url: servicesUrl,
                    name: servicesTitle,
                    description: servicesDescription,
                    inLanguage: locale,
                    isPartOf: { "@id": websiteId },
                    about: { "@id": personId },
                },
                {
                    "@type": "ItemList",
                    name: servicesTitle,
                    itemListElement: serviceItems.map(([name, description], index) => ({
                        "@type": "ListItem",
                        position: index + 1,
                        item: {
                            "@type": "Service",
                            name,
                            description,
                            url: `${servicesUrl}#services`,
                            provider: {
                                "@type": "Person",
                                "@id": personId,
                                name: "Mirko Freschi",
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
                            name: getTranslation(locale, "service.section"),
                            item: servicesUrl,
                        },
                    ],
                },
            ],
        },
    });
    writeRouteHtml(getLocalizedRoutePath("services", locale), servicesHtml);
});

const projects = readProjectMetadata();
projects.forEach((project) => {
    const routePath = `project/${encodeURIComponent(project.id)}`;
    const projectImagePath = `og/projects/${encodeURIComponent(project.id)}.jpg`;
    const projectImageSource = resolve(projectRoot, "public", projectImagePath);

    if (!existsSync(projectImageSource)) {
        throw new Error(
            `Missing Open Graph image for project "${project.id}": public/${projectImagePath}`,
        );
    }

    const projectImageUrl = new URL(projectImagePath, siteUrl).href;

    locales.forEach((locale) => {
        const projectUrl = getLocalizedUrl(routePath, locale);
        const homeUrl = getLocalizedUrl("", locale);
        const description = getTranslation(locale, project.descriptionKey);
        const title = getTranslation(locale, "projectDetail.seoTitle")
            .replace("{{project}}", project.title)
            .replace("{{name}}", "Mirko Freschi");
        const projectImageAlt = getTranslation(locale, "projectDetail.imageAlt").replace(
            "{{project}}",
            project.title,
        );
        const projectHtml = setPageMetadata(baseHtml, {
            title,
            description,
            canonicalUrl: projectUrl,
            type: "article",
            imageUrl: projectImageUrl,
            imageType: "image/jpeg",
            imageWidth: project.width,
            imageHeight: project.height,
            imageAlt: projectImageAlt,
            lang: locale,
            alternates: getAlternates(routePath),
            structuredData: {
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "WebPage",
                        "@id": `${projectUrl}#webpage`,
                        url: projectUrl,
                        name: title,
                        description,
                        inLanguage: locale,
                        isPartOf: { "@id": websiteId },
                    },
                    {
                        "@type": "CreativeWork",
                        "@id": `${projectUrl}#project`,
                        url: projectUrl,
                        name: project.title,
                        description,
                        image: projectImageUrl,
                        inLanguage: locale,
                        mainEntityOfPage: { "@id": `${projectUrl}#webpage` },
                        creator: {
                            "@type": "Person",
                            "@id": personId,
                            name: "Mirko Freschi",
                        },
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
            },
        });
        writeRouteHtml(getLocalizedRoutePath(routePath, locale), projectHtml);
    });
});

if (preserveRenderedHtml) {
    const notFoundHtml = setPageMetadata(baseHtml, {
        title: "Page not found | Mirko Freschi",
        description:
            "The requested page could not be found. Return to Mirko Freschi's Web and iOS development portfolio.",
        canonicalUrl: "",
        robots: "noindex, follow",
    });
    writeHtml(resolve(projectRoot, "dist/404.html"), notFoundHtml);
}

cleanBuildMetadata(resolve(projectRoot, "dist"));

console.info(
    `SEO: generated static metadata for Home, Services and ${projects.length} projects across ${locales.length} locales.`,
);
