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
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-2xl p-8 md:p-12 mb-10 text-center max-w-4xl mx-auto relative overflow-hidden"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-red-400/10 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"
        />
        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.9, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            className="text-5xl md:text-6xl mb-4"
          >
            🔥
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent mb-4 tracking-tight">
            Hot Deals
          </h1>
          <p className="text-lg text-slate-700 font-medium max-w-lg mx-auto">
            Save big on our weekly specials. Hurry up before they run out!
          </p>
        </div>
      </motion.div>

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
