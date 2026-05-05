import stripe from '../stripe.config.js';

export const createSession = async (lineItems) => {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    billing_address_collection: 'required',
    customer_email: 'umar.dev23@gmail.com',
    success_url: `${process.env.FRONTEND_URL}/checkout/success`,
    cancel_url: `${process.env.FRONTEND_URL}/checkout/failure?session_id={CHECKOUT_SESSION_ID}`,
  });
};
