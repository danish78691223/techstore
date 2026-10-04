import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { dashboard, analytics } from "../controllers/adminController.js";
const r=Router();
r.get("/dashboard",protect,adminOnly,dashboard);
r.get("/analytics",protect,adminOnly,analytics);
export default r;