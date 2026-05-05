// your-webhook-route-file.js
import stripe from './../stripe.config.js';
import * as BillingWebhook from './../billing/billing.webhook.js';

export const webHoookListener = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const data = event.data.object;

  switch (event.type) {
    case 'checkout.session.completed':
      console.log('Checkout session completed');
      if (data.mode === 'subscription') {
        await BillingWebhook.handleCheckoutCompleted(data);
      }
      break;

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      console.log(`🔄 Handling ${event.type} for ${data.id}`);
      await BillingWebhook.syncSubscriptionData(data);
      break;

    default:
      console.log(`ℹ️ Unhandled event type ${event.type}.`);
  }

  res.json({ received: true });
};
