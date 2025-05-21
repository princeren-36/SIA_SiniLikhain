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
      user: String, // username or user id
      value: Number // 1-5
    }
  ]
});

module.exports = mongoose.model("Product", productSchema);
