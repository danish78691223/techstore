import mongoose from "mongoose";
const item = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    price: Number,
    quantity: { type: Number, min: 1 },
  },
  { _id: false },
);
const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [item],
    total_price: { type: Number, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered"],
      default: "Pending",
    },
    paymentMethod: { type: String, default: "COD" },
  },
  { timestamps: true },
);
export default mongoose.model("Order", schema);
