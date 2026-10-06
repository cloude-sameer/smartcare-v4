# SmartCare Hospital Suite

Static website (landing page + React dashboard). No build step, no dependencies.

```
index.html      landing page         app.html     dashboard (deep links: app.html#blood)
css/ js/        styles and scripts   assets/      illustrations, icons, social image
manifest.json + sw.js               installable, works offline (needs https or localhost)
```

## Run locally
VS Code → right-click `index.html` → **Open with Live Server** (or `npx serve .`).

## Deploy (pick one)
- **Netlify:** drag this folder onto app.netlify.com/drop (config in `netlify.toml`).
- **Vercel:** `npx vercel --prod` (config in `vercel.json`).
- **GitHub Pages:** push to `main`, then Settings → Pages → Source: *GitHub Actions* (workflow included).
- **Cloudflare Pages:** connect the repo, build command empty, output directory `/`.

## After deploying
1. In `index.html` change `og:image` to the full URL, e.g. `https://your-site.com/assets/og-image.png`.
2. Bump `smartcare-v4` in `sw.js` whenever you ship changes, so returning visitors refresh their cache.

## Important
Data is saved in each visitor's own browser (localStorage). This is a demo. For real patient data you need a backend, authentication and proper privacy/compliance controls.
