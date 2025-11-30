const express = require('express'); 
const router = express.Router();
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');

// Middleware: optional auth (for guest cart)
const authOptional = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return next(); // no token, continue as guest

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    next(); // invalid token, continue as guest
  }
};

// Add / update item in user's cart (protected or guest)
router.post('/', authOptional, async (req, res) => {
  const { productId, size, quantity = 1 } = req.body;

  try {
    // Logged-in user
    if (req.user) {
      const user = await User.findById(req.user.id);
      const existing = user.cart.find(
        (c) => c.product.toString() === productId && c.size === size
      );

      if (existing) existing.quantity += quantity;
      else user.cart.push({ product: productId, size, quantity });

      await user.save();
      return res.json(user.cart);
    }

    // Guest cart stored in session (or return guest cart array)
    if (!req.session.cart) req.session.cart = [];
    const existing = req.session.cart.find(
      (c) => c.product === productId && c.size === size
    );

    if (existing) existing.quantity += quantity;
    else req.session.cart.push({ product: productId, size, quantity });

    res.json(req.session.cart);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get cart items
router.get('/', authOptional, async (req, res) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user.id).populate('cart.product');
      return res.json(user.cart);
    }

    // Guest cart
    res.json(req.session.cart || []);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Remove item
router.delete('/:cartItemId', authOptional, async (req, res) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user.id);
      user.cart = user.cart.filter(
        (c) => c._id.toString() !== req.params.cartItemId
      );
      await user.save();
      return res.json(user.cart);
    }

    // Guest cart: cartItemId is index for simplicity
    if (req.session.cart) {
      req.session.cart = req.session.cart.filter(
        (_, idx) => idx.toString() !== req.params.cartItemId
      );
    }
    res.json(req.session.cart || []);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
