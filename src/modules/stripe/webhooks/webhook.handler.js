import stripe from './../stripe.config.js';
import * as BillingWebhook from './../billing/billing.webhook.js';
import WebhookLog from './webhook.model.js';

export const webHoookListener = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const io = req.app.get('io');
  let event;

  // 1. Construct the event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const data = event.data.object;

  // 2. Identify the User (Stripe maps this from your Checkout Session creation)
  const userId = data.client_reference_id || data.metadata?.userId;
  const rawAmount = data.amount_total || data.amount_paid || data.amount || 0;
  console.log('Raw-----------amount', rawAmount);
  const currency = data.currency ? data.currency.toUpperCase() : 'PKR';
  const formattedAmount = `${currency} ${(rawAmount / 100).toFixed(2)}`;

  // 3. Create the Initial DB Log (Status: Pending)
  // We use a let so we can update this specific record later
  let logRecord;
  try {
    logRecord = await WebhookLog.create({
      stripeEventId: event.id,
      type: event.type,
      userId: userId,
      payload: event,
      status: 'pending',
    });

    // Notify Frontend: "I see the webhook, starting work now."
    io.emit('STRIPE_ACTIVITY', {
      id: event.id,
      dbId: logRecord._id,
      type: event.type,
      status: 'Processing',
      amount: rawAmount,
      time: new Date().toLocaleTimeString(),
    });
  } catch (dbErr) {
    // If stripeEventId already exists, MongoDB throws an error (Idempotency check)
    if (dbErr.code === 11000) {
      console.log(`⚠️ Duplicate webhook ignored: ${event.id}`);
      return res.status(200).json({ received: true, message: 'Duplicate' });
    }
    return res.status(500).send('Internal Log Error');
  }

  // 4. Process the Business Logic
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        if (data.mode === 'subscription') {
          await BillingWebhook.handleCheckoutCompleted(data);
        }
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await BillingWebhook.syncSubscriptionData(data);
        break;

      default:
        console.log(`ℹ️ Unhandled event type ${event.type}.`);
    }

    // 5. Update DB Log to Success
    logRecord.status = 'success';
    await logRecord.save();

    // Notify Frontend: "All good!"
    io.emit('STRIPE_ACTIVITY_UPDATE', {
      id: event.id,
      status: '200 OK',
      message: 'Processed successfully',
    });
  } catch (error) {
    console.error(`❌ Logic Error for ${event.id}:`, error.message);

    // 6. Update DB Log to Failed
    logRecord.status = 'failed';
    logRecord.errorMessage = error.message;
    await logRecord.save();

    // Notify Frontend: "Logic failed, check the logs."
    io.emit('STRIPE_ACTIVITY_UPDATE', {
      id: event.id,
      status: 'Error',
      message: error.message,
    });
  }

  // Always return 200 to Stripe so they stop retrying
  res.json({ received: true });
};
