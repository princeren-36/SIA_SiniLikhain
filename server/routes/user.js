const express = require("express");
const User = require("../models/User");
const deleteFile = require('../uploads/deleteFile');
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, phone, password, role } = req.body;

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "User exists" });

    const user = await User.create({ username, email, phone, password, role });
    res.json({ user });
  } catch {
    res.status(500).json({ message: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  res.json({ user });
});

router.get("/all", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.put("/:id", async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// New endpoints for profile management

// Get user profile details
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Format response with only necessary data
    const profile = {
      id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      location: user.location,
      joined: user.joined,
      avatar: user.avatar,
      statistics: user.statistics || {
        totalProducts: 0,
        averageRating: 0,
        salesCompleted: 0
      }
    };
    
    res.json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

// Update user profile
router.put("/profile/:id", async (req, res) => {
  try {
    const { name, email, bio, location, avatar } = req.body;
    
    // Find user and update allowed profile fields
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { 
        username: name, 
        email, 
        bio, 
        location,
        avatar
      },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({
      id: updated._id,
      name: updated.username,
      email: updated.email,
      bio: updated.bio,
      location: updated.location,
      joined: updated.joined,
      avatar: updated.avatar,
      role: updated.role,
      statistics: updated.statistics
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Error updating user profile" });
  }
});

// Delete user profile avatar
router.delete('/profile/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.avatar) {
      deleteFile(user.avatar);
    }
    user.avatar = null;
    await user.save();
    res.json({ message: 'Profile image deleted', avatar: null });
  } catch (err) {
    console.error('Error deleting profile image:', err);
    res.status(500).json({ message: 'Error deleting profile image' });
  }
});

module.exports = router;
