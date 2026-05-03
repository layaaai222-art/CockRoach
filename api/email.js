// Vercel serverless function — transactional email sender.
// Sends via Resend. STUB until RESEND_API_KEY is set in env.
//
// Supported templates: 'welcome', 'password_reset', 'receipt',
// 'weekly_digest'. Each template is generated inline to keep
// dependencies minimal — we don't need a templating engine yet.

const ALLOWED_ORIGINS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/cock-roach\.vercel\.app$/,
];

function pickAllowedOrigin(origin) {
  if (!origin) return null;
  return ALLOWED_ORIGINS.some(r => r.test(origin)) ? origin : null;
}

const TEMPLATES = {
  welcome: ({ name }) => ({
    subject: `Welcome to CockRoach, ${name || 'founder'}`,
    html: `<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#111">
      <h1 style="font-size:22px;margin:0 0 16px">You're in.</h1>
      <p style="line-height:1.6;color:#444">CockRoach is your entrepreneurial co-pilot from Layaa AI. Start with a chat, run an idea through validation, or jump into a framework.</p>
      <p style="line-height:1.6;color:#444">First time? Try: <i>"What should I price my SaaS at?"</i> on AUTO mode and watch it route to PRICING with the Hormozi Value Equation.</p>
      <p style="margin-top:24px"><a href="https://cock-roach.vercel.app" style="background:#8B1414;color:#fff;padding:10px 18px;text-decoration:none;border-radius:6px;font-weight:bold">Open CockRoach</a></p>
    </div>`,
  }),
  password_reset: ({ resetUrl }) => ({
    subject: 'Reset your CockRoach password',
    html: `<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px">
      <h1 style="font-size:20px">Reset your password</h1>
      <p>Click the link below to set a new password. Expires in 1 hour.</p>
      <p><a href="${resetUrl}" style="color:#8B1414">Reset password</a></p>
      <p style="color:#999;font-size:12px;margin-top:24px">If you didn't request this, ignore this email.</p>
    </div>`,
  }),
  receipt: ({ amount, period, invoiceUrl }) => ({
    subject: `CockRoach Pro — receipt for ${period}`,
    html: `<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px">
      <h1 style="font-size:20px">Thanks for using CockRoach Pro</h1>
      <p>${amount} for ${period}.</p>
      <p><a href="${invoiceUrl}">View invoice</a></p>
    </div>`,
  }),
  weekly_digest: ({ name, summary }) => ({
    subject: `Your CockRoach week — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px">
      <h1 style="font-size:20px">${name ? `Hi ${name}, ` : ''}here's your week</h1>
      <div style="line-height:1.7;color:#333">${summary}</div>
    </div>`,
  }),
};

export default async function handler(req, res) {
  const origin = pickAllowedOrigin(req.headers.origin);
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.headers.origin && !origin) return res.status(403).json({ error: 'Origin not permitted' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { RESEND_API_KEY, RESEND_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    return res.status(503).json({ error: 'Email not configured on server' });
  }

  const { to, template, data } = req.body || {};
  if (!to || typeof to !== 'string' || !to.includes('@')) {
    return res.status(400).json({ error: 'Valid `to` email required' });
  }
  if (!template || !TEMPLATES[template]) {
    return res.status(400).json({ error: `Unknown template. Allowed: ${Object.keys(TEMPLATES).join(', ')}` });
  }

  const { subject, html } = TEMPLATES[template](data || {});

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: RESEND_FROM_EMAIL, to, subject, html }),
    });
    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      return res.status(resp.status).json({ error: `Resend failed: ${errText.slice(0, 200)}` });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: `Email send failed: ${e.message}` });
  }
}
