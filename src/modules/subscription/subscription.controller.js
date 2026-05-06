import * as SubscriptionService from './subscription.service.js';
import asyncCatch from './../../utils/asyncCatch.js';

export const getMySubscription = asyncCatch(async (req, res) => {
  const user = req.user;
  const subscription = await SubscriptionService.getSubscription(user);
  res.status(200).json({ success: true, data: subscription });
});
