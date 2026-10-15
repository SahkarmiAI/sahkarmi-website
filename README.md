# Karmik website

A static website: plain HTML, CSS and JavaScript. No build step, no server code.

```
index.html          the page
assets/styles.css   all styling (colors and fonts are at the top)
assets/main.js      interactions, plus the two settings below
assets/favicon.svg  browser tab icon
```

## Before you go live

1. **Contact email.** Open `assets/main.js` and change `contactEmail` at the top to your real address (for example the Google Workspace address on your domain).
2. **Enquiry form.** The form needs somewhere to send messages:
   - Create a free form at [formspree.io](https://formspree.io) (or Basin, Getform, or a Google Apps Script endpoint).
   - Paste its endpoint into `formEndpoint` in `assets/main.js`, e.g. `'https://formspree.io/f/abcdwxyz'`.
   - Until you do this, the form shows your email address instead of sending.
3. **Name check.** "Karmik" sounds the same as Karmick Solutions Pvt Ltd, an existing Indian IT company. Search the trademark registries (India, WIPO, USPTO) before printing anything with the name. The name appears in `index.html` (title, nav, footer) and in the `karmik-theme` storage key in the scripts.

## Put it online (any one of these)

- **Cloudflare Pages or Netlify:** create a project, drag and drop this folder, then add your domain in the project's domain settings and follow their DNS instructions.
- **Vercel:** import the folder (or a GitHub repo containing it) as a static site.
- **GitHub Pages:** push the folder to a repository, then enable Pages in the repository settings.

All of these have free plans that are enough for this site, and include HTTPS.

## Editing

- Text: edit `index.html` directly. Each section is marked with a comment like `<!-- ROLES -->`.
- Colors and fonts: change the tokens at the top of `assets/styles.css` (light palette first, dark palette below it).
- Timesheet example numbers: the `WORKERS` object in `assets/main.js`. These are labelled on the page as example data.
- The hero's live ticker lines: the `events` list in `assets/main.js`.
- The previous version of the site is kept in `_old/` for reference; delete it before deploying.
