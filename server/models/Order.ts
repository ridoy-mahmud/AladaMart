import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Firebase UID
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    price: Number,
    quantity: Number,
    thumbnail: String
  }],
  total: { type: Number, required: true },
  billing: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String
  },
  paymentMethod: { type: String, enum: ['cod', 'paynow'], default: 'cod' },
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

export const Order: any = mongoose.models.Order || mongoose.model('Order', orderSchema);
