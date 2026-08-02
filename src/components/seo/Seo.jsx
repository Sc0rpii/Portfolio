import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    getAbsoluteSiteUrl,
    siteConfig,
} from "../../config/site";

const DEFAULT_ROBOTS =
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

function upsertMeta(selector, attribute, value) {
    let element = document.head.querySelector(selector);

    if (!value) {
        element?.remove();
        return;
    }

    if (!element) {
        element = document.createElement("meta");
        document.head.appendChild(element);
    }

    const [attributeName, attributeValue] = attribute;
    element.setAttribute(attributeName, attributeValue);
    element.setAttribute("content", value);
}

function upsertLink(rel, href) {
    let element = document.head.querySelector(`link[rel="${rel}"]`);

    if (!href) {
        element?.remove();
        return;
    }

    if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
    }

    element.setAttribute("href", href);
}

function Seo({
    title,
    description = siteConfig.description,
    path,
    type = "website",
    image = "/og.png",
    imageAlt = `${siteConfig.name} — ${siteConfig.role}`,
    imageType = "image/png",
    imageWidth = "1200",
    imageHeight = "630",
    robots = DEFAULT_ROBOTS,
    canonical = true,
    structuredData,
}) {
    const { pathname } = useLocation();

    useEffect(() => {
        const canonicalUrl = canonical
            ? getAbsoluteSiteUrl(path ?? pathname)
            : "";
        const imageUrl = image
            ? image.startsWith("http")
                ? image
                : getAbsoluteSiteUrl(image)
            : "";
        const fullTitle = title || `${siteConfig.name} | ${siteConfig.role}`;

        document.title = fullTitle;

        upsertMeta('meta[name="description"]', ["name", "description"], description);
        upsertMeta('meta[name="author"]', ["name", "author"], siteConfig.name);
        upsertMeta('meta[name="robots"]', ["name", "robots"], robots);
        upsertMeta('meta[name="googlebot"]', ["name", "googlebot"], robots);

        upsertMeta('meta[property="og:title"]', ["property", "og:title"], fullTitle);
        upsertMeta(
            'meta[property="og:description"]',
            ["property", "og:description"],
            description,
        );
        upsertMeta('meta[property="og:type"]', ["property", "og:type"], type);
        upsertMeta(
            'meta[property="og:site_name"]',
            ["property", "og:site_name"],
            siteConfig.name,
        );
        upsertMeta(
            'meta[property="og:locale"]',
            ["property", "og:locale"],
            siteConfig.locale,
        );
        upsertMeta('meta[property="og:url"]', ["property", "og:url"], canonicalUrl);
        upsertMeta('meta[property="og:image"]', ["property", "og:image"], imageUrl);
        upsertMeta(
            'meta[property="og:image:secure_url"]',
            ["property", "og:image:secure_url"],
            imageUrl.startsWith("https:") ? imageUrl : "",
        );
        upsertMeta(
            'meta[property="og:image:type"]',
            ["property", "og:image:type"],
            imageUrl ? imageType : "",
        );
        upsertMeta(
            'meta[property="og:image:alt"]',
            ["property", "og:image:alt"],
            imageUrl ? imageAlt : "",
        );
        upsertMeta(
            'meta[property="og:image:width"]',
            ["property", "og:image:width"],
            imageUrl ? imageWidth : "",
        );
        upsertMeta(
            'meta[property="og:image:height"]',
            ["property", "og:image:height"],
            imageUrl ? imageHeight : "",
        );

        upsertMeta(
            'meta[name="twitter:card"]',
            ["name", "twitter:card"],
            imageUrl ? "summary_large_image" : "summary",
        );
        upsertMeta(
            'meta[name="twitter:title"]',
            ["name", "twitter:title"],
            fullTitle,
        );
        upsertMeta(
            'meta[name="twitter:description"]',
            ["name", "twitter:description"],
            description,
        );
        upsertMeta(
            'meta[name="twitter:image"]',
            ["name", "twitter:image"],
            imageUrl,
        );
        upsertMeta(
            'meta[name="twitter:image:alt"]',
            ["name", "twitter:image:alt"],
            imageUrl ? imageAlt : "",
        );

        upsertLink("canonical", canonicalUrl);

        const verificationTags = [
            [
                'meta[name="google-site-verification"]',
                ["name", "google-site-verification"],
                import.meta.env.VITE_GOOGLE_SITE_VERIFICATION?.trim(),
            ],
            [
                'meta[name="msvalidate.01"]',
                ["name", "msvalidate.01"],
                import.meta.env.VITE_BING_SITE_VERIFICATION?.trim(),
            ],
        ];

        verificationTags.forEach(([selector, attribute, value]) => {
            upsertMeta(selector, attribute, value);
        });

        const jsonLdId = "route-structured-data";
        let jsonLdElement = document.getElementById(jsonLdId);

        if (structuredData) {
            if (!jsonLdElement) {
                jsonLdElement = document.createElement("script");
                jsonLdElement.id = jsonLdId;
                jsonLdElement.type = "application/ld+json";
                document.head.appendChild(jsonLdElement);
            }

            jsonLdElement.textContent = JSON.stringify(structuredData);
        } else {
            jsonLdElement?.remove();
        }
    }, [
        description,
        canonical,
        image,
        imageAlt,
        imageHeight,
        imageType,
        imageWidth,
        path,
        pathname,
        robots,
        structuredData,
        title,
        type,
    ]);

    return null;
}

export default Seo;
