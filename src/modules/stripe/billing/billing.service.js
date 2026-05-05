import stripe from './../stripe.config.js';
import Plans from './../../plans/plans.model.js';
import Subscription from './../../subscription/subscription.model.js';

export const createSession = async (interval, planId, user) => {
  // ✅ FIX: Check if user already has active subscription

  const existing = await Subscription.findOne({
    userId: user._id,

    status: 'active',
  });

  if (existing) {
    throw new Error('User already has an active subscription');

    // Or return { alreadySubscribed: true } — your choice
  }

  const plan = await Plans.findById(planId);

  const sessionConfig = {
    payment_method_types: ['card'],

    line_items: [
      {
        price: interval === 'month' ? plan.monthlyPriceId : plan.yearlyPriceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}/checkout/success`,
    cancel_url: `${process.env.FRONTEND_URL}/checkout/failure?session_id={CHECKOUT_SESSION_ID}`,
    client_reference_id: user._id.toString(),
  };

  if (user.stripeCustomerId) {
    console.log('1');
    sessionConfig.customer = user.stripeCustomerId;
  } else {
    console.log('2');
    sessionConfig.customer_email = user.email;
  }
  console.log('Creating Stripe session with config:', sessionConfig);
  return await stripe.checkout.sessions.create(sessionConfig);
};

export const createCustomerPortalSession = async (user) => {
  if (!user.stripeCustomerId) {
    throw new Error('User does not have a Stripe customer ID');
  }
  return await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.FRONTEND_URL}/billing/portal`,
  });
};
