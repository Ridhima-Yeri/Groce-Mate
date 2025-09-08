import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, required: true, unique: true },
  
  // Updated products schema to match what the frontend expects
  items: [
    {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String }
    }
  ],
  
  // For backward compatibility with API format
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ],
  
  total: { type: Number, required: true },
  subtotal: { type: Number },
  deliveryFee: { type: Number, default: 0 },
  
  status: { type: String, default: 'Processing' }, // User-friendly display status
  deliveryStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  
  // Delivery information
  deliveryAddress: {
    fullName: { type: String },
    phone: { type: String },
    email: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  },
  
  paymentMethod: { type: String },
  orderNotes: { type: String },
  estimatedDelivery: { type: Date }
}, { timestamps: true });

// Generate order number before saving if not provided
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD${Date.now()}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
