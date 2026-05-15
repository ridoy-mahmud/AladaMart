import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  coverImage: { type: String },
  author: { type: String, default: 'Admin' },
  authorAvatar: { type: String },
  category: { type: String },
  readTime: { type: String },
  isPublished: { type: Boolean, default: true },
  position: { type: Number, default: 0 },
}, { timestamps: true });

export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
