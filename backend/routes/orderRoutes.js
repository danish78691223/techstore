import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  createOrder,
  myOrders,
  allOrders,
  getOrder,
  updateStatus,
} from "../controllers/orderController.js";
const r = Router();
r.post("/", protect, createOrder);
r.get("/my", protect, myOrders);
r.get("/", protect, adminOnly, allOrders);
r.get("/:id", protect, getOrder);
r.patch("/:id/status", protect, adminOnly, updateStatus);
export default r;
