import { Router } from "express";
import {
  register,
  login,
  me,
  seedAdmin,
  verifyOtp,
  resendOtp,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const r = Router();
r.post("/register", register);
r.post("/verify-otp", verifyOtp);
r.post("/resend-otp", resendOtp);
r.post("/login", login);
r.get("/me", protect, me);
r.post("/seed-admin", seedAdmin);
export default r;
