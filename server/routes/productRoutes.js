const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Assuming you have a Product model

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // Fetching products from DB
    res.status(200).json(products); // Send products as response
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

module.exports = router;
