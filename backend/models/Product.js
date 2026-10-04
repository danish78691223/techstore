import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    image_name: { type: String, default: "" },
    stock: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);
export default mongoose.model("Product", schema);
