import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, RotateCcw, Headset, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products?limit=12').then(res => res.ok ? res.json() : []),
      fetch('/api/brands').then(res => res.ok ? res.json() : []),
      fetch('/api/blogs').then(res => res.ok ? res.json() : [])
    ]).then(([productsData, brandsData, blogsData]) => {
      setProducts(Array.isArray(productsData) ? productsData : (productsData?.docs || []));
      setBrands(brandsData || []);
      setBlogs(Array.isArray(blogsData) ? blogsData.slice(0, 3) : []);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to fetch home data", err);
      setProducts([]);
      setBrands([]);
      setBlogs([]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="pb-20">
      {/* Hero Section - Grid Layout */}
      <section className="px-4 mx-auto max-w-7xl pt-4 md:pt-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr] gap-4 md:gap-6">
          
          {/* Main Banner */}
          <div className="bg-[#bdf0c1] rounded-3xl overflow-hidden relative flex flex-col md:flex-row shadow-sm hover:shadow-md transition-all duration-300 group h-auto md:h-[360px]">
            <div className="relative z-10 w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center items-start text-left h-full">
              <div className="inline-flex items-center gap-2 bg-[#9ce5a7]/80 hover:bg-[#9ce5a7] rounded-full p-1 pr-3 mb-4 cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="bg-[#0b9c4c] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">NEWS</span>
                <span className="text-xs font-medium text-[#076a32] whitespace-nowrap">Free Shipping on Orders Above ৳5000!</span>
                <ArrowRight size={14} className="text-[#076a32] group-hover:translate-x-1 transition-transform"/>
              </div>
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-2xl lg:text-4xl md:text-3xl font-extrabold text-[#364757] mb-4 leading-tight tracking-tight group-hover:scale-[1.02] origin-left transition-transform duration-300"
              >
                Grab Upto <span className="text-[#138e3e]">50% Off</span> On<br/>Selected Headphone
              </motion.h2>
              <div className="mb-4 md:mb-5 flex flex-col items-start gap-1">
                <span className="text-xs font-semibold text-[#1a1a1a]">Starts from</span>
                <span className="text-xl md:text-2xl font-bold text-[#1a1a1a]">৳490</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 h-56 md:h-full relative flex items-center justify-center p-6 md:p-8 pointer-events-none">
               <motion.img 
                 initial={{ opacity: 0, x: 50 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
                 src="https://i.ibb.co/6JVb0qFc/d4619a4a55ea99c9b947f3573562b2b9.png" 
                 alt="Premium Black Headphones" 
                 className="w-full h-full max-w-[320px] sm:max-w-[380px] md:max-w-[280px] lg:max-w-[100%] max-h-[260px] md:max-h-[280px] lg:max-h-[100%] object-contain drop-shadow-2xl" 
               />
            </div>
          </div>

          {/* Side Banners */}
          <div className="flex flex-col gap-4 md:gap-5 h-[360px]">
            {/* Best Products Card */}
            <Link to="/shop" className="flex-1 bg-[#fedfb3] rounded-3xl p-6 md:p-8 relative flex flex-col justify-center shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 group overflow-hidden cursor-pointer h-full">
              <div className="relative z-10 w-3/5">
                <h3 className="text-2xl font-bold text-[#45525e] mb-1 leading-snug group-hover:text-black transition-colors">Best<br/><span className="text-[#aa8a66] font-medium group-hover:text-[#8a6a46] transition-colors">products</span></h3>
                <span className="text-sm font-bold text-[#45525e] flex items-center gap-1 group-hover:text-black transition-colors mt-3">
                  View more <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </div>
              <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-[160px] pointer-events-none">
                <img 
                  src="https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&q=80&auto=format&fit=crop" 
                  alt="Airpods" 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 group-hover:-rotate-6" 
                />
              </div>
            </Link>

            {/* Discounts Card */}
            <Link to="/deal" className="flex-1 bg-[#c5ddf9] rounded-3xl p-6 md:p-8 relative flex flex-col justify-center shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 group overflow-hidden cursor-pointer h-full">
              <div className="relative z-10 w-3/5">
                <h3 className="text-2xl font-bold text-[#45525e] mb-1 leading-snug group-hover:text-black transition-colors">20%<br/><span className="text-[#84a3c3] font-medium group-hover:text-[#6483a3] transition-colors">discounts</span></h3>
                <span className="text-sm font-bold text-[#45525e] flex items-center gap-1 group-hover:text-black transition-colors mt-3">
                  View more <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </div>
              <div className="absolute right-[0px] top-1/2 -translate-y-1/2 w-[140px] pointer-events-none">
                <img 
                  src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80&auto=format&fit=crop" 
                  alt="Smartwatch" 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 group-hover:-rotate-6" 
                />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Marquee */}
      <section className="py-5 md:py-6 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="flex w-max animate-marquee">
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              {["Smartphones", "Laptops & PC", "Audio & Headphones", "Cameras", "Tablets", "Wearables", "Gaming"].map((category, idx) => {
                const slug = category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
                return (
                  <Link 
                    key={`${i}-${idx}`} 
                    to={`/shop?category=${encodeURIComponent(slug)}`}
                    className="mx-2 md:mx-2.5 px-5 py-2 md:px-6 md:py-2.5 bg-[#f4f6f9] hover:bg-[#e2e8f0] text-[#5c6e82] hover:text-slate-900 font-medium text-[14px] md:text-[15px] rounded-xl transition-colors whitespace-nowrap"
                  >
                    {category}
                  </Link>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
      </section>

      {/* Recommended Products */}
      <section className="pt-10 px-4 max-w-7xl mx-auto">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product: any, idx: number) => (
              <ProductCard key={product._id} product={product} idx={idx} />
            ))}
          </div>
        )}
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
      
      {/* Latest Blogs */}
      {blogs.length > 0 && (
        <section className="pt-20 px-4 max-w-7xl mx-auto">
          <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Latest from the Journal</h2>
              <p className="text-sm text-slate-500 mt-1">Insights, trends, and modern e-commerce stories</p>
            </div>
            <Link to="/blog" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors flex items-center gap-1 group">
              View All <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((post, idx) => (
              <motion.article 
                key={post._id || post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                <Link to={`/blog/${post.slug}`} className="block relative overflow-hidden aspect-[2/1]">
                  <img 
                    src={post.coverImage || undefined} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {post.category && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded text-[11px] font-semibold text-slate-800 uppercase tracking-wider">
                      {post.category}
                    </div>
                  )}
                </Link>
                
                <div className="p-5 flex flex-col flex-1">
                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                    <span className="text-xs font-medium text-slate-500">{post.author || 'Editorial'}</span>
                    <Link to={`/blog/${post.slug}`} className="text-primary hover:text-primary/80 transition-colors">
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {/* Trust Badges */}
      <section className="py-20 max-w-7xl mx-auto px-4 border-t border-slate-100 mt-20">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Shop With Us?</h2>
          <p className="text-slate-500 max-w-2xl">We are dedicated to providing you with the best experience possible.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <Truck size={36} className="text-primary"/>, title: "Free Delivery", desc: "Free shipping over ৳5000" },
            { icon: <RotateCcw size={36} className="text-secondary"/>, title: "Free Return", desc: "Free return over ৳5000" },
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
