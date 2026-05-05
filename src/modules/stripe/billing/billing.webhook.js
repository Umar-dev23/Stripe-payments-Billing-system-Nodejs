// modules/billing/billing.webhook.js
import { User } from './../../user/user.model.js';
import Subscription from './../../subscription/subscription.model.js';
import Plans from './../../plans/plans.model.js'; // Import your new Plan model
import stripe from './../stripe.config.js';

const getSafeDate = (unixTimestamp, addMonths = 0) => {
  if (unixTimestamp) return new Date(unixTimestamp * 1000);
  const fallback = new Date();
  fallback.setMonth(fallback.getMonth() + addMonths);
  return fallback;
};

// --- UPDATED CORE UPSERT LOGIC ---
const upsertSubscriptionToDB = async (stripeSubscription, user) => {
  const customerId = stripeSubscription.customer;
  const subscriptionId = stripeSubscription.id;

  const item = stripeSubscription.items?.data?.[0];
  const price = item?.price || stripeSubscription.plan;

  if (!price) {
    console.error('CRASH PREVENTED: Could not find price data.');
    return null;
  }

  // 1. FIND THE MONGODB PLAN ID
  // We search for a plan where either the monthly or yearly price ID matches Stripe's price.id
  const planDoc = await Plans.findOne({
    $or: [{ monthlyPriceId: price.id }, { yearlyPriceId: price.id }],
  });

  if (!planDoc) {
    console.error(`CRASH PREVENTED: No Plan found in DB for Stripe Price ID: ${price.id}`);
    return null;
  }

  const subscriptionData = {
    userId: user._id,
    planId: planDoc._id, // Save only the MongoDB Plan Reference ID
    stripeSubscriptionId: subscriptionId,
    stripeCustomerId: customerId,

    // Track the interval (month/year) specifically for this subscription
    interval: price.recurring?.interval || 'month',

    status: stripeSubscription.status,
    currentPeriodStart: getSafeDate(stripeSubscription.current_period_start, 0),
    currentPeriodEnd: getSafeDate(stripeSubscription.current_period_end, 1),
    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end || false,
    latestInvoiceId: stripeSubscription.latest_invoice,
  };

  const subscriptionDoc = await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: subscriptionId },
    { $set: subscriptionData },
    { upsert: true, returnDocument: 'after' },
  );

  return subscriptionDoc;
};

// --- WEBHOOK HANDLER 1: SUBSCRIPTION UPDATES ---
export const syncSubscriptionData = async (stripeSubscription) => {
  console.log(stripeSubscription);
  try {
    const customerId = stripeSubscription.customer;
    const user = await User.findOne({ stripeCustomerId: customerId });

    if (!user) {
      console.log(`User with Stripe ID ${customerId} not found yet.`);
      return;
    }

    const subscriptionDoc = await upsertSubscriptionToDB(stripeSubscription, user);

    if (subscriptionDoc) {
      const userStatus = stripeSubscription.status === 'active' ? 'active' : 'inactive';
      await User.findByIdAndUpdate(user._id, {
        subscriptionId: subscriptionDoc._id,
        planStatus: userStatus,
      });
    }
  } catch (error) {
    console.error(`CRASH IN SYNC FUNCTION:`, error);
  }
};

// --- WEBHOOK HANDLER 2: CHECKOUT COMPLETED ---
export const handleCheckoutCompleted = async (session) => {
  try {
    const userId = session.client_reference_id;
    const stripeCustomerId = session.customer;
    const subscriptionId = session.subscription;

    if (!userId) return;

    const user = await User.findByIdAndUpdate(userId, { stripeCustomerId: stripeCustomerId }, { new: true });

    if (subscriptionId) {
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      const subscriptionDoc = await upsertSubscriptionToDB(stripeSubscription, user);

      if (subscriptionDoc) {
        await User.findByIdAndUpdate(user._id, {
          subscriptionId: subscriptionDoc._id,
          planStatus: 'active',
        });
      }
    }
  } catch (error) {
    console.error(`CRASH IN CHECKOUT HANDLER:`, error);
  }
};
