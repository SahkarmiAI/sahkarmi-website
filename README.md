# Sahkarmi website

A static website: plain HTML, CSS and JavaScript. No build step, no server code.

```
index.html          the page and all its words
assets/styles.css   all styling; colours and fonts are the tokens at the top
assets/main.js      settings (SITE), interactions and scroll motion (GSAP from cdnjs)
assets/flow.js      the 3D flow of spend behind the note (three.js from jsDelivr)
assets/favicon.svg  browser tab icon
```

## Before you go live

1. **Contact email.** `contactEmail` in `SITE` at the top of `assets/main.js` is set to `ai@sahkarmi.ai`. Create that mailbox (e.g. Google Workspace on the domain) or change it.
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

- Words: edit `index.html` directly. Each section starts with a comment like `<!-- WORKERS -->`.
- Colours and fonts: the tokens at the top of `assets/styles.css`; the dark theme redefines the same names right below.
- The morning note's figures are example data; keep them consistent (daily waste = monthly savings ÷ 30).
- Worker names must mean something tied to the job (Hisaab = the accounts, Tula = balance, and so on).
