import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../user/user.model.js';
import 'dotenv/config';
import * as authService from './auth.service.js';

const accessCookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['accessToken'];
  }
  return token;
};

const refreshCookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['refreshToken'];
  }
  return token;
};

const accessOptions = {
  jwtFromRequest: accessCookieExtractor,
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

passport.use(
  'jwt',
  new JwtStrategy(accessOptions, async (jwt_payload, done) => {
    try {
      console.log('asccess options', accessOptions);
      console.log('jwt_payload', jwt_payload);
      const user = await User.findById(jwt_payload.sub).select('-password').lean();
      console.log('User after Passport found', user);

      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }),
);

const refreshOptions = {
  jwtFromRequest: refreshCookieExtractor,
  secretOrKey: process.env.REFRESH_TOKEN_SECRET,
};

passport.use(
  'jwt-refresh',
  new JwtStrategy(refreshOptions, async (req, jwt_payload, done) => {
    try {
      // Get the token from the cookie to match it
      const tokenFromCookie = req.cookies?.refreshToken;

      const user = await User.findById(jwt_payload.sub).select('+refreshToken');

      if (!user || user.refreshToken !== tokenFromCookie) {
        return done(null, false, {
          message: 'Invalid or expired refresh token',
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://4ll9cl-3000.csb.app/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
        });
        const accountId = await authService.createStripeAccount();

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            stripeAccountId: accountId.id,
          });
        }
        return done(null, user);
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    },
  ),
);

export default passport;
