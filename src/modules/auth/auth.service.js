import jwt from "jsonwebtoken";
import { User } from "../user/user.model.js";
import ApiError from "./../../errors/ApiError.js";

export const verifyCredentials = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    // Standardizing the error with a 401 status code
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.isPasswordMatch(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  return user;
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
