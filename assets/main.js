/* ============================================================
   SITE SETTINGS — fill these in before you go live
   ============================================================ */
const SITE = {
  contactEmail: 'hello@your-domain.com',
  formEndpoint: '',      // e.g. 'https://formspree.io/f/abcdwxyz'. Empty = show email instead of sending.
  bookingUrl: '',        // Optional calendar booking link. Empty = button hidden.
  founderLinkedIn: ''    // Optional LinkedIn URL. Empty = link hidden.
};

/* ============================================================
   CONTENT DATA — edit text here, the page renders from it
   ============================================================ */
const TEAM = [ // [name, meaning, role, department, color, duty, measured by]
  ['Vani', 'voice', 'Lead follow-up', 'Sales', 'saffron', 'Replies to every new lead within a minute, asks your qualifying questions and books the call.', 'First-reply time, calls booked'],
  ['Disha', 'direction', 'Lead capture & routing', 'Sales', 'sky', 'Pulls leads from every source into one list, removes duplicates and sends each one to the right rep.', 'Leads captured, time to assignment'],
  ['Nidhi', 'treasure', 'Collections', 'Finance', 'mint', 'Sends polite payment reminders, shares payment links and confirms when money arrives.', 'Amount recovered, days to payment'],
  ['Tula', 'balance', 'Invoice & GST reconciliation', 'Finance', 'peach', 'Matches invoices to purchase orders and bank entries, and flags GST mismatches before you file.', 'Invoices processed, mismatches caught'],
  ['Lekha', 'record', 'Document intake', 'Operations', 'pink', 'Turns forms, KYC and claim documents into clean records, and asks customers for anything missing.', 'Documents processed, accuracy'],
  ['Smriti', 'memory', 'Reorders & distributors', 'Operations', 'lime', 'Remembers when each customer usually reorders, reminds them, and takes orders over WhatsApp in Hindi or English.', 'Reorders captured, revenue']
];

const TOOLS = ['WhatsApp', 'Email', 'Phone & SMS', 'CRMs', 'Accounting software', 'ERPs', 'Spreadsheets', 'Payment gateways', 'Marketplaces', 'Online stores', 'Calendars', 'Cloud drives', 'Internal databases', 'Legacy desktop software', 'Anything with an API'];

const STACK = [ // [layer, what it does, building blocks]
  ['Models', 'The best AI model for each step, chosen by your test results.', ['Claude', 'GPT', 'Gemini', 'Open-source models']],
  ['Connections', 'Plugs into your systems the way your team does.', ['MCP', 'REST APIs & webhooks', 'WhatsApp Business Platform', 'Email & calendar', 'Browser automation for tools without an API']],
  ['Knowledge', 'Answers from your own data, not the internet.', ['Retrieval over your documents (RAG)', 'Vector search', 'OCR & document AI']],
  ['Workflows', 'Multi-step jobs that retry, wait and hand over.', ['Agent orchestration', 'Queues & schedules', 'Human approval steps']],
  ['Testing', 'Checked before every change goes live.', ['Test suites from your past cases', 'Code checks + AI judges', 'Model upgrade regression runs']],
  ['Monitoring & security', 'Watched and logged in production.', ['Step-by-step tracing', 'Cost & latency tracking', 'Alerts', 'Encryption', 'Least-privilege access', 'Audit logs']]
];

const CHAT = [ // [who, text] — who: 'them' | 'me' | 'sys'
  ['them', 'Hi, saw your ad. Bulk rate for 50 RO purifiers?'],
  ['me', 'Namaste Priya! For 50 units our dealer price starts at ₹7,450 per unit. Which city should we deliver to?'],
  ['them', 'Pune. Kal call ho sakta hai?'],
  ['me', 'Bilkul. Rohit from our sales team is free tomorrow at 11:30 AM or 4 PM. Which works?'],
  ['them', '4 baje'],
  ['me', 'Done ✓ Call booked with Rohit for tomorrow at 4 PM. Invite sent here and on email.'],
  ['sys', 'Replied in 38 sec · logged in CRM · Rohit notified']
];

const LEVELS = [ // [name, summary, [[owner, step]...]]
  ['1 · Drafts', 'Nidhi drafts. Your team approves every message.', [['Nidhi', 'Writes each payment reminder'], ['You', 'Approve or edit before it is sent'], ['Nidhi', 'Sends it and logs the reply']]],
  ['2 · Acts, asks on exceptions', 'Nidhi handles routine cases. Exceptions come to you.', [['Nidhi', 'Sends routine reminders on schedule'], ['Nidhi', 'Confirms payments and updates Tally'], ['You', 'Handle disputes and accounts 60+ days overdue']]],
  ['3 · Autopilot', 'Nidhi runs the whole job within your rules.', [['Nidhi', 'Runs reminders, follow-ups and receipts end to end'], ['Nidhi', 'Pauses itself when a customer disputes'], ['You', 'Read the weekly report on the timesheet']]]
];

const SHEET = { // name: {kpis, log, seed, hand}
  Vani: { seed: 11, hand: .08, kpis: [['First reply', '47 sec', 'was 6.5 hours'], ['Leads contacted', '1,682', '+18% this month'], ['Calls booked', '214', '+31% this month'], ['Test pass rate', '97%', '250 past cases']],
    log: [['10:42', 'Replied to a Meta ad lead in Hindi', '', 'Done'], ['10:39', 'Booked a demo with Kapoor Enterprises', '', 'Booked'], ['10:31', 'Custom pricing request sent to sales', 'warn', 'To team'], ['10:24', 'Reminded Rohit about an untouched lead', '', 'Nudged'], ['10:18', 'WhatsApp failed, sent by email', 'bad', 'Retried']] },
  Nidhi: { seed: 23, hand: .12, kpis: [['Recovered', '₹38.6L', '+22% this month'], ['Days to payment', '31', 'was 47'], ['Reminders sent', '1,104', '+9% this month'], ['Test pass rate', '97%', '250 past cases']],
    log: [['10:44', 'Reminder to Gupta Traders, due in 3 days', '', 'Done'], ['10:37', 'Confirmed ₹48,200 received, updated Tally', '', 'Matched'], ['10:30', 'Account 62 days overdue sent to owner', 'warn', 'To team'], ['10:12', 'Customer disputed amount, reminders paused', 'warn', 'To team'], ['10:03', 'Bank entry not found yet, will re-check', 'bad', 'Retrying']] },
  Tula: { seed: 47, hand: .06, kpis: [['Time per invoice', '2.4 min', 'was 18 min'], ['Invoices processed', '2,318', '+14% this month'], ['Mismatches caught', '73', '₹4.1L checked'], ['Test pass rate', '98%', '250 past cases']],
    log: [['10:46', 'Entered INV-2304 from supplier email', '', 'Done'], ['10:40', 'Matched 14 invoices to purchase orders', '', 'Matched'], ['10:33', 'GSTIN mismatch on INV-2291 flagged', 'warn', 'To team'], ['10:25', 'Unreadable scan, asked supplier to resend', 'bad', 'Retrying'], ['10:16', 'Blocked a duplicate invoice', '', 'Done']] }
};

/* ============================================================ */
const $ = s => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const chips = (el, labels, onPick) => {   // renders a pressed-button group
  el.innerHTML = labels.map((l, i) => `<button type="button" aria-pressed="${!i}">${l}</button>`).join('');
  el.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    el.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    onPick(b.textContent);
  };
  onPick(labels[0]);
};

/* Settings */
$('#year').textContent = new Date().getFullYear();
$('#email').textContent = SITE.contactEmail;
[['#booking', SITE.bookingUrl], ['#linkedin', SITE.founderLinkedIn]].forEach(([s, url]) => { if (url) { $(s).href = url; $(s).hidden = false; } });

/* Theme toggle (initial theme is set in index.html) */
$('#themeBtn').onclick = () => {
  const t = document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('karmik-theme', t); } catch {}
};

/* Mobile menu */
$('#menuBtn').onclick = e => e.currentTarget.setAttribute('aria-expanded', $('#menu').classList.toggle('open'));
$('#menu').onclick = () => { $('#menu').classList.remove('open'); $('#menuBtn').setAttribute('aria-expanded', false); };

/* Links that preset the enquiry type */
document.querySelectorAll('[data-enquiry]').forEach(a => a.onclick = () => $('#track').value = a.dataset.enquiry);

/* Hero chat — types out message by message, then loops (shown all at once if motion is reduced) */
const addMsg = ([who, text], i) => {
  const li = document.createElement('li');
  li.className = who;
  li.textContent = text;
  if (who !== 'sys') li.insertAdjacentHTML('beforeend', `<time>10:0${i + 2} AM</time>`);
  $('#chat').append(li);
};
let ci = 0;
const playChat = () => {
  if (ci === CHAT.length) { ci = 0; $('#chat').innerHTML = ''; }
  const msg = CHAT[ci], i = ci++;
  if (msg[0] !== 'me') addMsg(msg, i);
  else {   // show "typing…" dots before the worker's reply
    $('#chat').insertAdjacentHTML('beforeend', '<li class="me typing" aria-hidden="true"><i></i><i></i><i></i></li>');
    setTimeout(() => { $('#chat .typing')?.remove(); addMsg(msg, i); }, 900);
  }
  setTimeout(playChat, ci === CHAT.length ? 5000 : 1900);
};
reduced ? CHAT.forEach(addMsg) : playChat();

/* Integrations strip — list twice so the loop is seamless */
$('#track').innerHTML = TOOLS.concat(TOOLS).map(t => `<span>${t}</span>`).join('');

/* Technology stack */
$('#stackList').innerHTML = STACK.map(([layer, what, parts]) =>
  `<li class="card"><h3>${layer}</h3><p>${what}</p><p class="parts">${parts.map(x => `<span>${x}</span>`).join('')}</p></li>`).join('');

/* Stats count up once they scroll into view */
if (!reduced) {
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    document.querySelectorAll('.stats b').forEach(b => {
      const [, n, suffix] = b.textContent.match(/(\d+)(.*)/);
      for (let k = 1; k <= 30; k++) setTimeout(() => b.textContent = Math.round(n * k / 30) + suffix, k * 30);
    });
  });
  io.observe($('.stats'));
}

/* Team badges + department filter */
$('#badges').innerHTML = TEAM.map(([n, means, role, dept, c, duty, kpi]) => `
  <article class="card badge" data-dept="${dept}">
    <header style="--c:var(--${c})"><b class="av">${n[0]}</b><div><h3>${n} <i>“${means}”</i></h3><small>${role}</small></div></header>
    <p>${duty}</p>
    <dl><dt>Measured by</dt><dd>${kpi}</dd></dl>
  </article>`).join('');
chips($('#teamFilter'), ['All', 'Sales', 'Finance', 'Operations'], f =>
  document.querySelectorAll('.badge').forEach(card => card.hidden = f !== 'All' && card.dataset.dept !== f));

/* Autonomy ladder */
chips($('#levels'), LEVELS.map(l => l[0]), name => {
  const [, sum, steps] = LEVELS.find(l => l[0] === name);
  $('#levelSum').textContent = sum;
  $('#levelList').innerHTML = steps.map(([who, s]) => `<li class="${who === 'You' ? 'you' : ''}"><b>${who}</b>${s}</li>`).join('');
});

/* Timesheet (example data) */
const drawChart = (seed, handRate) => {
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const days = [...Array(14)].map((_, i) => { const t = Math.round(90 + rnd() * 40 + i * 1.5), h = Math.round(t * handRate * (.6 + rnd() * .8)); return [t - h, h]; });
  const y = v => 200 - v * 1.2, bw = 600 / 14;
  $('#chart').innerHTML = [0, 50, 100, 150].map(v => `<line x1="34" x2="640" y1="${y(v)}" y2="${y(v)}" stroke="currentColor" opacity=".2"/><text x="28" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join('') +
    days.map(([d, h], i) => { const x = 40 + i * bw + 6; return `<rect x="${x}" y="${y(d)}" width="${bw - 12}" height="${d * 1.2}" fill="var(--ink)"/><rect x="${x}" y="${y(d + h)}" width="${bw - 12}" height="${h * 1.2}" fill="var(--saffron)" stroke="var(--ink)"/>`; }).join('');
};
chips($('#sheetTabs'), Object.keys(SHEET), name => {
  const d = SHEET[name];
  $('#kpis').innerHTML = d.kpis.map(([l, v, n]) => `<div><small>${l}</small><b>${v}</b><span>${n}</span></div>`).join('');
  $('#log').innerHTML = d.log.map(([t, txt, cls, lab]) => `<li><time>${t}</time><span>${txt}</span><span class="pill ${cls}">${lab}</span></li>`).join('');
  drawChart(d.seed, d.hand);
});

/* Copy email */
$('#copy').onclick = e => navigator.clipboard?.writeText(SITE.contactEmail).then(() => { e.target.textContent = 'Copied'; setTimeout(() => e.target.textContent = 'Copy', 1800); });

/* Enquiry form — browser validation runs first; this only fires when the form is valid */
$('#form').onsubmit = async e => {
  e.preventDefault();
  const form = e.target, status = $('#status'), btn = form.querySelector('[type=submit]');
  if (form._gotcha.value) return form.reset();   // spam bot filled the hidden field
  if (!SITE.formEndpoint) return status.textContent = `The form isn't connected yet. Please email us at ${SITE.contactEmail}.`;
  btn.disabled = true;
  try {
    const res = await fetch(SITE.formEndpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
    if (!res.ok) throw 0;
    form.reset();
    status.textContent = 'Thanks, your enquiry is in. We\'ll reply within one working day.';
  } catch {
    status.textContent = `Your enquiry couldn't be sent. Please try again, or email us at ${SITE.contactEmail}.`;
  }
  btn.disabled = false;
};
