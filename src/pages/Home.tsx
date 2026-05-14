import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, RotateCcw, Headset, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products?limit=8').then(res => res.json()),
      fetch('/api/brands').then(res => res.json())
    ]).then(([productsData, brandsData]) => {
      setProducts(productsData.docs || productsData);
      setBrands(brandsData);
      setLoading(false);
    });
  }, []);

  return (
    <div className="pb-20">
      {/* Hero Section - Compact */}
      <section className="px-4 mx-auto max-w-7xl pt-4 md:pt-6">
        <div className="bg-[#f0f2f5] rounded-[2rem] overflow-hidden relative flex items-center h-[400px]">
          <div className="relative z-10 w-full md:w-1/2 p-8 md:px-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight"
            >
              Grab Upto 50% Off On <br className="hidden md:block"/>Selected Headphone
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-slate-600 mb-8 max-w-sm"
            >
              Buy the best headphones from ShopMart. The new generation of sound excellence has arrived.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to="/shop" className="inline-block bg-primary hover:bg-primary-dark transition-colors text-white font-semibold px-8 py-3 rounded-full text-sm">
                Buy Now
              </Link>
            </motion.div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full hidden md:flex justify-end items-center pointer-events-none">
             <div className="absolute right-20 w-80 h-80 bg-[#ffeedb] rounded-full mix-blend-multiply opacity-50 blur-3xl"></div>
             <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop" alt="Headphones" className="relative z-10 h-[120%] max-w-none object-cover transform rotate-[-5deg] mix-blend-darken filter drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="pt-16 px-4 max-w-7xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Recommended For You</h2>
          <Link to="/shop" className="text-primary font-medium hover:text-primary-dark transition-colors flex items-center gap-1">
            View All <ChevronRight size={18}/>
          </Link>
        </div>

        {loading ? (
          <div className="w-full flex justify-center py-20">
            <Loader text="Loading products..." />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product: any, idx: number) => (
              <ProductCard key={product._id} product={product} idx={idx} />
            ))}
          </div>
        )}
      </section>

      {/* Shop By Brands */}
      <section className="pt-20 px-4 max-w-7xl mx-auto">
         <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Shop By Brands</h2>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {brands.slice(0, 10).map((b: any) => (
               <Link to={`/shop?brand=${b.slug || b.name}`} key={b._id} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-center font-bold text-slate-700 hover:text-primary hover:border-primary/20 transition-all group flex items-center justify-center">
                 <span className="group-hover:scale-110 transition-transform">{b.name}</span>
               </Link>
            ))}
         </div>
      </section>

      {/* Promotional Banners */}
      <section className="pt-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
           <div className="rounded-[2rem] bg-[#f0f2f5] p-8 md:p-10 flex flex-col justify-center relative overflow-hidden group min-h-[250px]">
             <div className="relative z-10 w-full md:w-3/5 text-left">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Weekly Savings</h3>
                <h4 className="text-2xl md:text-3xl font-extrabold text-primary mb-4">Upto 40% Off</h4>
                <Link to="/deal" className="inline-block bg-slate-900 text-white hover:bg-primary transition-colors font-medium px-6 py-2.5 rounded-full shadow-lg text-sm">Shop Now</Link>
             </div>
             <div className="absolute right-0 top-0 bottom-0 w-1/2 flex justify-end transform">
                 <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover transform min-w-[200px] absolute mix-blend-darken opacity-90 slide-in group-hover:scale-105 transition-transform duration-500" alt="Promo" style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }} />
             </div>
           </div>
           
           <div className="rounded-[2rem] bg-[#fffbef] p-8 md:p-10 flex flex-col justify-center relative overflow-hidden group min-h-[250px]">
             <div className="relative z-10 w-full md:w-3/5 text-left">
                <h3 className="text-lg font-bold text-slate-900 mb-1">New Arrivals</h3>
                <h4 className="text-2xl md:text-3xl font-extrabold text-secondary mb-4">Upto 50% Off</h4>
                <Link to="/shop" className="inline-block bg-slate-900 text-white hover:bg-secondary transition-colors font-medium px-6 py-2.5 rounded-full shadow-lg text-sm">Shop Now</Link>
             </div>
             <div className="absolute right-0 top-0 bottom-0 w-1/2 flex justify-end transform">
                 <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover min-w-[200px] absolute mix-blend-darken opacity-90 slide-in group-hover:scale-105 transition-transform duration-500" alt="Promo" style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }} />
             </div>
           </div>
        </div>
      </section>
      
      {/* Trust Badges */}
      <section className="py-20 max-w-7xl mx-auto px-4 border-t border-slate-100 mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <Truck size={36} className="text-primary"/>, title: "Free Delivery", desc: "Free shipping over $100" },
            { icon: <RotateCcw size={36} className="text-secondary"/>, title: "Free Return", desc: "Free return over $100" },
            { icon: <Headset size={36} className="text-danger"/>, title: "Customer Support", desc: "Friendly 24/7 support" },
            { icon: <ShieldCheck size={36} className="text-success"/>, title: "Money Back Guard", desc: "Quality checked by us" },
          ].map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4">
               <div className="bg-slate-50 p-4 rounded-full border border-slate-100 transition-colors hover:border-slate-200">
                 {b.icon}
               </div>
               <div>
                  <h4 className="font-bold text-slate-900">{b.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{b.desc}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
