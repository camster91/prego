import express from 'express';
import Stripe from 'stripe';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Validate required environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY not set. Stripe features will be disabled.');
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn('Warning: STRIPE_WEBHOOK_SECRET not set. Webhook verification will fail.');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const APP_URL = process.env.APP_URL || 'https://prego.ashbi.ca';

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Simple in-memory rate limiter
const rateLimitMap = new Map();
function rateLimit(windowMs = 60000, maxRequests = 10) {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    let record = rateLimitMap.get(key);
    if (!record) {
      record = [];
      rateLimitMap.set(key, record);
    }

    // Remove expired entries
    while (record.length > 0 && record[0] < windowStart) {
      record.shift();
    }

    if (record.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    record.push(now);
    next();
  };
}

// Webhook needs raw body
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe not configured' });
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Payment processed successfully');
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        console.log('Subscription status changed');
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook signature verification failed');
    res.status(400).json({ error: 'Webhook signature verification failed' });
  }
});

app.use(express.json());
app.use(express.static(join(__dirname, '../dist')));

// Apply rate limiting to payment endpoints
const paymentRateLimit = rateLimit(60000, 10);

// Create checkout session
app.post('/api/create-checkout-session', paymentRateLimit, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe not configured' });
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Prego Premium',
            description: 'Full access to all workouts, custom plans, and progress tracking'
          },
          unit_amount: 499,
          recurring: { interval: 'month' }
        },
        quantity: 1
      }],
      mode: 'subscription',
      success_url: `${APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/pricing`,
      allow_promotion_codes: true
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session creation failed:', error.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Customer portal
app.post('/api/create-portal-session', paymentRateLimit, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe not configured' });

  const { customerId } = req.body;
  if (!customerId || typeof customerId !== 'string' || !customerId.startsWith('cus_')) {
    return res.status(400).json({ error: 'Invalid customer ID' });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${APP_URL}/settings`
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error('Portal session creation failed:', error.message);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Prego server running on port ${PORT}`);
});

// TTL cleanup for rate limiter — prevents memory leaks
const RATE_LIMITER_TTL = 10 * 60 * 1000; // 10 min
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap) {
    if (record.length === 0 || record[record.length - 1] < now - RATE_LIMITER_TTL) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000); // cleanup every 5 min
