import mongoose from 'mongoose';
import Category from './models/Category.js';
import dotenv from 'dotenv';

dotenv.config();

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Check if categories already exist
    const existingCategories = await Category.countDocuments();
    if (existingCategories > 0) {
      console.log('Categories already exist, skipping seed');
      return;
    }

    // Seed categories
    const categories = [
      { name: 'Fruits & Vegetables' },
      { name: 'Dairy & Eggs' },
      { name: 'Meat & Seafood' },
      { name: 'Bakery' },
      { name: 'Pantry Staples' },
      { name: 'Snacks' },
      { name: 'Beverages' },
      { name: 'Frozen Foods' },
      { name: 'Personal Care' },
      { name: 'Household Items' }
    ];

    await Category.insertMany(categories);
    console.log('Categories seeded successfully');
    
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCategories();
}

export default seedCategories;
