/* Site settings: fill these in before going live. Empty links stay hidden. */
const SITE = {
  contactEmail: 'ai@sahkarmi.ai',
  formEndpoint: '',    // e.g. 'https://formspree.io/f/abcdwxyz'. Empty = the form points people to the email instead.
  bookingUrl: '',      // calendar booking page
  founderLinkedIn: ''
};

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const time = d => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const tell = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail })); // flow.js listens
const remeasure = () => window.ScrollTrigger?.refresh(true); // the page height changed: re-measure scroll effects once scrolling settles

// Theme toggle (the saved choice is applied in <head> before paint)
const theme = $('#theme'), isDark = () => document.documentElement.dataset.theme === 'dark';
theme.setAttribute('aria-pressed', isDark());
theme.onclick = () => {
  const t = isDark() ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  theme.setAttribute('aria-pressed', t === 'dark');
  try { localStorage.setItem('sahkarmi-theme', t); } catch (e) {}
  tell('theme');
};

// The note is written at 06:10 each day; before that, yesterday's note is the latest
const day = new Date();
if (day.getHours() * 60 + day.getMinutes() < 6 * 60 + 10) day.setDate(day.getDate() - 1);
$('#today').textContent = day.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

// Pointing at a finding lights up its stream in the flow
$$('.finds li').forEach(li => ['pointerenter', 'focusin'].forEach(ev => li.addEventListener(ev, () => tell('spot', li.dataset.focus))));
$('.finds').addEventListener('pointerleave', () => tell('spot', null));

// Approve or not: the note answers, the figure turns mint, and the leak in the flow is redirected
const ask = $('#ask');
const answer = yes => {
  ask.classList.toggle('done', yes !== null);
  $('#spike').classList.toggle('approved', yes === true);
  $('#said-yes').hidden = yes !== true;
  $('#said-no').hidden = yes !== false;
  $('.redo').hidden = yes === null;
  if (yes) $('#said-yes .now').textContent = time(new Date());
  if (yes !== null) $('#redo').focus(); // the pressed button is gone; keep keyboard users in place
  tell('approved', yes === true);
  remeasure();
};
$('#yes').onclick = () => answer(true);
$('#no').onclick = () => answer(false);
$('#redo').onclick = () => { answer(null); $('#yes').focus(); };

// How much it does alone: a three-stop switch
const stops = $$('.track button'), levels = $$('.level');
stops.forEach((b, i) => b.onclick = () => {
  $('.track').style.setProperty('--i', i);
  stops.forEach((s, k) => s.setAttribute('aria-pressed', k === i));
  levels.forEach((l, k) => l.hidden = k !== i);
  remeasure();
});

// Worker tiles: a soft light follows the pointer
$('.tiles').addEventListener('pointermove', e => $$('.tiles li').forEach(li => {
  const r = li.getBoundingClientRect();
  li.style.setProperty('--mx', `${e.clientX - r.left}px`);
  li.style.setProperty('--my', `${e.clientY - r.top}px`);
}));

// Each list row lights its layer in the stack
const planes = [...$('.stack').children];
$$('.layers div').forEach((row, i) => ['pointerenter', 'pointerleave'].forEach(ev => row.addEventListener(ev, () => {
  const on = ev === 'pointerenter';
  row.classList.toggle('on', on);
  planes[i].classList.toggle('on', on);
})));

// Contact details and optional links
$('#email').textContent = SITE.contactEmail;
$('#email').href = `mailto:${SITE.contactEmail}`;
[['#booking', SITE.bookingUrl], ['#linkedin', SITE.founderLinkedIn]].forEach(([s, url]) => { if (url) { $(s).href = url; $(s).hidden = false; } });
$('#year').textContent = new Date().getFullYear();

// In-page links glide (in JS, not CSS scroll-behavior, which breaks ScrollTrigger's measuring and reload position)
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]:not([href="#"])'), to = a && $(a.hash);
  if (!to) return;
  e.preventDefault();
  to.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  history.pushState(null, '', a.hash);
});

// Motion (GSAP). Everything is readable without it; reduced-motion users get the final state.
const reveal = () => document.documentElement.classList.remove('intro');
setTimeout(reveal, 2500); // never leave the hero hidden if fonts or scripts are slow
if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  document.fonts.addEventListener('loadingdone', remeasure); // fonts arrive late and reflow the page
  document.addEventListener('toggle', () => setTimeout(remeasure, 400), true); // a finding or question opened or closed (it animates for .35s)
  const fine = matchMedia('(pointer: fine)').matches;
  const wide = () => innerWidth > 960; // the stack sits beside the text (and sticks) above this width
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    // One orchestrated entrance: the note's headline rises line by line
    Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 600))]).then(() => { // don't hold the headline for slow fonts
      const split = new SplitText('.hero h1', { type: 'lines', mask: 'lines' });
      reveal();
      gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => split.revert() }) // plain text again, so it re-wraps on resize
        .from(split.lines, { yPercent: 110, duration: 1.2, stagger: .09 })
        .from('.hero .context, .hero .date, .hero .sign, .hero .ctas', { opacity: 0, y: 12, duration: .8, stagger: .08 }, .25);
    });
    gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });
    gsap.fromTo('.timeline', { '--p': 0 }, { '--p': 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 80%', end: 'bottom 50%', scrub: .6 } });
    // The stack opens only once it's fully on screen, and is fully open before it leaves. Wide: it tops the section and is
    // done 200px before it unsticks (at 640px = 6rem top + 34rem tall), so it holds open. Narrow: it ends the section, done mid-screen.
    // Measured from #built rather than the stack, whose position changes while it sticks.
    const built = $('#built'), stackEnd = () => parseFloat(getComputedStyle(built).paddingTop) + $('.stack').offsetHeight;
    gsap.fromTo('.stack', { '--spread': 0 }, { '--spread': 1, ease: 'none', scrollTrigger: { trigger: built,
      start: () => wide() ? `top+=${stackEnd()} bottom` : 'bottom bottom', end: () => wide() ? 'bottom 840px' : 'bottom 55%', scrub: .4 } });
    if (!fine) return;
    // Tiles tilt toward the pointer; the two main buttons lean in (kept to two, per the motion guide)
    $$('.tiles li').forEach(li => {
      const rx = gsap.quickTo(li, 'rotationX', { duration: .5, ease: 'power3' }), ry = gsap.quickTo(li, 'rotationY', { duration: .5, ease: 'power3' });
      li.addEventListener('pointermove', e => { const r = li.getBoundingClientRect(); rx(-((e.clientY - r.top) / r.height - .5) * 8); ry(((e.clientX - r.left) / r.width - .5) * 8); });
      li.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
    $$('.magnet').forEach(el => {
      const x = gsap.quickTo(el, 'x', { duration: .4, ease: 'power3' }), y = gsap.quickTo(el, 'y', { duration: .4, ease: 'power3' });
      el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .3); y((e.clientY - r.top - r.height / 2) * .3); });
      el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1, .4)' }));
    });
  });
} else reveal();

$('#form').onsubmit = async e => {
  e.preventDefault();
  const status = $('#status');
  if (!SITE.formEndpoint) return status.textContent = `The form isn't connected yet. Please email ${SITE.contactEmail}.`;
  const send = e.target.querySelector('[type=submit]');
  send.disabled = true;
  status.textContent = 'Sending…';
  try {
    const res = await fetch(SITE.formEndpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(e.target) });
    if (!res.ok) throw 0;
    e.target.reset();
    status.textContent = "Thank you. We'll reply within one working day.";
  } catch {
    status.textContent = `Your message couldn't be sent. Please try again, or email ${SITE.contactEmail}.`;
  }
  send.disabled = false;
};
