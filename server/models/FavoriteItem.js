const mongoose = require('mongoose');

// Define the schema for favorite items
const favoriteItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',  // Link to your Product model
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be a positive number'] // Ensures positive price
    },
    imageUrl: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

// Create and export the FavoriteItem model
module.exports = mongoose.model('FavoriteItem', favoriteItemSchema);
