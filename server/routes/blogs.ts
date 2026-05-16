import { Router } from 'express';
import mongoose from 'mongoose';
import { Blog } from '../models/Blog.js';

const router = Router();

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true } as any).sort({ position: 1, createdAt: -1 } as any);
    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Admin get all blogs
router.get('/all', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ position: 1, createdAt: -1 } as any);
    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get single blog by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug } as any);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create blog
router.post('/', async (req, res) => {
  try {
    const highestPosBlog = await Blog.findOne().sort('-position');
    const position = highestPosBlog ? highestPosBlog.position + 1 : 1;
    
    // Ensure slug doesn't exist
    const baseSlug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = req.body.slug || baseSlug;
    
    let count = 1;
    while (await Blog.findOne({ slug } as any)) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const blog = new Blog({
      ...req.body,
      slug,
      position,
    });
    
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update blog
router.put('/:id', async (req, res) => {
  try {
    const blog = await (Blog as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Delete blog
router.delete('/:id', async (req, res) => {
  try {
    const blog = await (Blog as any).findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Reorder blogs
router.post('/reorder', async (req, res) => {
  try {
    const { order } = req.body; // array of { _id, position }
    if (!Array.isArray(order)) return res.status(400).json({ message: 'Invalid format' });
    
    const updates = order.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { position: item.position } }
      }
    }));
    
    await (Blog as any).bulkWrite(updates);
    res.json({ message: 'Reordered successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
