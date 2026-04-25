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
    avatar: { type: String },
    refreshToken: { type: String, select: false },

    // --- NEW GEOSPATIAL FIELD ---
    location: {
      type: {
        type: String,
        enum: ['Point'], // We force this to only accept 'Point'
        default: 'Point',
      },
      coordinates: {
        type: [Number], // Expects an array of numbers: [longitude, latitude]
        default: [0, 0],
      },
    },
  },
  { timestamps: true },
);

// --- SCHEMA LOGIC ---

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

// --- THE GEOSPATIAL INDEX ---
// This single line is the magic. It tells MongoDB to index the location
// field for round-earth calculations, allowing lightning-fast queries.
userSchema.index({ location: '2dsphere' });

export const User = mongoose.model('User', userSchema);
