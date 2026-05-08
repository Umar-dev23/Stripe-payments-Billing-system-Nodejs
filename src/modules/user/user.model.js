import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: false,
      select: false,
    },
    googleId: { type: String, unique: true, sparse: true },
    stripeCustomerId: { type: String, unique: true, sparse: true },
    subscriptionId: { type: String, unique: true, sparse: true },
    stripeAccountId: { type: String, unique: true, sparse: true },
    planStatus: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    
  },
  { timestamps: true },
);

// 1. Pre-save hook for passwords
userSchema.pre('save', async function () {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// 2. Instance Method for passwords
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

export const User = mongoose.model('User', userSchema);
