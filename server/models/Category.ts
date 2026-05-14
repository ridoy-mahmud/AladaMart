import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  icon: { type: String },
  isActive: { type: Boolean, default: true },
  productCount: { type: Number, default: 0 },
}, { timestamps: true });

export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
