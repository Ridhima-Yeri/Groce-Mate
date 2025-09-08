import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// Get all categories (public route)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().select('name');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// Get a single category by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Failed to fetch category' });
  }
});

export default router;
