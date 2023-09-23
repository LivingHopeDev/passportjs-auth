require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const initializePassport = require("./passport-config");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
require("./dbConfig/config");
const User = require("./models/user");
const users = [];
initializePassport(passport);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view-engine", "ejs");
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());
app.use(methodOverride("_method"));

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { username: req.user.name });
});

app.get("/login", checkNotauthenticated, (req, res) => {
  res.render("login.ejs");
});
app.post(
  "/login",
  checkNotauthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotauthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotauthenticated, async (req, res) => {
  try {
    await User.create(req.body);
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.redirect("/register");
  }
});

app.delete("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/login");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotauthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(3001, () => {
  console.log("Server runing on port 3001");
});
