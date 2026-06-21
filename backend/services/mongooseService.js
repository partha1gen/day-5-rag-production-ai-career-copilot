import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnect = async () => {
  try {
    const uri = process.env.mondodb_key;

    return await mongoose.connect(uri);
  } catch (e) {
    throw new Error("from mongoose", { cause: e.message });
  }
};

export default dbConnect;
