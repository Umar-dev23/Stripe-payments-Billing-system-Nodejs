import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Reference to the Plan table
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    stripeCustomerId: { type: String, required: true },
    stripeSubscriptionId: { type: String, required: true, unique: true },

    // We keep 'interval' here because a plan has both monthly and yearly options
    // This tells us which version of the plan the user is on.
    interval: {
      type: String,
      enum: ['month', 'year'],
      required: true,
    },

    status: {
      type: String,
      enum: ['active', 'past_due', 'unpaid', 'canceled', 'incomplete', 'incomplete_expired', 'trialing', 'paused'],
      required: true,
    },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    latestInvoiceId: { type: String },
    metadata: { type: Map, of: String },
  },
  { timestamps: true },
);

export default mongoose.model('Subscription', subscriptionSchema);
