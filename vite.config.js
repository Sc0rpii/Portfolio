import process from "node:process";
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

function normalizeSiteUrl(value) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      return "";
    }

    url.hash = "";
    url.search = "";
    url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;

    return url.href;
  } catch {
    return "";
  }
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL);

  const staticSeoPlugin = {
    name: "static-seo-head",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        if (!siteUrl) {
          return html;
        }

        const canonicalUrl = escapeHtml(siteUrl);
        const imageUrl = escapeHtml(new URL("og.png", siteUrl).href);
        const verificationTags = [
          env.VITE_GOOGLE_SITE_VERIFICATION
            ? `<meta name="google-site-verification" content="${escapeHtml(env.VITE_GOOGLE_SITE_VERIFICATION)}" />`
            : "",
          env.VITE_BING_SITE_VERIFICATION
            ? `<meta name="msvalidate.01" content="${escapeHtml(env.VITE_BING_SITE_VERIFICATION)}" />`
            : "",
        ].filter(Boolean);

        return html.replace(
          "</head>",
          `    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Mirko Freschi — Web &amp; iOS Developer" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:image:alt" content="Mirko Freschi — Web &amp; iOS Developer" />
${verificationTags.map((tag) => `    ${tag}`).join("\n")}
  </head>`,
        );
      },
    },
  };

  return {
    base: siteUrl ? new URL(siteUrl).pathname : "/",
    plugins: [react(), tailwindcss(), staticSeoPlugin],
  };
})
