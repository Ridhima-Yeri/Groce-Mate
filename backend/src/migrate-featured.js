import mongoose from 'mongoose';
import Product from './models/Product.js';

const MONGODB_URI = 'mongodb://localhost:27017/groce-mate';

async function migrateFeaturedField() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all existing products to have featured: false if they don't have this field
    const result = await Product.updateMany(
      { featured: { $exists: false } },
      { $set: { featured: false } }
    );

    console.log(`Updated ${result.modifiedCount} products with featured field`);

    // Get a few products and mark them as featured for testing
    const products = await Product.find().limit(5);
    
    if (products.length > 0) {
      // Mark first 3 products as featured
      for (let i = 0; i < Math.min(3, products.length); i++) {
        await Product.findByIdAndUpdate(products[i]._id, { featured: true });
        console.log(`Marked product "${products[i].name}" as featured`);
      }
    }

    // Display current featured products
    const featuredProducts = await Product.find({ featured: true }).populate('category');
    console.log('\nCurrent featured products:');
    featuredProducts.forEach(product => {
      console.log(`- ${product.name} (Featured: ${product.featured})`);
    });

    await mongoose.disconnect();
    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateFeaturedField();
