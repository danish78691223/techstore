import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { dashboard } from "../controllers/adminController.js";
const r = Router();
r.get("/dashboard", protect, adminOnly, dashboard);
export default r;
