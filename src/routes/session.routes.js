import { Router } from "express";
import User from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import passport from "passport";

const router = Router();

// Ruta para registrar usuario
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, cart, role } =
      req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .render("failure", { message: "El correo ya está registrado." });
    }

    const hashedPassword = createHash(password);

    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      cart,
      role,
    });

    await newUser.save();

    const token = generateToken({
      _id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      age: newUser.age,
      role: newUser.role,
    });

    res.cookie("access_token", token, {
      httpOnly: true,
    });

    let user = newUser.toObject ? newUser.toObject() : newUser;
    user._id = user._id.toString();
    res.render("current", { user });
    console.log(user);
  } catch (error) {
    res.status(500).render("failure", {
      message: "Error al registrar el usuario.",
    });
  }
});

// Ruta para login de usuario
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).render("failure", {
        message: "Usuario o contraseña incorrectos.",
      });
    }

    if (!isValidPassword(user, password)) {
      return res.status(401).render("failure", {
        message: "Usuario o contraseña incorrectos.",
      });
    }

    const token = generateToken({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    });

    res.cookie("access_token", token, {
      httpOnly: true,
    });
    let loginUser = user.toObject ? user.toObject() : user;
    loginUser._id = loginUser._id.toString();
    res.render("current", { user: loginUser });
  } catch (error) {
    res.status(500).render("failure", {
      message: "Error al iniciar sesión.",
    });
  }
});

// Ruta datos del usuario
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      message: "Usuario autenticado correctamente.",
      user: req.user,
    });
  }
);

// Ruta para actualizar un usuario
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.password) {
        updateData.password = createHash(updateData.password);
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedUser) {
        return res
          .status(404)
          .render("failure", { message: "Usuario no encontrado." });
      }

      let updateUser = updatedUser.toObject
        ? updatedUser.toObject()
        : updatedUser;
      updateUser._id = updateUser._id.toString();
      res.render("current", { user: updateUser });
    } catch (error) {
      res.status(500).render("failure", {
        message: "Error al actualizar el usuario.",
      });
    }
  }
);

// Ruta para eliminar un usuario
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res
          .status(404)
          .render("failure", { message: "Usuario no encontrado." });
      }
      res.clearCookie("access_token");
      res.render("index");
    } catch (error) {
      res.status(500).render("failure", {
        message: "Error al eliminar el usuario.",
      });
    }
  }
);

// Ruta para cerrar sesión
router.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.render("logout");
});

export default router;
