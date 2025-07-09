const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  artisan: String,
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  quantity: Number,
  category: String,
  status: String,
  image: String,
  ratings: [
    {
      user: String,
      value: Number
    }
  ]
});

module.exports = mongoose.model("Product", productSchema);
