import asyncCatch from './../../../utils/asyncCatch.js';
import * as checkoutService from './checkout.service.js';
const lineItems = [
  {
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'T-shirt',
      },
      unit_amount: 4900,
    },
    quantity: 1,
  },
];

export const createCheckcoutSession = asyncCatch(async (req, res) => {
  const session = await checkoutService.createSession(lineItems);
  res.status(200).json({ success: true, sessionId: session.id, url: session.url });
});

export const dynamicCheckoutSession = asyncCatch(async (req, res) => {
  const data = req.body;
  const lineItems = data.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
      },
      unit_amount: item.unitPrice * 100, // Convert to cents
    },
    quantity: item.qty,
    tax_rates: [process.env.TAX_ID], // Add tax rate ID here
  }));

  const session = await checkoutService.createSession(lineItems);
  res.status(200).json({ success: true, sessionId: session.id, url: session.url });
});
