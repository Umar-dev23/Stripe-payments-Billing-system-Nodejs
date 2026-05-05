import stripe from '../stripe.config.js';

export const createIntent = async (lineItems) => {
  return await stripe.paymentIntents.create({
    amount: lineItems.amount * 100,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
  });
};
