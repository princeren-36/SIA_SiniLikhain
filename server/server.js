// filepath: c:\Users\Admin\OneDrive\Desktop\finalproject_softeng\server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://renatoperas36:adventuretime36@cluster0.iluvg0w.mongodb.net/SiniLikhainDB?retryWrites=true&w=majority&appName=Cluster0");

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

// Product Schema and Model
const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
});

const Product = mongoose.model("Product", productSchema);

// Routes
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});
app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
});

app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

app.put("/products/:id", async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProduct);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));