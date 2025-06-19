const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "User exists" });

    const user = await User.create({ username, password, role });
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

module.exports = router;
