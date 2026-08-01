import {
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
    structuredData,
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

    if (canonicalUrl) {
        output = setCanonical(output, canonicalUrl);
        output = setMeta(output, "property", "og:url", canonicalUrl);
    } else {
        output = removeCanonical(output);
    }

    return structuredData
        ? setStructuredData(output, structuredData)
        : output.replace(
            /\s*<script\s+id="route-structured-data"[^>]*>[\s\S]*?<\/script>/i,
            "",
        );
}

function readProjectMetadata() {
    const projectsDirectory = resolve(projectRoot, "src/data/projects");
    const stringLiteral = '"(?:\\\\.|[^"\\\\])*"';
    const objectPattern = new RegExp(
        `\\{[\\s\\S]*?\\bid:\\s*(${stringLiteral})[\\s\\S]*?\\btitle:\\s*(${stringLiteral})[\\s\\S]*?\\bdescription:\\s*(${stringLiteral})[\\s\\S]*?\\}`,
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
                title: JSON.parse(match[2]),
                description: JSON.parse(match[3]),
            }));
        });
}

function writeRouteHtml(routePath, html) {
    const outputPath = resolve(projectRoot, "dist", routePath, "index.html");
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, html, "utf8");
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
const siteDescription =
    "Portfolio of Mirko Freschi, a freelance Web and iOS Developer creating fast, accessible and maintainable digital products.";
const socialProfiles = [
    "https://www.instagram.com/mirkofreschi.dev/",
    "https://www.tiktok.com/@mirkofreschi.dev",
    "https://www.facebook.com/mirkofreschi.dev",
    "https://github.com/Sc0rpii",
    "https://www.linkedin.com/in/mirko-freschi-1b292b286/",
];
const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Person",
            "@id": personId,
            name: "Mirko Freschi",
            url: siteUrl,
            jobTitle: "Web & iOS Developer",
            description: siteDescription,
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
            url: siteUrl,
            name: "Mirko Freschi",
            description: siteDescription,
            inLanguage: "en",
            author: { "@id": personId },
        },
        {
            "@type": "ProfilePage",
            url: siteUrl,
            name: "Mirko Freschi — Web & iOS Developer",
            description: siteDescription,
            inLanguage: "en",
            mainEntity: { "@id": personId },
            isPartOf: { "@id": websiteId },
        },
    ],
};
const homeHtml = setPageMetadata(baseHtml, {
    title: "Mirko Freschi | Web & iOS Developer",
    description: siteDescription,
    canonicalUrl: siteUrl,
    structuredData: homeStructuredData,
});
writeFileSync(indexPath, homeHtml, "utf8");

const servicesUrl = new URL("services", siteUrl).href;
const servicesDescription =
    "Web development, native iOS development and UI/UX design services by Mirko Freschi for clear, reliable and maintainable digital products.";
const serviceItems = [
    ["Web Development", "Clean, responsive websites designed for clarity and usability."],
    ["iOS Development", "Native iOS apps built with performance and user experience in mind."],
    ["UI & UX Design", "Interface and experience design focused on structure and flow."],
];
const servicesHtml = setPageMetadata(homeHtml, {
    title: "Web, iOS & UI/UX Development Services | Mirko Freschi",
    description: servicesDescription,
    canonicalUrl: servicesUrl,
    structuredData: {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                url: servicesUrl,
                name: "Web, iOS & UI/UX Development Services",
                description: servicesDescription,
                inLanguage: "en",
                isPartOf: { "@id": websiteId },
                about: { "@id": personId },
            },
            {
                "@type": "ItemList",
                name: "Development and design services",
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
        ],
    },
});
writeRouteHtml("services", servicesHtml);

const projects = readProjectMetadata();
projects.forEach((project) => {
    const routePath = `project/${encodeURIComponent(project.id)}`;
    const projectUrl = new URL(routePath, siteUrl).href;
    const projectHtml = setPageMetadata(homeHtml, {
        title: `${project.title} | Project by Mirko Freschi`,
        description: project.description,
        canonicalUrl: projectUrl,
        type: "article",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            url: projectUrl,
            name: project.title,
            description: project.description,
            inLanguage: "en",
            creator: {
                "@type": "Person",
                "@id": personId,
                name: "Mirko Freschi",
            },
        },
    });
    writeRouteHtml(routePath, projectHtml);
});

const notFoundHtml = setPageMetadata(homeHtml, {
    title: "Page not found | Mirko Freschi",
    description:
        "The requested page could not be found. Return to Mirko Freschi's Web and iOS development portfolio.",
    canonicalUrl: "",
    robots: "noindex, follow",
});
writeFileSync(resolve(projectRoot, "dist/404.html"), notFoundHtml, "utf8");
cleanBuildMetadata(resolve(projectRoot, "dist"));

console.info(
    `SEO: generated static metadata for Home, Services, ${projects.length} projects and 404.`,
);
