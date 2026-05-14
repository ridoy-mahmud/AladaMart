import { Router } from 'express';
import { Category } from '../models/Category.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true } as any).sort('name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;
