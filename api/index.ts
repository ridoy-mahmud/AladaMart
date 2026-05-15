import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import productRoutes from "../server/routes/products.js";
import categoryRoutes from "../server/routes/categories.js";
import brandRoutes from "../server/routes/brands.js";
import blogRoutes from "../server/routes/blogs.js";
import seedRoutes from "../server/routes/seed.js";

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
let cachedDb: typeof mongoose | null = null;
const connectDB = async () => {
  if (cachedDb) return cachedDb;
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI is missing");
    return null;
  }
  const db = await mongoose.connect(process.env.MONGODB_URI);
  cachedDb = db;
  return db;
};

// Middleware to ensure DB connection before handling requests
app.use("/api", async (req, res, next) => {
  await connectDB();
  next();
});

// App Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/seed", seedRoutes);

export default app;
