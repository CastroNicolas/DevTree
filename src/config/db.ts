import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URL);
    const url2 = `${connection.host}:${connection.port}`;
    console.log(`MongoDB connected: ${url2}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
