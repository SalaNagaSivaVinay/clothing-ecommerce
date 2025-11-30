const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Helper: send email
async function sendOrderEmail(toEmail, order) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const itemsHtml = order.items.map(i => `<li>${i.name} - size: ${i.size} × ${i.quantity} @ ₹${i.price}</li>`).join('');
  const html = `
    <h3>Order Confirmation - ${order._id}</h3>
    <p>Order Date: ${order.orderDate.toLocaleString()}</p>
    <ul>${itemsHtml}</ul>
    <p><strong>Total: ₹${order.total}</strong></p>
  `;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: toEmail,
    subject: `Order Confirmation - ${order._id}`,
    html
  });
}

// Checkout route (protected)
router.post('/checkout', auth, async (req, res) => {
  // body may include cart snapshot for guest checkout, but here user cart is used
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    if(!user) return res.status(400).json({ message: 'User not found' });
    if(user.cart.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    const items = user.cart.map(ci => ({
      product: ci.product._id,
      name: ci.product.name,
      size: ci.size,
      quantity: ci.quantity,
      price: ci.product.price
    }));
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0);

    const order = new Order({
      user: user._id,
      items,
      total
    });
    await order.save();

    // clear user cart
    user.cart = [];
    await user.save();

    // send email
    try {
      await sendOrderEmail(user.email, order);
    } catch(e) {
      console.error('Email error', e);
      // don't fail order if email fails; just log
    }

    res.json({ orderId: order._id, order });
  } catch(err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product').sort({ orderDate: -1 });
    res.json(orders);
  } catch(err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
