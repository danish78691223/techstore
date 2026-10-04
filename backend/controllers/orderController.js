import Order from "../models/Order.js";
import Product from "../models/Product.js";
export async function createOrder(req, res) {
  const { items, address } = req.body;
  if (!Array.isArray(items) || !items.length || !address)
    return res.status(400).json({ message: "Items and address are required" });
  const ids = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: ids } });
  const map = new Map(products.map((p) => [String(p._id), p]));
  const normalized = [];
  let total = 0;
  for (const i of items) {
    const p = map.get(String(i.product));
    const qty = Math.max(1, Number(i.quantity) || 1);
    if (!p)
      return res.status(400).json({ message: "A product no longer exists" });
    if (p.stock < qty)
      return res
        .status(400)
        .json({ message: `Insufficient stock for ${p.name}` });
    normalized.push({
      product: p._id,
      name: p.name,
      price: p.price,
      quantity: qty,
    });
    total += p.price * qty;
  }
  const order = await Order.create({
    user: req.user._id,
    items: normalized,
    total_price: total,
    address,
  });
  for (const i of normalized)
    await Product.findByIdAndUpdate(i.product, {
      $inc: { stock: -i.quantity },
    });
  res.status(201).json(await order.populate("user", "name email"));
}
export async function myOrders(req, res) {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
}
export async function allOrders(req, res) {
  res.json(
    await Order.find().populate("user", "name email").sort({ createdAt: -1 }),
  );
}
export async function getOrder(req, res) {
  const o = await Order.findById(req.params.id).populate("user", "name email");
  if (!o) return res.status(404).json({ message: "Order not found" });
  if (req.user.role !== "admin" && String(o.user._id) !== String(req.user._id))
    return res.status(403).json({ message: "Forbidden" });
  res.json(o);
}
export async function updateStatus(req, res) {
  const allowed = ["Pending", "Shipped", "Delivered"];
  if (!allowed.includes(req.body.status))
    return res.status(400).json({ message: "Invalid status" });
  const o = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  );
  if (!o) return res.status(404).json({ message: "Order not found" });
  res.json(o);
}
