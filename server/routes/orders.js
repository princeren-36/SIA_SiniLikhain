const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const router = express.Router();

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { userId, items, shippingInfo, totalAmount } = req.body;
    
    // Validate items are in stock
    for (const item of items) {
      const product = await Product.findById(item._id);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for ${product.name}. Available: ${product.quantity}` 
        });
      }
      
      // Store artisanId with each item to track who receives the order
      item.artisanId = product.userId || product.artisanId;
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
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
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
    // Find orders where the artisanId exists in any of the order items
    const orders = await Order.find({ "items.artisanId": artisanId }).sort({ createdAt: -1 });
    
    // Filter each order to only include items belonging to this artisan
    const filteredOrders = orders.map(order => {
      const orderObj = order.toObject();
      // Filter items to only those belonging to this artisan
      orderObj.items = orderObj.items.filter(item => 
        item.artisanId && item.artisanId.toString() === artisanId
      );
      return orderObj;
    });
    
    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch artisan orders", error: error.message });
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

// Get orders with optional artisanId and status filters
router.get("/", async (req, res) => {
  try {
    const { artisanId, status } = req.query;
    let filter = {};
    if (artisanId) {
      filter["items.artisanId"] = artisanId;
    }
    if (status) {
      filter["status"] = status;
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

module.exports = router;
