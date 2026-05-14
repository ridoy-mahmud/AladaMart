import { Router } from 'express';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

const router = Router();

// GET all products (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 20, isFeatured, isNewArrival, isBestSeller } = req.query;
    
    let query: any = { status: 'active' };
    
    if (category) query.categoryName = category;
    if (isFeatured) query.isFeatured = true;
    if (isNewArrival) query.isNewArrival = true;
    if (isBestSeller) query.isBestSeller = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).limit(Number(limit)).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product by slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug } as any);
    if (!product) {
       res.status(404).json({ error: 'Product not found' });
       return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;
