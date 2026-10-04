import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
export async function dashboard(req, res) {
  res.json({
    totalProducts: await Product.countDocuments(),
    totalOrders: await Order.countDocuments(),
    totalUsers: await User.countDocuments(),
    revenue:
      (
        await Order.aggregate([
          { $group: { _id: null, total: { $sum: "$total_price" } } },
        ])
      )[0]?.total || 0,
  });
}
