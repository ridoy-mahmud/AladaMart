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
        const items = data.docs || data;
        setProducts(items);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 md:p-8 mb-8 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-3">🔥 Hot Deals</h1>
        <p className="text-red-500 text-base md:text-md">Save big on our weekly specials. Hurry up before they run out!</p>
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
