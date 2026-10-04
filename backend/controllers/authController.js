import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
export async function register(req, res) {
  const { name, email, password, confirm_password } = req.body;
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  if (confirm_password !== undefined && password !== confirm_password)
    return res.status(400).json({ message: "Passwords do not match" });
  if (await User.findOne({ email }))
    return res.status(409).json({ message: "Email is already registered" });
  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 12),
  });
  res
    .status(201)
    .json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
}
export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid email or password" });
  res.json({
    token: generateToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}
export async function me(req, res) {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
}
export async function seedAdmin(req, res) {
  if (process.env.ALLOW_ADMIN_SEED !== "true")
    return res.status(403).json({ message: "Admin seed disabled" });
  const email = req.body.email || "admin@techstore.com";
  const password = req.body.password || "password123";
  let u = await User.findOne({ email });
  if (u) {
    u.role = "admin";
    u.password = await bcrypt.hash(password, 12);
    await u.save();
  } else
    u = await User.create({
      name: "Admin User",
      email,
      password: await bcrypt.hash(password, 12),
      role: "admin",
    });
  res.json({ message: "Admin ready", email, password });
}
