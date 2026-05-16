import express from 'express';
import { Wishlist } from '../models/Wishlist.js';
import { Product } from '../models/Product.js';

const router = express.Router();

// Get wishlist items for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const list = await Wishlist.find({ userId: req.params.userId } as any).populate('productId');
    res.json(list.map(w => w.productId).filter(p => !!p));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all wishlisted products or top ones
router.get('/admin', async (req, res) => {
  try {
    // We can group by productId
    const aggregated = await Wishlist.aggregate([
      { $group: { _id: "$productId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    await Product.populate(aggregated, { path: "_id" });
    const formatted = aggregated.map(a => ({
        product: a._id,
        count: a.count
    })).filter(a => !!a.product);
    
    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle wishlist item
router.post('/toggle', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) return res.status(400).json({ error: 'Missing fields' });
    
    const existing = await Wishlist.findOne({ userId, productId } as any);
    if (existing) {
       await Wishlist.deleteOne({ _id: existing._id } as any);
       return res.json({ removed: true });
    }
    
    const newWishlist = new Wishlist({ userId, productId });
    await newWishlist.save();
    res.status(201).json({ added: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
