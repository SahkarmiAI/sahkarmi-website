/* ============================================================
   SITE SETTINGS — fill these in before you go live
   ============================================================ */
const SITE = {
  contactEmail: 'hello@sahkarmi.ai',
  formEndpoint: '',      // e.g. 'https://formspree.io/f/abcdwxyz'. Empty = show email instead of sending.
  bookingUrl: '',        // Optional calendar booking link. Empty = button hidden.
  founderLinkedIn: ''    // Optional LinkedIn URL. Empty = link hidden.
};

/* ============================================================
   CONTENT DATA — edit text here, the page renders from it
   ============================================================ */
const TEAM = [ // [name, meaning, role, department, color, duty, measured by] — the first one is our first product
  ['Hisaab', 'the accounts', 'AI spend auditor', 'Engineering', 'saffron', 'Reads AI usage and spend every day, attributes every dollar, finds waste, investigates spikes and proves each fix on your past requests.', 'Dollars saved, spend attributed'],
  ['Tula', 'balance', 'Invoice & GST reconciliation', 'Finance', 'peach', 'Every night, matches invoices to purchase orders and bank entries, investigates each mismatch and flags GST issues before you file.', 'Invoices matched, mismatches caught'],
  ['Nidhi', 'treasure', 'Cash & collections', 'Finance', 'mint', 'Each morning, matches bank receipts to open invoices, works out what is overdue and why, and queues follow-ups for your approval.', 'Days to payment, cash recovered'],
  ['Lekha', 'record', 'Document processing', 'Operations', 'pink', 'Processes every incoming form, KYC or claim file: extracts the data, cross-checks it against your records and flags anything inconsistent.', 'Documents processed, errors caught'],
  ['Smriti', 'memory', 'Contract & renewal watch', 'Operations', 'lime', 'Reads every vendor contract, tracks renewal and notice dates, compares price with actual usage and warns you weeks before auto-renewals.', 'Renewals caught, money saved'],
  ['Prahari', 'sentinel', 'Compliance watch', 'Operations', 'sky', 'Tracks statutory deadlines (GST, TDS, PF), checks filings and source data for gaps, and escalates before a penalty is due.', 'Deadlines met, gaps found']
];

const LOOP = [ // Hisaab's daily loop: [step, detail]
  ['Read', 'OpenAI and Anthropic usage APIs, SSO logs, card and expense exports, cloud bills.'],
  ['Attribute', 'Every dollar mapped to a team, project and feature.'],
  ['Find waste', 'Unused seats, overlapping tools, cost spikes and runaway agents.'],
  ['Investigate', 'Works out why each spike happened: a prompt change, a loop, a new feature.'],
  ['Prove the fix', 'Tests a cheaper model, trimmed context or a usage cap on your own past requests, with quality shown before and after.'],
  ['You approve', 'Findings, dollars saved and every action land on the dashboard. Nothing changes without your yes.']
];

const TOOLS = ['AI usage APIs', 'SSO & identity logs', 'Cloud bills', 'Card & expense exports', 'Bank feeds', 'Accounting software', 'ERPs', 'CRMs', 'Email', 'Spreadsheets', 'Cloud drives', 'Internal databases', 'Legacy desktop software', 'Anything with an API'];

const STACK = [ // [layer, what it does, building blocks]
  ['Models', 'The best AI model for each step, chosen by your test results.', ['Claude', 'GPT', 'Gemini', 'Open-source models']],
  ['Connections', 'Plugs into your systems the way your team does.', ['MCP', 'REST APIs & webhooks', 'Usage & billing APIs', 'Email & calendar', 'Browser automation for tools without an API']],
  ['Knowledge', 'Works from your own data, not the internet.', ['Retrieval over your documents (RAG)', 'Vector search', 'OCR & document AI']],
  ['Workflows', 'Multi-step jobs that retry, wait and hand over.', ['Agent orchestration', 'Queues & schedules', 'Human approval steps']],
  ['Testing', 'Checked before every change goes live.', ['Test suites from your past cases', 'Code checks + AI judges', 'Model upgrade regression runs']],
  ['Monitoring & security', 'Watched and logged in production.', ['Step-by-step tracing', 'Cost & latency tracking', 'Alerts', 'Encryption', 'Least-privilege access', 'Audit logs']]
];

const RUN = [ // hero run log: [time, text, pill style, pill label]; 'ask' = approval buttons
  ['06:00', 'Daily run started. Pulled usage from OpenAI, Anthropic, AWS and the expense export'],
  ['06:02', 'Attributed $48,210 (month to date) to 14 teams and 31 projects', '', 'Done'],
  ['06:03', '23 ChatGPT seats unused for 60+ days: $690/month', 'warn', 'Waste'],
  ['06:04', 'Support-bot spend up 312% since Oct 14', 'warn', 'Spike'],
  ['06:06', 'Why: an Oct 14 prompt change sends the full ticket history on every call (4k → 19k tokens)', '', 'Cause'],
  ['06:09', 'Tested fix (keep last 5 messages) on 1,200 past requests: quality 99.0% vs 99.2% before', '', 'Proven'],
  ['06:10', 'Saves $6,400/month. Waiting for your approval', 'ask']
];

const LEVELS = [ // [name, summary, [[owner, step]...]]
  ['1 · Reports', 'Hisaab finds and explains. You decide everything.', [['Hisaab', 'Runs the daily audit and investigates every spike'], ['Hisaab', 'Writes up each finding with the dollars at stake'], ['You', 'Decide what to change and make the change']]],
  ['2 · Proposes tested fixes', 'Hisaab proves each fix. You approve each one.', [['Hisaab', 'Tests every fix on your own past requests'], ['You', 'Approve or reject each fix on the dashboard'], ['Hisaab', 'Applies approved fixes and tracks the savings']]],
  ['3 · Autopilot within limits', 'Hisaab applies the fix types you pre-approve.', [['Hisaab', 'Removes seats unused for 60+ days and caps runaway agents'], ['Hisaab', 'Still asks before switching models or changing prompts'], ['You', 'Review the weekly savings report']]]
];

const SHEET = { // name: {kpis, log, seed, hand}
  Hisaab: { seed: 11, hand: .1, kpis: [['Spend tracked', '$48.2K', 'month to date'], ['Attributed', '100%', '14 teams, 31 projects'], ['Waste found', '$9.1K/mo', '7 findings'], ['Saved', '$7.0K/mo', '6 of 7 fixes approved']],
    log: [['06:10', 'Context-trim fix approved: saves $6,400/mo', '', 'Approved'], ['06:09', 'Fix tested on 1,200 past requests, quality held', '', 'Proven'], ['06:06', 'Spike traced to Oct 14 prompt change', 'warn', 'Cause'], ['06:03', '23 unused ChatGPT seats flagged', 'warn', 'Waste'], ['06:02', 'Two teams pay for overlapping transcription tools', 'warn', 'Overlap']] },
  Tula: { seed: 47, hand: .06, kpis: [['Time per invoice', '2.4 min', 'was 18 min'], ['Invoices matched', '2,318', '+14% this month'], ['Mismatches caught', '73', '₹4.1L checked'], ['Test pass rate', '98%', '250 past cases']],
    log: [['02:46', 'Entered INV-2304 from supplier email', '', 'Done'], ['02:40', 'Matched 14 invoices to purchase orders', '', 'Matched'], ['02:33', 'GSTIN mismatch on INV-2291 flagged', 'warn', 'To you'], ['02:25', 'Unreadable scan, asked supplier to resend', 'bad', 'Retrying'], ['02:16', 'Blocked a duplicate invoice', '', 'Done']] },
  Nidhi: { seed: 23, hand: .12, kpis: [['Cash matched', '₹38.6L', 'this month'], ['Days to payment', '31', 'was 47'], ['Follow-ups queued', '312', 'each approved by you'], ['Test pass rate', '97%', '250 past cases']],
    log: [['07:44', 'Matched ₹48,200 receipt to INV-2291', '', 'Matched'], ['07:37', '14 invoices overdue, follow-ups queued', 'warn', 'To you'], ['07:30', 'Gupta Traders disputed amount, paused', 'warn', 'To you'], ['07:12', 'Bank entry not found yet, will re-check', 'bad', 'Retrying'], ['07:03', 'Morning run: bank feed and Tally synced', '', 'Done']] }
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
  try { localStorage.setItem('sahkarmi-theme', t); } catch {}
};

/* Mobile menu */
$('#menuBtn').onclick = e => e.currentTarget.setAttribute('aria-expanded', $('#menu').classList.toggle('open'));
$('#menu').onclick = () => { $('#menu').classList.remove('open'); $('#menuBtn').setAttribute('aria-expanded', false); };

/* Links that preset the enquiry type */
document.querySelectorAll('[data-enquiry]').forEach(a => a.onclick = () => $('#track').value = a.dataset.enquiry);

/* Hero run log — steps appear one by one with "working" dots; the last step waits for Approve / Reject */
const addRun = ([t, txt, cls = '', lab]) => $('#run').insertAdjacentHTML('beforeend', `<li><time>${t}</time><span>${txt}</span>${
  cls === 'ask' ? '<span class="ask"><button type="button" value="yes">Approve</button><button type="button">Reject</button></span>' : lab ? `<span class="pill ${cls}">${lab}</span>` : ''}</li>`);
let ri = 0, runTimer;
const playRun = () => {
  if (ri === RUN.length) { ri = 0; $('#run').innerHTML = ''; }
  $('#run .typing')?.remove();
  addRun(RUN[ri++]);
  if (ri < RUN.length) $('#run').insertAdjacentHTML('beforeend', '<li class="typing" aria-hidden="true"><i></i><i></i><i></i></li>');
  runTimer = setTimeout(playRun, ri < RUN.length ? 1500 : 9000);   // after the last step, wait for a click (or restart)
};
$('#run').onclick = e => {
  const b = e.target.closest('button'); if (!b) return;
  const yes = b.value === 'yes';
  b.parentElement.outerHTML = `<span class="pill ${yes ? '' : 'bad'}">${yes ? 'Approved' : 'Rejected'}</span>`;
  addRun(['06:11', yes ? 'Fix scheduled for tonight. Logged on the dashboard.' : 'Fix rejected. Hisaab will keep watching this spend.']);
  clearTimeout(runTimer);
  if (!reduced) runTimer = setTimeout(playRun, 4000);
};
reduced ? RUN.forEach(addRun) : playRun();

/* Hisaab's loop */
$('#loop').innerHTML = LOOP.map(([h, p], i) => `<li class="card${i === LOOP.length - 1 ? ' card-hot' : ''}"><h3>${h}</h3><p>${p}</p></li>`).join('');

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
$('#badges').innerHTML = TEAM.map(([n, means, role, dept, c, duty, kpi], i) => `
  <article class="card badge" data-dept="${dept}">
    <header style="--c:var(--${c})"><b class="av">${n[0]}</b><div><h3>${n} <i>“${means}”</i></h3><small>${role}</small></div>${i ? '' : '<span class="pill first">First product</span>'}</header>
    <p>${duty}</p>
    <dl><dt>Measured by</dt><dd>${kpi}</dd></dl>
  </article>`).join('');
chips($('#teamFilter'), ['All', 'Engineering', 'Finance', 'Operations'], f =>
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
