import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Eye, Heart, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product, idx = 0 }: { product: any, idx?: number, key?: any }) {
  const addItem = useCartStore(state => state.addItem);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const currentPrice = product.discount > 0 ? product.price : product.originalPrice || product.price;

  const colors = product.colors || [
    { name: 'Black', hex: '#1a1a1a' },
    { name: 'Silver', hex: '#e2e8f0' },
    { name: 'Blue', hex: '#3b82f6' }
  ];
  const sizes = product.sizes || ['S', 'M', 'L'];
  
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    // If not in quick view, open it to allow selection first
    if (!isQuickViewOpen && (colors.length > 0 || sizes.length > 0)) {
      setIsQuickViewOpen(true);
      return;
    }

    addItem({
       _id: product._id,
       title: product.title,
       price: currentPrice,
       thumbnail: product.thumbnail,
       quantity: 1,
       color: colors[selectedColor]?.name,
       size: sizes[selectedSize]
    });
    toast.success(`${product.title} added to cart!`);
    setIsQuickViewOpen(false);
  };

  return (
    <>
      <div 
      className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative border border-slate-200"
    >
      {product.discount > 0 && (
          <div className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            {product.discount}% OFF
          </div>
      )}

      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 px-1 py-1 -mr-1 -mt-1 pt-2">
         <button 
           onClick={(e) => { e.preventDefault(); setIsQuickViewOpen(true); }}
           className="translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out bg-white text-slate-800 hover:bg-primary hover:text-white p-2 rounded-full shadow-md hover:scale-110 active:scale-95"
           title="Quick View"
         >
           <Eye size={18} />
         </button>
         <button 
           onClick={(e) => { e.preventDefault(); toast.success('Added to wishlist!'); }}
           className="translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 delay-[50ms] ease-out bg-white text-slate-800 hover:text-danger p-2 rounded-full shadow-md hover:scale-110 active:scale-95"
           title="Add to Wishlist"
         >
           <Heart size={18} />
         </button>
      </div>
      
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden aspect-[4/3] p-6 bg-slate-50">
        <img src={product.thumbnail || undefined} alt={product.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
      </Link>
      
      <div className="p-4 sm:p-6 flex flex-col flex-1 bg-white">
        <div className="flex items-center gap-1 mb-2 sm:mb-3">
          {[1,2,3,4,5].map((star) => (
            <Star key={star} size={12} className={`sm:w-3.5 sm:h-3.5 ${star <= Math.round(product.rating || 0) ? "fill-secondary text-secondary" : "text-slate-300"}`} />
          ))}
          <span className="text-[10px] sm:text-xs text-slate-400 ml-1">({product.reviewCount || 0})</span>
        </div>
        
        <Link to={`/product/${product.slug}`} className="font-bold text-sm sm:text-base text-slate-900 leading-snug mb-3 sm:mb-4 hover:text-primary transition-colors line-clamp-2">
          {product.title}
        </Link>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-lg sm:text-xl text-slate-900">${currentPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="text-xs sm:text-sm text-slate-400 line-through">${product.originalPrice?.toFixed(2)}</span>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            className="opacity-80 group-hover:opacity-100 bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white p-2 sm:p-3 rounded-full transition-all duration-300 transform group-hover:scale-110 hover:-translate-y-1 active:scale-95 shadow-sm group-hover:shadow-md"
            title="Add to Cart"
          >
            <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
               onClick={() => setIsQuickViewOpen(false)}
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
             >
                <button onClick={() => setIsQuickViewOpen(false)} className="absolute top-4 right-4 z-10 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors">
                  <X size={20} />
                </button>
                
                <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center relative border-r border-slate-100">
                   {product.discount > 0 && (
                      <div className="absolute top-6 left-6 z-10 bg-danger text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                        {product.discount}% OFF
                      </div>
                   )}
                   <img src={product.thumbnail || undefined} alt={product.title} className="w-full h-full max-h-[300px] md:max-h-[400px] object-contain mix-blend-multiply" />
                </div>
                
                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto">
                   <div className="text-sm text-primary font-medium uppercase tracking-wide mb-2">{product.brandName || product.categoryName}</div>
                   <h2 className="text-2xl font-bold text-slate-900 mb-4">{product.title}</h2>
                   
                   <div className="flex items-center gap-1 mb-6">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} size={16} className={star <= Math.round(product.rating || 0) ? "fill-secondary text-secondary" : "text-slate-300"} />
                      ))}
                      <span className="text-sm font-medium text-slate-700 ml-2">{product.rating} Rating</span>
                   </div>

                   <p className="text-slate-600 mb-6 leading-relaxed flex-1 line-clamp-4">
                      {product.shortDescription || product.description}
                   </p>

                   {/* Variants Selection */}
                   <div className="mb-6 space-y-4">
                     {colors && colors.length > 0 && (
                       <div>
                         <h4 className="text-sm font-bold text-slate-900 mb-2">Color: <span className="text-slate-500 font-medium">{colors[selectedColor]?.name}</span></h4>
                         <div className="flex gap-2 relative z-20">
                           {colors.map((color: any, i: number) => (
                             <button
                               key={i}
                               onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedColor(i); }}
                               className={`w-8 h-8 rounded-full border-2 focus:outline-none transition-all ${selectedColor === i ? 'border-primary scale-110' : 'border-transparent shadow-sm hover:scale-105'}`}
                               style={{ backgroundColor: color.hex }}
                               title={color.name}
                             />
                           ))}
                         </div>
                       </div>
                     )}

                     {sizes && sizes.length > 0 && (
                       <div>
                         <h4 className="text-sm font-bold text-slate-900 mb-2">Size: <span className="text-slate-500 font-medium">{sizes[selectedSize]}</span></h4>
                         <div className="flex gap-2 relative z-20">
                           {sizes.map((size: string, i: number) => (
                             <button
                               key={i}
                               onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedSize(i); }}
                               className={`min-w-10 h-10 px-3 rounded-lg border font-medium focus:outline-none transition-all flex items-center justify-center text-sm ${selectedSize === i ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                             >
                               {size}
                             </button>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>
                   
                   <div className="flex items-end gap-3 mb-8">
                      <span className="text-3xl font-bold text-slate-900">${currentPrice.toFixed(2)}</span>
                      {product.discount > 0 && (
                        <span className="text-lg text-slate-400 line-through mb-1">${product.originalPrice?.toFixed(2)}</span>
                      )}
                   </div>
                   
                   <div className="flex gap-4 mt-auto">
                      <button 
                        onClick={() => handleAddToCart()}
                        className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                      >
                         <ShoppingCart size={20} /> Add to Cart
                      </button>
                      <Link 
                        to={`/product/${product.slug}`}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-4 rounded-xl transition-all flex items-center justify-center"
                      >
                         Full Details
                      </Link>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
