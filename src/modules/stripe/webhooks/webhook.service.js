import stripe from '../stripe.config.js';
import asyncCatch from './../../../utils/asyncCatch.js';
import WebhookLog from './webhook.model.js';

export const getallWebhooks = async (lineItems) => {
  return await WebhookLog.find().sort({ createdAt: -1 });
};
