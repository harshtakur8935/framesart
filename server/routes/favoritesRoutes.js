const express = require('express');
const router = express.Router();
const FavoriteItem = require('../models/FavoriteItem'); // Mongoose model

// GET: fetch all favorite products
router.get('/', async (req, res) => {
  try {
    const favorites = await FavoriteItem.find();
    res.json({ products: favorites });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});

// ✅ POST: add a product to favorites
router.post('/', async (req, res) => {
  const { productId, name, price, imageUrl } = req.body;

  if (!productId || !name || !price || !imageUrl) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Avoid duplicates
    const exists = await FavoriteItem.findOne({ productId });
    if (exists) {
      return res.status(409).json({ message: 'Product already in favorites' });
    }

    const newFavorite = new FavoriteItem({ productId, name, price, imageUrl });
    const saved = await newFavorite.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Error adding to favorites' });
  }
});

// DELETE: remove product from favorites by productId
router.delete('/remove', async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }

  try {
    const result = await FavoriteItem.findOneAndDelete({ productId });

    if (!result) {
      return res.status(404).json({ message: 'Product not found in favorites.' });
    }

    res.json({ message: 'Product removed from favorites.' });
  } catch (error) {
    console.error('Error removing product from favorites:', error);
    res.status(500).json({ message: 'Error removing favorite.' });
  }
});

module.exports = router;
