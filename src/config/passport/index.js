import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import User from "../../models/user.model.js"; 

const { JWT_SECRET } = process.env;
console.log("JWT_SECRET:", JWT_SECRET);

export const initializedPassport = () => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload._id).lean();
          if (!user) return done(null, false);
          return done(null, user, payload); 
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};

function cookieExtractor(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
}
