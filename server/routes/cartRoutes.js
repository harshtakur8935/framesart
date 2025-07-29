const express = require("express");
const router = express.Router();
const cart = require("./models/cart"); // ✅ Confirm this path and file name
const Product = require("../models/Product");
const stripe = require("stripe")("sk_test_YOUR_SECRET_KEY"); // 🔒 Replace with your actual Stripe Secret Key

// Add to Cart Route
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity }],
      });
    } else {
      const productIndex = cart.products.findIndex(p =>
        p.product.toString() === productId
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Stripe Payment Intent Route
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("products.product");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const amount = cart.products.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses smallest currency unit (e.g., cents)
      currency: "usd",
      metadata: { integration_check: "accept_a_payment" },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe payment intent error:", error);
    res.status(500).json({ error: "Payment intent failed" });
  }
});

module.exports = router;
