import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const Blog = mongoose.models.Blog;
    if (!Blog) return res.json([]);
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 }).limit(4);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

export default router;
