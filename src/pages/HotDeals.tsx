import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function HotDeals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Just fetch products with big discount conceptually. For now, fetch random products and assume they're deals.
    fetch('/api/products?limit=12')
      .then(res => res.json())
      .then(data => {
        // filter or simulate deals
        const items = Array.isArray(data) ? data : (data?.docs || []);
        setProducts(items);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center mb-16 pt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 font-medium text-sm mb-6 border border-red-100"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            Special Offers
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight flex items-center justify-center gap-3"
          >
            Hot <span className="text-red-600 relative inline-block">
              Deals
              <motion.span 
                className="absolute bottom-1 left-0 w-full h-2 bg-red-200 -z-10"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.9, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              className="inline-block relative -top-1"
            >
              🔥
            </motion.div>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto"
          >
            Save big on our weekly specials. Hurry up before they run out!
          </motion.p>
        </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4">Deals of the Week</h2>
      </div>

      {loading ? (
         <div className="w-full flex justify-center py-20">
           <Loader text="Loading deals..." />
         </div>
      ) : (
         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {products.map((p: any, i: number) => (
              <ProductCard key={p._id} product={p} idx={i} />
            ))}
         </div>
      )}
    </div>
  );
}
