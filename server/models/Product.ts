import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 200 },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  images: [{ url: String, alt: String }],
  thumbnail: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  categoryName: { type: String },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  brandName: { type: String },
  tags: [String],
  colors: [{ name: String, hex: String }],
  sizes: [String],
  stock: { type: Number, required: true, default: 0, min: 0 },
  sku: { type: String },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isOnSale: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
