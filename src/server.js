import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";
import { initializedPassport } from "./config/passport/index.js";
import sessionRoutes from "./routes/session.routes.js";
import { configureHandlebars } from "./config/handlebars.js";
import viewRouter from "./routes/view.routes.js";
import methodOverride from "method-override";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(cookieParser());

initializedPassport();
app.use(passport.initialize());

connectDB();

configureHandlebars(app);

app.use("/", viewRouter);

app.use("/api/sessions", sessionRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
