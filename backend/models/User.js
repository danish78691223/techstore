import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    isEmailVerified: { type: Boolean, default: true },
    emailOtpHash: { type: String, default: "" },
    emailOtpExpiresAt: { type: Date, default: null },
    emailOtpLastSentAt: { type: Date, default: null },
  },
  { timestamps: true },
);
export default mongoose.model("User", schema);
