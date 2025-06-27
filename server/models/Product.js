const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  artisan: String,
  quantity: { type: Number, default: 1 },
  category: String,
  ratings: [
    {
      user: String,
      value: Number
    }
  ],

  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
});

module.exports = mongoose.model("Product", productSchema);
