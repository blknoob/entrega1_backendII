import { Router } from "express";
import passport from "passport";

const viewRouter = Router();

// Inicio
viewRouter.get("/", (req, res) => {
  res.render("index");
});

// Login
viewRouter.get("/login", (req, res) => {
  res.render("login");
});

// Registro
viewRouter.get("/register", (req, res) => {
  res.render("register");
});

// Current
viewRouter.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const currentUser = req.user.toObject ? req.user.toObject() : req.user;
    res.render("current", { user: currentUser });
  }
);

// Logout
viewRouter.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.render("index");
});

export default viewRouter;
