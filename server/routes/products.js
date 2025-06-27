const express = require("express");
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  // Always return all products, regardless of status (for testing/demo)
  const products = await Product.find();
  res.json(products);
});

router.post("/", upload.single("image"), async (req, res) => {
  const { name, price, artisan, quantity, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : "";
  // Set status to 'pending' by default
  const newProduct = new Product({ name, price, image, artisan, quantity, category, status: "pending" });
  await newProduct.save();
  res.json(newProduct);
});

router.patch("/:id/approve", async (req, res) => {
  // Set status to 'approved'
  const product = await Product.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
  res.json(product);
});

router.patch("/:id/reject", async (req, res) => {
  // Set status to 'rejected'
  const product = await Product.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
  res.json(product);
});

router.put("/:id", upload.single("image"), async (req, res) => {
  const { name, price, quantity, category } = req.body;
  const update = { name, price, quantity, category };
  if (req.file) update.image = `/uploads/${req.file.filename}`;
  const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json(product);
});

router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

router.post("/buy", async (req, res) => {
  const { cart } = req.body;
  try {
    for (const item of cart) {
      const product = await Product.findById(item._id);
      if (product) {
        product.quantity = Math.max(0, product.quantity - item.quantity);
        await product.save();
      }
    }
    await Product.deleteMany({ quantity: { $lte: 0 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Purchase failed" });
  }
});

router.post("/:id/rate", async (req, res) => {
  const { user, value } = req.body;
  if (!user || !value) return res.status(400).json({ message: "Missing user or value" });

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.ratings = product.ratings.filter(r => r.user !== user);
  product.ratings.push({ user, value });
  await product.save();

  res.json(product);
});

module.exports = router;
