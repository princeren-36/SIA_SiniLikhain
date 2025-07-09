const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "artisan", "buyer"], required: true },
  bio: { type: String, default: "This is your artisan profile. Update your information to let buyers know more about you and your craft!" },
  location: { type: String, default: "Philippines" },
  joined: { type: Date, default: Date.now },
  avatar: { type: String, default: null },
  statistics: {
    totalProducts: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    salesCompleted: { type: Number, default: 0 }
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

module.exports = mongoose.model("User", userSchema);
