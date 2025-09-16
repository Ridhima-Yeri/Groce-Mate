import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }, // Changed from String to Number
  image: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
