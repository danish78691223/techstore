import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

//import dns from "dns";

//dns.setServers(["1.1.1.1", "8.8.8.8"]); // Set DNS servers to Cloudflare and Google


const __filename = fileURLToPath(import.meta.url),
  __dirname = path.dirname(__filename);
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",").map((x) => x.trim()) || "*",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/api/health", (req, res) =>
  res.json({ ok: true, service: "Tech Nexus API" }),
);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 5000;
connectDB()
  .then(() =>
    app.listen(port, () =>
      console.log(`API running on http://localhost:${port}`),
    ),
  )
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
