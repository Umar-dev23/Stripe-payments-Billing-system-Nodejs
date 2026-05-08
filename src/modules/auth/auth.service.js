import jwt from 'jsonwebtoken';
import { User } from '../user/user.model.js';
import ApiError from './../../errors/ApiError.js';
import stripe from './../stripe/stripe.config.js';

export const verifyCredentials = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  console.log('User found for email:', email, 'User:', password);
  if (!user) {
    // Standardizing the error with a 401 status code
    throw new ApiError(401, 'Invalid email or password');
  }
  const isMatch = await user.isPasswordMatch(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }
  return user;
};

export const createStripeAccount = async () => {
  const accountCreated = await stripe.accounts.create({
    type: 'express',
  });
  return accountCreated;
};

export const generateAuthTokens = async (user) => {
  const payload = { sub: user._id, role: user.role };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
  // STORE IN DB: This is the production-grade part
  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

export const register = async ({ name, email, password, stripeAccountId }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Email already in use');
  }
  const newUser = await User.create({ name, email, password, stripeAccountId });
  return newUser;
};
