import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Truck, ShieldCheck, RotateCcw, Minus, Plus, ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);

  const colors = product?.colors || [
    { name: 'Black', hex: '#1a1a1a' },
    { name: 'Silver', hex: '#e2e8f0' },
    { name: 'Blue', hex: '#3b82f6' }
  ];
  const sizes = product?.sizes || ['S', 'M', 'L'];
  
  const [activeTab, setActiveTab] = useState('description');
  const addItem = useCartStore(state => state.addItem);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProd = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if(res.ok) {
          const data = await res.json();
          setProduct(data);
          
          if (user?.uid) {
             fetch(`/api/wishlist/user/${user.uid}`)
               .then(r => r.json())
               .then(items => {
                  setIsWishlisted(items.some((item: any) => item._id === data._id));
               });
          }
          
          // fetch related
          if (data.categoryId || true) {
             const relRes = await fetch(`/api/products?limit=5`); 
             if (relRes.ok) {
                const relData = await relRes.json();
                const items = Array.isArray(relData) ? relData : (relData?.docs || []);
                setRelatedProducts(items.filter((p:any) => p._id !== data._id).slice(0, 4));
             }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProd();
  }, [slug]);

  if (loading) {
     return (
        <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
     )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/shop" className="text-primary hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const images = [product.thumbnail, ...(product.images?.map((i:any)=>i.url) || [])].filter((url, i, self) => self.indexOf(url) === i);
  const currentPrice = product.discount > 0 ? product.price : product.originalPrice || product.price;

  const handleAddToCart = () => {
    addItem({
      _id: product._id,
      title: product.title,
      price: currentPrice,
      thumbnail: product.thumbnail,
      quantity,
      color: colors[selectedColor]?.name,
      size: sizes[selectedSize]
    });
    toast.success(`${quantity} ${product.title} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-slate-500 mb-8 gap-2">
         <Link to="/" className="hover:text-primary transition-colors">Home</Link>
         <span>/</span>
         <Link to="/shop" className="hover:text-primary transition-colors">Products</Link>
         <span>/</span>
         <span className="text-slate-900 font-medium truncate">{product.categoryName || 'Watch'}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 xl:gap-20 mb-16">
        {/* Image Gallery */}
        <div className="w-full lg:w-[42%] flex flex-row gap-5 h-[400px] xl:h-[480px]">
           {/* Thumbs */}
           <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar w-[88px] flex-shrink-0">
             {images.slice(0, 4).map((img: string, idx: number) => (
               <button 
                 key={idx}
                 onClick={() => setActiveImage(idx)}
                 className={`w-[88px] h-[88px] rounded-xl overflow-hidden flex items-center justify-center transition-all flex-shrink-0 ${activeImage === idx ? 'bg-[#f4f6f8] ring-1 ring-slate-200' : 'bg-[#f4f6f8] hover:bg-[#e2e8f0]'}`}
               >
                 <img src={img || undefined} className="w-[60%] h-[60%] object-contain mix-blend-darken drop-shadow-sm" alt="Thumb" />
               </button>
             ))}
           </div>

           {/* Main Image */}
           <div className="flex-1 bg-[#f4f6f8] rounded-2xl flex items-center justify-center p-8 xl:p-12 overflow-hidden relative border border-transparent">
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                   {product.discount}% OFF
                </div>
              )}
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={images[activeImage] || undefined} 
                alt={product.title} 
                className="w-full h-full object-contain mix-blend-darken drop-shadow-lg" 
              />
           </div>
        </div>

        {/* Details */}
        <div className="w-full lg:flex-1 flex flex-col pt-1">
          <h1 className="text-3xl md:text-[34px] font-bold text-[#1a202c] mb-2 leading-tight">{product.title}</h1>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-[2px]">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={15} className={s <= Math.round(product.rating || 0) ? "fill-[#00b252] text-[#00b252]" : "text-slate-200 fill-slate-200"} />
              ))}
            </div>
            <span className="text-[14px] text-slate-500 hover:text-[#00b252] transition-colors cursor-pointer">{product.reviewCount || 12} Reviews</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
             <span className="text-[#1a202c] text-[28px] font-extrabold">৳{currentPrice.toFixed(0)}</span>
             {product.discount > 0 && (
               <span className="text-[18px] text-slate-400 font-bold line-through">৳{product.originalPrice?.toFixed(0)}</span>
             )}
          </div>

          <div className="flex items-center gap-2 text-[#5c6e82] text-[15px] mb-8 pb-1">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
             <span>Save {product.discount > 0 ? product.discount : 84}% right now</span>
          </div>

          {/* Variants Selection */}
          <div className="mb-8 space-y-5">
            {colors && colors.length > 0 && (
              <div>
                <h4 className="text-[15px] font-bold text-slate-900 mb-3">Color: <span className="text-slate-500 font-medium ml-1">{colors[selectedColor]?.name}</span></h4>
                <div className="flex gap-3">
                  {colors.map((color: any, i: number) => (
                    <button
                      key={i}
                      onClick={(e) => { e.preventDefault(); setSelectedColor(i); }}
                      className={`w-10 h-10 rounded-full border-2 focus:outline-none transition-all ${selectedColor === i ? 'border-[#00b252] scale-110 shadow-md' : 'border-slate-200 hover:scale-105 shadow-sm'}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {sizes && sizes.length > 0 && (
              <div>
                <h4 className="text-[15px] font-bold text-slate-900 mb-3">Size: <span className="text-slate-500 font-medium ml-1">{sizes[selectedSize]}</span></h4>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size: string, i: number) => (
                    <button
                      key={i}
                      onClick={(e) => { e.preventDefault(); setSelectedSize(i); }}
                      className={`min-w-12 h-11 px-4 rounded-lg border font-bold focus:outline-none transition-all flex items-center justify-center text-[15px] ${selectedSize === i ? 'border-[#00b252] bg-[#f0fdf4] text-[#00b252] ring-1 ring-[#00b252]' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto">
            <div className="flex items-center justify-between border border-slate-200 rounded-lg px-2 h-[52px] sm:w-[130px] bg-white">
               <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-500 hover:text-black hover:bg-slate-50 rounded transition-colors"
               >
                 <Minus size={18} />
               </button>
               <span className="font-bold text-slate-900 w-8 text-center select-none">{quantity}</span>
               <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-500 hover:text-black hover:bg-slate-50 rounded transition-colors"
               >
                 <Plus size={18} />
               </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="bg-[#1e293b] hover:bg-black transition-colors text-white font-medium text-[15px] rounded-lg w-full sm:w-auto sm:px-12 flex items-center justify-center h-[52px] shadow-sm flex-1"
            >
              Add to Cart
            </button>

            <button 
              onClick={async () => {
                 if (!user?.uid) {
                    toast.error('Please login to wishlist products');
                    return;
                 }
                 try {
                    const res = await fetch('/api/wishlist/toggle', {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify({ userId: user.uid, productId: product._id })
                    });
                    const data = await res.json();
                    if (data.added) {
                       setIsWishlisted(true);
                       toast.success('Added to wishlist');
                    } else if (data.removed) {
                       setIsWishlisted(false);
                       toast.success('Removed from wishlist');
                    }
                 } catch (err) {
                    toast.error('Failed to update wishlist');
                 }
              }}
              className={`flex items-center justify-center h-[52px] w-[52px] rounded-lg border-2 transition-colors flex-shrink-0 ${isWishlisted ? 'border-primary text-primary bg-primary/5' : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}
              title="Add to Wishlist"
            >
              <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-primary' : ''} />
            </button>
          </div>

          <hr className="border-slate-200 mb-8"/>

          {/* Features - Icon List */}
          <div className="flex flex-col gap-4 text-[#5c6e82]">
             <div className="flex items-center gap-3">
               <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>
               <span className="text-[15px]">Free shipping worldwide</span>
             </div>
             <div className="flex items-center gap-3">
               <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
               <span className="text-[15px]">100% Secured Payment</span>
             </div>
             <div className="flex items-center gap-3">
               <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
               <span className="text-[15px]">Trusted by top brands</span>
             </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
         <div className="flex border-b border-slate-200 gap-8 mb-8 overflow-x-auto scrollbar-hide">
            <button 
              className={`pb-4 text-sm sm:text-base font-bold tracking-wide transition-colors relative whitespace-nowrap ${activeTab === 'description' ? 'text-primary' : 'text-slate-500 hover:text-slate-900'}`}
              onClick={() => setActiveTab('description')}
            >
               Description
               {activeTab === 'description' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
            <button 
              className={`pb-4 text-sm sm:text-base font-bold tracking-wide transition-colors relative whitespace-nowrap ${activeTab === 'reviews' ? 'text-primary' : 'text-slate-500 hover:text-slate-900'}`}
              onClick={() => setActiveTab('reviews')}
            >
               Reviews ({product.reviewCount || 0})
               {activeTab === 'reviews' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
         </div>

         <div>
            {activeTab === 'description' && (
               <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed text-lg">{product.description}</p>
                  <br />
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Product Specifications</h3>
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-slate-600">
                     <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Premium Build Quality</li>
                     <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Extended Warranty Available</li>
                     <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Free Returns within 30 days</li>
                     <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> 24/7 Customer Support</li>
                  </ul>
               </motion.div>
            )}
            
            {activeTab === 'reviews' && (
               <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                  {product.reviewCount > 0 ? (
                     <div className="space-y-6">
                        {/* Mock Review */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                           <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-12 h-12 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center">JD</div>
                                 <div>
                                    <h4 className="font-bold text-slate-900">John Doe</h4>
                                    <span className="text-xs text-slate-400">2 days ago</span>
                                 </div>
                              </div>
                              <div className="flex gap-1">
                                 {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-secondary text-secondary" />)}
                              </div>
                           </div>
                           <p className="text-slate-600">Great product! Exactly as described. I have been using it for a week now and it has completely transformed my workflow. Highly recommended!</p>
                        </div>
                     </div>
                  ) : (
                     <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No Reviews Yet</h3>
                        <p className="text-slate-500 mb-6">Be the first to share your thoughts on this product.</p>
                        <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all">Write a Review</button>
                     </div>
                  )}
               </motion.div>
            )}
         </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
         <div className="border-t border-slate-100 pt-16">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Related Products</h2>
               <Link to="/shop" className="text-primary font-medium hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
               {relatedProducts.map((p, i) => (
                  <ProductCard key={p._id} product={p} idx={i} />
               ))}
            </div>
         </div>
      )}

    </div>
  );
}
