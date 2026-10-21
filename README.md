# Sahkarmi website

A static website: plain HTML, CSS and JavaScript. No build step, no server code.

```
index.html          the page
assets/styles.css   all styling (colors and fonts are at the top)
assets/main.js      settings, page content data and interactions
assets/favicon.svg  browser tab icon
```

## Before you go live

1. **Contact email.** `contactEmail` in `SITE` at the top of `assets/main.js` is set to `hello@sahkarmi.ai`. Create that mailbox (e.g. Google Workspace on the domain) or change it.
2. **Enquiry form.** The form needs somewhere to send messages:
   - Create a free form at [formspree.io](https://formspree.io) (or Basin, Getform, or a Google Apps Script endpoint).
   - Paste its endpoint into `formEndpoint` in `assets/main.js`, e.g. `'https://formspree.io/f/abcdwxyz'`.
   - Until you do this, the form shows your email address instead of sending.
3. **Optional links.** Add `bookingUrl` (calendar booking page) and `founderLinkedIn` in `SITE`. Each stays hidden until filled in.
4. **Domain and name.** The site is built for `sahkarmi.ai`. Before printing anything with the name, search the trademark registries (India, WIPO, USPTO) for "Sahkarmi". The name appears in `index.html` (title, nav, footer) and in the `sahkarmi-theme` storage key.

## Put it online (any one of these)

- **Cloudflare Pages or Netlify:** create a project, drag and drop this folder, then add your domain in the project's domain settings and follow their DNS instructions.
- **Vercel:** import the folder (or a GitHub repo containing it) as a static site.
- **GitHub Pages:** enable Pages in the repository settings (free for public repos; private repos need a paid plan).

Cloudflare Pages, Netlify and Vercel can deploy straight from this private GitHub repo on their free plans, with HTTPS.

## Editing

- Page text: `index.html`. Each section is marked with a comment like `<!-- TEAM -->`.
- Colors and fonts: the tokens at the top of `assets/styles.css`. The dark theme is the single `[data-theme="dark"]` line below them.
- Workers, Hisaab's steps, integrations strip, technology stack, hero run log, autonomy levels and timesheet numbers: the `TEAM`, `LOOP`, `TOOLS`, `STACK`, `RUN`, `LEVELS` and `SHEET` lists at the top of `assets/main.js`. The page renders from these. Timesheet figures are labelled on the page as example data.
- Worker names should mean something tied to the job (Hisaab = the accounts, Nidhi = treasure, and so on), and each badge shows that meaning.
