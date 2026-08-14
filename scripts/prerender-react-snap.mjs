import { existsSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { run } = require("react-snap");
const projectRoot = process.cwd();
const distDirectory = resolve(projectRoot, "dist");
const projectDirectory = resolve(distDirectory, "project");
const macOsChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const configuredBrowser =
    process.env.PUPPETEER_EXECUTABLE_PATH?.trim() ||
    process.env.CHROME_PATH?.trim();
const browserExecutablePath = configuredBrowser ||
    (process.platform === "darwin" && existsSync(macOsChrome)
        ? macOsChrome
        : undefined);

if (!existsSync(resolve(distDirectory, "index.html"))) {
    throw new Error("Cannot prerender: dist/index.html does not exist.");
}

const projectRoutes = existsSync(projectDirectory)
    ? readdirSync(projectDirectory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => `/project/${entry.name}`)
    : [];

const routes = ["/", "/services", "/404.html", ...projectRoutes];

await run({
    source: "dist",
    destination: "dist",
    include: routes,
    crawl: false,
    sourceMaps: false,
    fixWebpackChunksIssue: false,
    skipThirdPartyRequests: true,
    preconnectThirdParty: false,
    puppeteer: { cache: false },
    ...(browserExecutablePath
        ? { puppeteerExecutablePath: browserExecutablePath }
        : {}),
    minifyHtml: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        keepClosingSlash: true,
        removeComments: false,
        sortAttributes: false,
        sortClassName: false,
    },
});

// react-snap creates 200.html only as an internal history-API fallback while it
// crawls. Every public route has its own static document, so publishing it would
// expose a duplicate, non-prerendered URL to crawlers.
rmSync(resolve(distDirectory, "200.html"), { force: true });

console.info(`Prerender: generated static HTML for ${routes.length} public routes.`);
