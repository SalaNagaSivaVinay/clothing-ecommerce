const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ✅ GET ALL PRODUCTS (with search, category, size & price filters but NO LIMIT)
router.get('/', async (req, res) => {
  try {
    const { search, category, size, min, max } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== "All") query.category = category;
    if (size && size !== "All") query.sizes = size;

    if (min || max) {
      query.price = {};
      if (min) query.price.$gte = Number(min);
      if (max) query.price.$lte = Number(max);
    }

    // 🟢 Fetch all matching products (no pagination)
    const products = await Product.find(query);

    res.json({
      products,
      total: products.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// GET SINGLE PRODUCT BY ID
router.get('/:id', async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });
    res.json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
