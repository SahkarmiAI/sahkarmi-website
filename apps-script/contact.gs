/* Sahkarmi contact form: each enquiry becomes a row in this Google Sheet, and the account that deployed
   the script gets an email. Paste into the Sheet's Extensions → Apps Script; setup steps in README.md. */
const FIELDS = ['name', 'company', 'email', 'phone', 'track', 'message'];
const HEADERS = ['Received', 'Name', 'Company', 'Email', 'Phone', 'Looking for', 'Message'];

function doPost(e) {
  const p = e.parameter;
  if (p._gotcha) return reply(true); // a bot filled the hidden field: pretend it worked, store nothing
  const [name, company, email, phone, track, message] = FIELDS.map(f => clean(p[f]));
  if (!name || !email || !message) return reply(false);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (!sheet.getLastRow()) sheet.appendRow(HEADERS);
  sheet.appendRow([new Date(), ...[name, company, email, phone, track, message].map(asText)]);

  try { // the enquiry is already stored; a bad reply-to address shouldn't turn it into an error
    MailApp.sendEmail({ to: Session.getEffectiveUser().getEmail(), replyTo: email, subject: `New enquiry: ${name}, ${company}`,
      body: `${name} (${company})\n${email}${phone ? ' · ' + phone : ''}\n${track}\n\n${message}` });
  } catch (err) {}
  return reply(true);
}

const clean = v => String(v || '').trim().slice(0, 5000);
const asText = v => v.replace(/^[=+\-@]/, "'$&"); // stop Sheets reading "=…", "+91…" etc. as a formula; the ' isn't shown
const reply = ok => ContentService.createTextOutput(JSON.stringify({ ok })).setMimeType(ContentService.MimeType.JSON);
