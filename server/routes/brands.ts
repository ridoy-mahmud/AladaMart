import { Router } from 'express';
import { Brand } from '../models/Brand.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true } as any).sort('name');
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

export default router;
