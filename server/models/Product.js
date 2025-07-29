const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  // add other fields here
});

module.exports = mongoose.model('Product', ProductSchema);
