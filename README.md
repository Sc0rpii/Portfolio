# Mirko Freschi — Portfolio

Personal portfolio built with React, React Router, Vite and Tailwind CSS.

## Local development

```bash
npm install
npm run dev
```

## Production and SEO configuration

Copy `.env.example` to `.env.production` and set `VITE_SITE_URL` to the final
public URL. The production domain is currently configured as:

```env
VITE_SITE_URL=https://mirkofreschi.com/
```

The production build uses this value to:

- generate absolute canonical and social-preview URLs;
- generate `robots.txt`, `sitemap.xml` and an AI-readable `llms.txt`;
- create route-specific static metadata for Services and every project;
- configure React Router and asset paths for root or subdirectory hosting;
- create a custom, non-indexable `404.html`.

Optional Google Search Console and Bing verification tokens can be added to the
same environment file using the keys documented in `.env.example`.

```bash
npm run lint
npm run build
```

Deploy the contents of `dist/`. After deployment, submit `/sitemap.xml` in
Google Search Console and Bing Webmaster Tools.
