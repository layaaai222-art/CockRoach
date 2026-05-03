// Vercel serverless function — Stripe webhook receiver.
// Handles customer.subscription.{created,updated,deleted} events and
// upserts the corresponding row in public.subscriptions.
//
// IMPORTANT: this file is a STUB until Stripe keys are provisioned.
// Set STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET in Vercel env to
// activate. Until then the handler returns 503.

import { createClient } from '@supabase/supabase-js';

// Stripe SDK is dynamically imported to keep the cold-start cheap when
// the webhook is dormant.
async function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const { default: Stripe } = await import('stripe');
  return new Stripe(key, { apiVersion: '2024-12-18.acacia' });
}

export const config = {
  // Stripe sends raw body; we need to disable Vercel's auto-parsing.
  api: { bodyParser: false },
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const stripe = await getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return res.status(503).json({ error: 'Stripe not configured on server' });
  }

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    const raw = await readRawBody(req);
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err) {
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  const sbUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!sbUrl || !sbKey) {
    return res.status(500).json({ error: 'Supabase service role not configured' });
  }
  const sb = createClient(sbUrl, sbKey);

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const userId = sub.metadata?.user_id ?? null;
      if (!userId) {
        // Best-effort: look up by customer
        const customerId = sub.customer;
        const { data: existing } = await sb.from('subscriptions').select('user_id').eq('stripe_customer_id', customerId).single();
        if (!existing?.user_id) break; // can't attribute
      }
      const tier = (sub.items?.data?.[0]?.price?.id === process.env.STRIPE_PRICE_PRO_MONTHLY) ? 'pro' : 'free';
      await sb.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: sub.customer,
        stripe_subscription_id: sub.id,
        tier: event.type === 'customer.subscription.deleted' ? 'free' : tier,
        status: sub.status,
        current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      });
      break;
    }
    default:
      // Other event types ignored for V1.
      break;
  }

  return res.status(200).json({ received: true });
}
