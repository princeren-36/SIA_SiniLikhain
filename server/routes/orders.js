const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require('mongoose');
const router = express.Router();

// Create a new order
router.post("/", async (req, res) => {
  try {
    let { userId, items, shippingInfo, totalAmount } = req.body;
    // Prevent userId (buyer) from being the same as artisanId for any item
    // If so, set userId to a dummy value or reject the order
    // (Best: reject the order and inform the frontend)
    let artisanIds = [];
    for (const item of items) {
      const productId = item._id || item.productId;
      const product = await Product.findById(productId);
      if (product && product.userId) {
        artisanIds.push(product.userId.toString());
      }
    }
    // If all artisanIds are the same as userId, reject
    if (artisanIds.length > 0 && artisanIds.every(aid => aid === userId)) {
      return res.status(400).json({ message: "You cannot order your own products as a buyer. Please use a different account." });
    }
    
    // Validate items are in stock and always set artisanId from product.userId
    for (const item of items) {
      // Accept both _id and productId from frontend
      const productId = item._id || item.productId;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name || productId} not found` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for ${product.name}. Available: ${product.quantity}` 
        });
      }
      // Always set artisanId from product.userId (the artisan's _id), even if missing
      item.artisanId = product.userId ? product.userId.toString() : null;
    }
    
    // Create the order
    const order = new Order({
      userId,
      items: items.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        artisanId: item.artisanId // Store artisan ID with each item
      })),
      shippingInfo,
      totalAmount,
      paymentMethod: shippingInfo.paymentMethod || "cod"
    });
    
    await order.save();
    
    // Update product inventory
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item._id,
        { $inc: { quantity: -item.quantity } }
      );
    }
    
    res.status(201).json({ message: "Order created successfully", orderId: order._id });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

// Get orders for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    let objectId = null;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      objectId = new mongoose.Types.ObjectId(userId);
    }
    // Match both string and ObjectId for userId
    const orders = await Order.find({
      $or: [
        { userId: userId },
        { userId: objectId }
      ]
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

// Get a specific order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
});

// Update order status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
});

// Get orders for a specific artisan
router.get("/artisan/:artisanId", async (req, res) => {
  try {
    const artisanId = req.params.artisanId;
    let objectId = null;
    if (mongoose.Types.ObjectId.isValid(artisanId)) {
      objectId = new mongoose.Types.ObjectId(artisanId);
    }
    // Find all orders that have at least one item with this artisanId (as ObjectId only)
    const orders = await Order.find({
      "items.artisanId": objectId
    })
      .populate({
        path: 'userId',
        select: 'username email phone _id'
      })
      .populate('items.productId')
      .lean();

    // For each order, filter items to only those belonging to this artisan
    const filteredOrders = orders.map(order => {
      const artisanItems = order.items.filter(item => {
        return item.artisanId && item.artisanId.toString() === artisanId;
      });
      return {
        ...order,
        items: artisanItems
      };
    }).filter(order => order.items.length > 0); // Only include orders with at least one item for this artisan

    res.json(filteredOrders);
  } catch (err) {
    console.error("Artisan orders fetch error:", err);
    res.status(500).json({ message: 'Failed to fetch artisan orders', error: err.message });
  }
});

// Update payment status
router.patch("/:id/payment", async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update payment status", error: error.message });
  }
});

// Get orders with optional artisanId, userId, and status filters
router.get("/", async (req, res) => {
  try {
    const { artisanId, userId, status } = req.query;
    let filter = {};
    if (artisanId) {
      filter["items.artisanId"] = artisanId;
    }
    if (userId) {
      filter["userId"] = userId;
    }
    if (status) {
      filter["status"] = status;
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

module.exports = router;
