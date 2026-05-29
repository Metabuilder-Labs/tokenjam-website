// Contact form handler. Receives { name, email, message, hp } and sends an
// email via Resend's /emails API to CONTACT_TO_EMAIL (default hello@metabldr.com).
//
// Env vars (set in Vercel project settings):
//   RESEND_API_KEY        — required
//   CONTACT_TO_EMAIL      — optional, default 'hello@metabldr.com'
//   CONTACT_FROM_EMAIL    — optional, default 'TokenJam Contact <contact@tokenjam.dev>'
//                           Must be on a Resend-verified domain.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, hp } = req.body || {};

  // Honeypot — silently accept bots so they don't retry.
  if (hp) return res.status(200).json({ ok: true });

  const nameStr = String(name ?? '').trim();
  const emailStr = String(email ?? '').trim();
  const messageStr = String(message ?? '').trim();

  if (!nameStr || nameStr.length > 200) {
    return res.status(400).json({ error: 'Please enter your name.' });
  }
  if (!EMAIL_RE.test(emailStr) || emailStr.length > 320) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!messageStr || messageStr.length > 5000) {
    return res.status(400).json({ error: 'Please include a message (up to 5000 characters).' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'hello@metabldr.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'TokenJam Contact <contact@tokenjam.dev>';

  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured');
    return res.status(500).json({ error: 'Contact form is not configured yet. Please email hello@metabldr.com directly.' });
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: emailStr,
        subject: `Contact form: ${nameStr}`,
        text:
          `From: ${nameStr} <${emailStr}>\n` +
          `Sent via tokenjam.dev/contact\n\n` +
          `${messageStr}\n`,
      }),
    });

    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      console.error('Resend send failed:', r.status, data);
      return res.status(502).json({ error: 'Failed to send. Please try again or email hello@metabldr.com directly.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact send error:', err);
    return res.status(502).json({ error: 'Failed to send. Please try again.' });
  }
}
