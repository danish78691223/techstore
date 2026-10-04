import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
const __filename = fileURLToPath(import.meta.url),
  __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (req, file, cb) =>
    cb(
      null,
      `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-")}`,
    ),
});
const upload = multer({ storage });
const r = Router();
r.get("/", listProducts);
r.get("/:id", getProduct);
r.post("/", protect, adminOnly, upload.single("image"), createProduct);
r.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);
r.delete("/:id", protect, adminOnly, deleteProduct);
export default r;
