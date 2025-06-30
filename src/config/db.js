import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conexión a MongoDB exitosa");
  } catch (error) {
    console.error("Fallo la conexión a MongoDB:", error.message);
    process.exit(1);
  }
};
