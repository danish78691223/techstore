const normalizeFeatures = (value) => Array.isArray(value) ? value.map(v => String(v).trim()).filter(Boolean).slice(0, 10) : typeof value === "string" ? value.split(/[\n,]/).map(v => v.trim()).filter(Boolean).slice(0, 10) : [];\nimport Product from "../models/Product.js";
export async function listProducts(req, res) {
  const limit = Math.min(Number(req.query.limit) || 0, 100);
  const q = {};
  if (req.query.search) q.name = { $regex: req.query.search, $options: "i" };
  let query = Product.find(q).sort({ createdAt: -1 });
  if (limit) query = query.limit(limit);
  res.json(await query);
}
export async function getProduct(req, res) {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json(p);
}
export async function createProduct(req, res) {
  const { name, description, price, stock } = req.body;
  if (!name || price === undefined)
    return res.status(400).json({ message: "Name and price are required" });
  const p = await Product.create({
    name,
    description,
    price: Number(price),
    stock: Number(stock) || 0,
    image_name: req.file?.filename || req.body.image_name || "",
    features: normalizeFeatures(req.body.features),
  });
  res.status(201).json(p);
}
export async function updateProduct(req, res) {
  const data = { ...req.body };
  if (data.price !== undefined) data.price = Number(data.price);
  if (data.stock !== undefined) data.stock = Number(data.stock);
  if (req.file) data.image_name = req.file.filename;
  if (data.features !== undefined) data.features = normalizeFeatures(data.features);
  const p = await Product.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json(p);
}
export async function deleteProduct(req, res) {
  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
}
export async function stats(req, res) {
  res.json({ totalProducts: await Product.countDocuments(), totalOrders: 0 });
}
