# Karmik website

A static website: plain HTML, CSS and JavaScript. No build step, no server code.

```
index.html          the page
assets/styles.css   all styling (colors and fonts are at the top)
assets/main.js      settings, page content data and interactions
assets/favicon.svg  browser tab icon
```

## Before you go live

1. **Contact email.** Open `assets/main.js` and change `contactEmail` in `SITE` at the top to your real address (for example the Google Workspace address on your domain).
2. **Enquiry form.** The form needs somewhere to send messages:
   - Create a free form at [formspree.io](https://formspree.io) (or Basin, Getform, or a Google Apps Script endpoint).
   - Paste its endpoint into `formEndpoint` in `assets/main.js`, e.g. `'https://formspree.io/f/abcdwxyz'`.
   - Until you do this, the form shows your email address instead of sending.
3. **Optional links.** Add `bookingUrl` (calendar booking page) and `founderLinkedIn` in `SITE`. Each stays hidden until filled in.
4. **Name check.** "Karmik" sounds the same as Karmick Solutions Pvt Ltd, an existing Indian IT company. Search the trademark registries (India, WIPO, USPTO) before printing anything with the name. The name appears in `index.html` (title, nav, footer) and in the `karmik-theme` storage key in the scripts.

## Put it online (any one of these)

- **Cloudflare Pages or Netlify:** create a project, drag and drop this folder, then add your domain in the project's domain settings and follow their DNS instructions.
- **Vercel:** import the folder (or a GitHub repo containing it) as a static site.
- **GitHub Pages:** enable Pages in the repository settings (free for public repos; private repos need a paid plan).

Cloudflare Pages, Netlify and Vercel can deploy straight from this private GitHub repo on their free plans, with HTTPS.

## Editing

- Page text: `index.html`. Each section is marked with a comment like `<!-- TEAM -->`.
- Colors and fonts: the tokens at the top of `assets/styles.css`. The dark theme is the single `[data-theme="dark"]` line below them.
- Workers, hero chat, autonomy levels and timesheet numbers: the `TEAM`, `CHAT`, `LEVELS` and `SHEET` lists at the top of `assets/main.js`. The page renders from these. Timesheet figures are labelled on the page as example data.
- Worker names should mean something tied to the job (Vani = voice, Nidhi = treasure, and so on), and each badge shows that meaning.
