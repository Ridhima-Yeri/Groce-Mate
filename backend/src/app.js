import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import productRoutes from './routes/products.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);

// Add test route first
app.get('/api/test', (req, res) => {
  console.log('Test route hit!');
  res.json({ message: 'Server is working!' });
});

// Add categories route
app.get('/api/categories', async (req, res) => {
  try {
    console.log('Categories route hit!');
    // Import Category model
    const { default: Category } = await import('./models/Category.js');
    const categories = await Category.find().select('name');
    console.log('Categories found:', categories.length);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/groce-mate', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

export default app;