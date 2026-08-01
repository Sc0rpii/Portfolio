import {
    readdirSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
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

    try {
        const url = new URL(value);

        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("the URL must use http or https");
        }

        url.hash = "";
        url.search = "";
        url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;

        return url.href;
    } catch (error) {
        throw new Error(`Invalid VITE_SITE_URL: ${error.message}`);
    }
}

function escapeXml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("'", "&apos;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function getProjects() {
    const projectsDirectory = resolve(projectRoot, "src/data/projects");
    const projectFiles = readdirSync(projectsDirectory)
        .filter((fileName) => fileName.endsWith("Projects.js"));
    const projects = new Map();
    const stringLiteral = '"(?:\\\\.|[^"\\\\])*"';
    const objectPattern = new RegExp(
        `\\{[\\s\\S]*?\\bid:\\s*(${stringLiteral})[\\s\\S]*?\\btitle:\\s*(${stringLiteral})[\\s\\S]*?\\bdescription:\\s*(${stringLiteral})[\\s\\S]*?\\}`,
        "g",
    );

    projectFiles.forEach((fileName) => {
        const source = readFileSync(resolve(projectsDirectory, fileName), "utf8");

        for (const match of source.matchAll(objectPattern)) {
            const project = {
                id: JSON.parse(match[1]),
                title: JSON.parse(match[2]),
                description: JSON.parse(match[3]),
            };
            projects.set(project.id, project);
        }
    });

    return [...projects.values()];
}

function getLlmsTxt(siteUrl, projects) {
    const getPageUrl = (path = "") => {
        if (siteUrl) {
            return new URL(path, siteUrl).href;
        }

        return path ? `./${path}` : "./";
    };
    const projectLinks = projects
        .map((project) => {
            const path = `project/${encodeURIComponent(project.id)}`;
            return `- [${project.title}](${getPageUrl(path)}): ${project.description}`;
        })
        .join("\n");

    return `# Mirko Freschi — Web & iOS Developer

> Official portfolio of Mirko Freschi, a freelance developer who designs and builds web interfaces, native iOS applications and maintainable digital products.

The website is written in English. Its primary content covers Mirko's professional profile, development and design services, selected client work, personal projects, experience, certifications and testimonials.

## Main pages

- [Portfolio and professional profile](${getPageUrl()}): Overview of Mirko Freschi, technical expertise, selected work, experience, certifications, testimonials and contact channels.
- [Development and design services](${getPageUrl("services")}): Web development, native iOS development and UI/UX design services, including project responsibilities and collaboration models.

## Projects

${projectLinks}

## Professional profiles

- [GitHub](https://github.com/Sc0rpii): Public source-code repositories and development projects.
- [LinkedIn](https://www.linkedin.com/in/mirko-freschi-1b292b286/): Professional profile and career information.

## Optional

- [Instagram](https://www.instagram.com/mirkofreschi.dev/): Social updates from Mirko Freschi.
- [TikTok](https://www.tiktok.com/@mirkofreschi.dev): Short-form development and portfolio content.
- [Facebook](https://www.facebook.com/mirkofreschi.dev): Social profile and updates.
`;
}

const siteUrl = getSiteUrl(env.VITE_SITE_URL);
const projects = getProjects();
const robotsPath = resolve(projectRoot, "public/robots.txt");
const sitemapPath = resolve(projectRoot, "public/sitemap.xml");
const llmsPath = resolve(projectRoot, "public/llms.txt");

writeFileSync(llmsPath, getLlmsTxt(siteUrl, projects), "utf8");

if (!siteUrl) {
    writeFileSync(robotsPath, "User-agent: *\nAllow: /\n", "utf8");
    rmSync(sitemapPath, { force: true });
    console.info(
        "SEO: generated llms.txt; robots.txt has no sitemap until VITE_SITE_URL is configured.",
    );
    process.exit(0);
}

const routePaths = [
    "",
    "services",
    ...projects.map((project) => `project/${encodeURIComponent(project.id)}`),
];
const urls = routePaths.map((path) => new URL(path, siteUrl).href);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`)
    .join("\n")}
</urlset>
`;

writeFileSync(
    robotsPath,
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL("sitemap.xml", siteUrl).href}\n`,
    "utf8",
);
writeFileSync(sitemapPath, sitemap, "utf8");
console.info(
    `SEO: generated sitemap.xml with ${urls.length} indexable URLs and llms.txt.`,
);
