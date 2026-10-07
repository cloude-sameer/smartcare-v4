# SmartCare Hospital Suite

SmartCare is a React and Tailwind CSS hospital-management demo with client-side routes powered by React Router. Its original hospital dashboard workflows have been moved into the React source and are available alongside the product pages.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm ci`.
3. Run `npm run dev` and open the URL printed by Vite.

Run `npm run build` to compile Tailwind and create the production site in `dist/`. Run `npm run preview` to serve that production build locally.

## Routes

- `/` — Product home
- `/features` — All eight modules
- `/modules/queue`, `/modules/beds`, `/modules/pharm`, `/modules/lab`, `/modules/blood`, `/modules/amb`, `/modules/fb`, `/modules/dash` — Individual module details
- `/platform`, `/about`, `/support` — Product, project and demo information
- `/dashboard` — Overview
- `/dashboard/queue`, `/dashboard/beds`, `/dashboard/pharm`, `/dashboard/lab`, `/dashboard/blood`, `/dashboard/amb`, `/dashboard/fb` — Dashboard modules

Legacy dashboard links such as `app.html#blood` redirect to the equivalent dashboard route.

## Deploy

- **Netlify:** connect the repository; its configuration runs `npm run build` and publishes `dist/`.
- **Vercel:** import the repository and use the included build configuration.
- **GitHub Pages:** push to `main` and enable GitHub Actions as the Pages source. The workflow builds and deploys `dist/`.
- **Cloudflare Pages:** use `npm run build` as the build command and `dist` as the output directory.

## Included features

- Eight hospital dashboard modules with direct routes, live overview, and mobile navigation.
- Light and dark themes, with the preference shared between the landing page and dashboard.
- Offline-capable static assets and service-worker caching. Direct routes are configured for Netlify and Vercel; GitHub Pages deploys a route fallback page.

## Important

Demo data is saved in each visitor's browser using local storage. This is not a production patient-data system. Real patient data requires a secure backend, authentication, access controls, and appropriate privacy and compliance safeguards.
