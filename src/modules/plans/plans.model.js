import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true }, // e.g., 'basic'
    name: { type: String, required: true },
    description: { type: String },
    monthlyPrice: { type: Number, required: true },
    yearlyPrice: { type: Number, required: true },
    monthlyPriceId: { type: String, required: true }, // Stripe Price ID
    yearlyPriceId: { type: String, required: true }, // Stripe Price ID
    features: [{ type: String }],
    isHighlighted: { type: Boolean, default: false },
    iconName: { type: String }, // Stores 'Zap', 'Sparkles', etc.
  },
  { timestamps: true },
);

export default mongoose.model('Plan', planSchema);
