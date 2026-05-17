import * as authService from './auth.service.js';
import { User } from './../user/user.model.js';
import asyncCatch from './../../utils/asyncCatch.js';
import ApiError from './../../errors/ApiError.js';

export const login = asyncCatch(async (req, res, next) => {
  const { email, password } = req.body;
  console.log('Received login data:', req.body);
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await authService.verifyCredentials(email, password);

  const { accessToken, refreshToken } = await authService.generateAuthTokens(user);

  res.cookie('accessToken', accessToken, {
    sameSite: 'none', // Added quotes here
    secure: true, // Crucial addition! Read below
    httpOnly: true,
    maxAge: 3600000,
  });
  res.cookie('refreshToken', refreshToken, {
    sameSite: 'none', // Added quotes here
    secure: true, // Crucial addition! Read below
    httpOnly: true,
    maxAge: 604800000,
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    user: { id: user._id, email: user.email, role: user.role },
  });
});

export const register = asyncCatch(async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log('Received registration data:', req.body);
  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email and password are required');
  }

  const accountId = await authService.createStripeAccount();
  const stripeAccountId = accountId.id;
  const user = await authService.register({ name, email, password, stripeAccountId });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
  });
});

export const googleAuthRedirect = asyncCatch(async (req, res) => {
  const user = req.user;

  const { accessToken, refreshToken } = await authService.generateAuthTokens(user);

  res.cookie('accessToken', accessToken, {
    sameSite: 'none', // Added quotes here
    secure: true, // Crucial addition! Read below
    httpOnly: true,
    maxAge: 3600000,
  });
  res.cookie('refreshToken', refreshToken, {
    sameSite: 'none', // Added quotes here
    secure: true, // Crucial addition! Read below
    httpOnly: true,
    maxAge: 604800000,
  });

  res.redirect(process.env.FRONTEND_URL);
});

export const logout = asyncCatch(async (req, res) => {
  // Use optional chaining for safety
  const user = await User.findById(req.user?._id);

  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out' });
});

export const getProfile = (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};
