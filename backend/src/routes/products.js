import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products (public route)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category')
      .select('name price image category featured');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Get a single product by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

export default router;
