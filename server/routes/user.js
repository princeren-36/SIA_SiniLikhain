const express = require("express");
const User = require("../models/User");
const deleteFile = require('../uploads/deleteFile');
const multer = require("multer");
const path = require("path");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Registration with email OTP verification
router.post("/register", async (req, res) => {
  const { username, email, phone, password, role } = req.body;

  try {
    const existingEmail = await User.findOne({ email, role });
    if (existingEmail) return res.status(400).json({ message: "Email already used for this role" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: "Username already taken" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Save OTP and expiry in a temporary user object (not yet created in DB)
    // Send OTP email
    const transporter = require('nodemailer').createTransport({
      service: 'gmail',
      auth: {
        user: 'sinilikhain.noreply@gmail.com',
        pass: 'hhvk flet iozz gqvm'
      }
    });
    try {
      await transporter.sendMail({
        from: 'SiniLikhain <sinilikhain.noreply@gmail.com>',
        to: email,
        subject: 'SiniLikhain Registration Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #333;">SiniLikhain Registration</h1>
            </div>
            <p>Hello,</p>
            <p>Thank you for registering with SiniLikhain! To complete your registration, please use the verification code below:</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
              <h2 style="margin: 0; color: #333; letter-spacing: 5px;">${otp}</h2>
            </div>
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            <p>If you did not request this registration, please ignore this email.</p>
            <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
              &copy; ${new Date().getFullYear()} SiniLikhain. All rights reserved.
            </p>
          </div>
        `
      });
    } catch (err) {
      console.error('Error sending registration OTP:', err);
      return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }

    // Store OTP and registration data in memory (for demo; in production use Redis or DB)
    if (!global.pendingRegistrations) global.pendingRegistrations = {};
    global.pendingRegistrations[email+":"+role] = {
      username, email, phone, password, role,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000
    };

    res.json({ message: 'OTP sent to email. Please verify to complete registration.' });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
});

// OTP verification endpoint for registration
router.post("/verify-registration-otp", async (req, res) => {
  const { email, role, otp } = req.body;
  try {
    if (!global.pendingRegistrations) return res.status(400).json({ message: 'No pending registration for this email.' });
    const regKey = email+":"+role;
    const reg = global.pendingRegistrations[regKey];
    if (!reg) return res.status(400).json({ message: 'No pending registration for this email and role.' });
    if (reg.otp !== otp) return res.status(400).json({ message: 'Invalid OTP.' });
    if (Date.now() > reg.otpExpires) {
      delete global.pendingRegistrations[regKey];
      return res.status(400).json({ message: 'OTP expired.' });
    }
    // Create user
    const user = await User.create({
      username: reg.username,
      email: reg.email,
      phone: reg.phone,
      password: reg.password,
      role: reg.role
    });
    delete global.pendingRegistrations[regKey];
    res.json({ user });
  } catch (err) {
    console.error('Error verifying registration OTP:', err);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  // Check if login is with email or username
  const query = username.includes('@') 
    ? { email: username, password } 
    : { username, password };
  
  const user = await User.findOne(query);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  res.json({ user });
});

router.get("/all", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.put("/:id", upload.single("avatar"), async (req, res) => {
  try {
    const userData = { ...req.body };
    
    if (req.file) {
      const existingUser = await User.findById(req.params.id);
      if (existingUser && existingUser.avatar && existingUser.avatar.includes('/uploads/')) {
        try {
          const oldAvatarPath = existingUser.avatar.replace('/uploads/', '');
          await deleteFile(path.join('uploads', oldAvatarPath));
          console.log(`Deleted old avatar: ${oldAvatarPath}`);
        } catch (err) {
          console.error("Error deleting old avatar:", err);
        }
      }
      
      userData.avatar = `/uploads/${req.file.filename}`;
    }
    
    const updated = await User.findByIdAndUpdate(req.params.id, userData, { new: true });
    res.json(updated);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user profile" });
  }
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

// Send OTP for password reset
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'No user with that email.' });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordToken = otp;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Send OTP email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sinilikhain.noreply@gmail.com', // your sender email
      pass: 'hhvk flet iozz gqvm'            // your app password
    }
  });

  try {
    await transporter.sendMail({
      from: '"SiniLikhain" <sinilikhain.noreply@gmail.com>', // sender (your Gmail)
      to: email, // recipient (the user's input)
      subject: 'SiniLikhain Password Reset Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #333;">Password Reset Request</h1>
          </div>
          <p>Hello,</p>
          <p>We received a request to reset your password for your SiniLikhain account. Please use the verification code below to reset your password:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h2 style="margin: 0; color: #333; letter-spacing: 5px;">${otp}</h2>
          </div>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <p>If you did not request a password reset, please ignore this email or contact support if you have concerns about your account security.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
            &copy; ${new Date().getFullYear()} SiniLikhain. All rights reserved.
          </p>
        </div>
      `
    });
    res.json({ message: 'OTP sent to email.' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ message: 'Failed to send OTP', error: err.toString() });
  }
});

// Verify OTP and reset password
router.post('/reset-password', async (req, res) => {
  const { email, otp, password } = req.body;
  const user = await User.findOne({
    email,
    resetPasswordToken: otp,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) return res.status(400).json({ message: 'Invalid or expired OTP.' });

  user.password = password; // Hash in production!
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password has been reset.' });
});

module.exports = router;
