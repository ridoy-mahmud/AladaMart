import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Connect to MongoDB
  try {
    let mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn("MONGODB_URI not found in environment variables. Starting persistent local MongoDB...");
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const fs = await import('fs');
      const dbPath = path.join(process.cwd(), 'mongodb-data');
      if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath);
      const mongod = await MongoMemoryServer.create({
        instance: { dbPath, storageEngine: 'wiredTiger' }
      });
      mongoUri = mongod.getUri();
    }
    
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }

  // API Routes
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  // Dynamically import API routes
  const productRoutes = await import("./server/routes/products.js");
  const categoryRoutes = await import("./server/routes/categories.js");
  const brandRoutes = await import("./server/routes/brands.js");
  const blogRoutes = await import("./server/routes/blogs.js");
  const orderRoutes = await import("./server/routes/orders.js");
  const wishlistRoutes = await import("./server/routes/wishlist.js");
  const seedRoutes = await import("./server/routes/seed.js");
  
  app.use("/api/products", productRoutes.default);
  app.use("/api/categories", categoryRoutes.default);
  app.use("/api/brands", brandRoutes.default);
  app.use("/api/blogs", blogRoutes.default);
  app.use("/api/orders", orderRoutes.default);
  app.use("/api/wishlist", wishlistRoutes.default);
  app.use("/api/seed", seedRoutes.default);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on port ${PORT}`);
    
    // Seed after the server is up
    if (mongoose.connection.readyState === 1) {
      try {
        const { Product } = await import("./server/models/Product.js");
        const count = await Product.countDocuments();
        if (count === 0) {
          console.log("Database is empty, triggering seed...");
          await fetch(`http://localhost:${PORT}/api/seed`, { method: "POST" });
          console.log("Auto-seeded database.");
        }
      } catch (err) {
        console.error("Could not auto-seed database:", err);
      }
    }
  });
}

startServer();
