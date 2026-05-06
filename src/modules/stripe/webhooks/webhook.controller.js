import stripe from '../stripe.config.js';
import asyncCatch from './../../../utils/asyncCatch.js';
import * as WebhookService from './webhook.service.js';

export const getallWebhooks = asyncCatch(async (req, res) => {
  const lineItems = req.body;
  const webhooksData = await WebhookService.getallWebhooks();
  res.status(200).json({ success: true, data: webhooksData });
});
