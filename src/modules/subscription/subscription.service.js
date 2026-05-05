import Subscription from './subscription.model.js';

export const getSubscription = async (user) => {
  const userSubscription = await Subscription.findById(user.subscriptionId).populate('planId');
  return userSubscription;
};
