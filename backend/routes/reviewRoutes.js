import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { listReviews, reviewEligibility, createReview } from "../controllers/reviewController.js";
const r=Router();
r.get("/:productId",listReviews);
r.get("/:productId/eligibility",protect,reviewEligibility);
r.post("/:productId",protect,createReview);
export default r;