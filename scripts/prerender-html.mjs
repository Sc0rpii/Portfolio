import { readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { relative, resolve, sep } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { build } from "vite";

// Renders the React markup of every static route into the page that
// prerender-static-heads.mjs already wrote, so crawlers receive the full content
// without executing JavaScript. Runs on any Node build host (Vercel included).

const projectRoot = process.cwd();
const distDirectory = resolve(projectRoot, "dist");
const ssrDirectory = resolve(projectRoot, "dist-ssr");

function findPages(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const entryPath = resolve(directory, entry.name);

        if (entry.isDirectory()) {
            return entry.name === "assets" ? [] : findPages(entryPath);
        }

        return entry.name === "index.html" ? [entryPath] : [];
    });
}

// macOS writes AppleDouble "._*" files and extended attributes when building on
// external drives; remove them last so a locally published dist/ stays clean.
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

// 404.html stays an empty shell: Vercel serves it for any unknown URL in either
// language, so the client renders the right page instead of hydrating markup
// made for a different path.
function getRoutePath(pagePath) {
    const directory = relative(distDirectory, resolve(pagePath, ".."));
    return `/${directory.split(sep).filter(Boolean).join("/")}`;
}

await build({
    logLevel: "warn",
    build: {
        ssr: resolve(projectRoot, "src/entry-server.jsx"),
        outDir: ssrDirectory,
        emptyOutDir: true,
        copyPublicDir: false,
    },
});

try {
    const { render } = await import(
        pathToFileURL(resolve(ssrDirectory, "entry-server.js")).href
    );
    const pages = findPages(distDirectory);

    for (const pagePath of pages) {
        const html = readFileSync(pagePath, "utf8");
        const markup = await render(getRoutePath(pagePath));

        if (!html.includes('<div id="root"></div>')) {
            throw new Error(`Prerender: no empty #root in ${pagePath}.`);
        }

        writeFileSync(
            pagePath,
            html
                .replace('<div id="root"></div>', () => `<div id="root">${markup}</div>`)
                .replace(/<html\b/i, "<html data-prerendered"),
            "utf8",
        );
    }

    console.info(`Prerender: rendered ${pages.length} static pages.`);
} finally {
    rmSync(ssrDirectory, { recursive: true, force: true });
}

cleanBuildMetadata(distDirectory);
