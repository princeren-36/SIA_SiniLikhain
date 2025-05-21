const express = require("express");
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");

const router = express.Router();

// Multer Storage
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// GET all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// POST create product
router.post("/", upload.single("image"), async (req, res) => {
  const { name, price, artisan, quantity, category } = req.body; // add category
  const image = req.file ? `/uploads/${req.file.filename}` : "";
  const newProduct = new Product({ name, price, image, artisan, quantity, category }); // add category
  await newProduct.save();
  res.json(newProduct);
});

// PUT update product
router.put("/:id", upload.single("image"), async (req, res) => {
  const { name, price, quantity, category } = req.body; // add category
  const update = { name, price, quantity, category }; // add category
  if (req.file) update.image = `/uploads/${req.file.filename}`;
  const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json(product);
});

// DELETE product
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

// POST /products/buy
router.post("/buy", async (req, res) => {
  const { cart } = req.body; // [{_id, quantity}, ...]
  try {
    for (const item of cart) {
      const product = await Product.findById(item._id);
      if (product) {
        product.quantity = Math.max(0, product.quantity - item.quantity);
        await product.save();
      }
    }
    // Optionally, remove products with quantity 0
    await Product.deleteMany({ quantity: { $lte: 0 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Purchase failed" });
  }
});

module.exports = router;
