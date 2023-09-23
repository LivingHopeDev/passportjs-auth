const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;
const User = require("./models/user");

const getUserByEmail = async (email) => {
  return await User.findOne({ email: email });
};

const getUserByid = async (id) => {
  return await User.findOne({ _id: id });
};

const initialize = (passport) => {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: "Email not registered" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      }
      return done(null, false, { message: "Password Incorrect" });
    } catch (error) {
      return done(error);
    }
  };

  passport.use(new localStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    return done(null, await getUserByid(id));
  });
};

module.exports = initialize;
