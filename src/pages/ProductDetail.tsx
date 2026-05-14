import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Truck, ShieldCheck, RotateCcw, Minus, Plus, ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
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
  const [activeTab, setActiveTab] = useState('description');
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchProd = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if(res.ok) {
          const data = await res.json();
          setProduct(data);
          
          // fetch related
          if (data.categoryId || true) {
             const relRes = await fetch(`/api/products?limit=5`); 
             if (relRes.ok) {
                const relData = await relRes.json();
                setRelatedProducts((relData.docs || relData).filter((p:any) => p._id !== data._id).slice(0, 4));
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
      quantity
    });
    toast.success(`${quantity} ${product.title} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-slate-500 mb-8 gap-2">
         <Link to="/" className="hover:text-primary transition-colors">Home</Link>
         <span>/</span>
         <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
         <span>/</span>
         <span className="text-slate-900 font-medium truncate">{product.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 mb-16">
        {/* Image Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
           {/* Main Image */}
           <div className="aspect-[4/3] lg:aspect-square bg-slate-50 rounded-2xl flex items-center justify-center p-8 border border-slate-100 overflow-hidden relative shadow-sm">
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-black text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                   {product.discount}% OFF
                </div>
              )}
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={images[activeImage]} 
                alt={product.title} 
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" 
              />
           </div>
           
           {/* Thumbs */}
           {images.length > 1 && (
             <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
               {images.map((img: string, idx: number) => (
                 <button 
                   key={idx}
                   onClick={() => setActiveImage(idx)}
                   className={`w-20 h-20 rounded-xl border-2 flex-shrink-0 bg-white p-2 transition-all ${activeImage === idx ? 'border-primary shadow-md' : 'border-slate-100 hover:border-slate-300'}`}
                 >
                   <img src={img} className="w-full h-full object-contain" alt="Thumb" />
                 </button>
               ))}
             </div>
           )}
        </div>

        {/* Details */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="mb-2 text-sm text-primary font-medium tracking-wide uppercase">{product.brandName || product.categoryName}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">{product.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={18} className={s <= Math.round(product.rating || 0) ? "fill-secondary text-secondary" : "text-slate-300"} />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-700">{product.rating || "0.0"} Rating</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-sm text-slate-500 hover:text-primary transition-colors cursor-pointer">{product.reviewCount || 0} Reviews</span>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-bold text-slate-900">${currentPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="text-xl text-slate-400 line-through mb-1">${product.originalPrice?.toFixed(2)}</span>
            )}
          </div>

          <p className="text-slate-600 mb-8 leading-relaxed text-lg">
            {product.shortDescription || product.description}
          </p>

          <hr className="border-slate-100 mb-8"/>

          {/* Variants */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold text-sm text-slate-900 mb-3 uppercase tracking-wider">Color</h3>
              <div className="flex gap-3">
                {product.colors.map((c: any, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedColor(i)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor === i ? 'border-primary ring-2 ring-primary/30 ring-offset-1' : 'border-slate-200'}`}
                    title={c.name}
                  >
                    <span className="w-8 h-8 rounded-full shadow-inner" style={{ backgroundColor: c.hex }}></span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex items-center justify-between border-2 border-slate-200 rounded-xl w-full sm:w-36 overflow-hidden bg-white">
               <button 
                 className="p-3 hover:bg-slate-100 text-slate-600 transition-colors"
                 onClick={() => setQuantity(q => Math.max(1, q - 1))}
               >
                 <Minus size={20}/>
               </button>
               <span className="font-bold text-lg text-slate-900 w-12 text-center">{quantity}</span>
               <button 
                 className="p-3 hover:bg-slate-100 text-slate-600 transition-colors"
                 onClick={() => setQuantity(q => q + 1)}
               >
                 <Plus size={20}/>
               </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary hover:bg-primary-dark transition-colors text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 py-4 shadow-xl shadow-primary/20"
            >
              <ShoppingCart size={22} /> Add to Cart
            </button>
            <button className="p-4 border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 hover:text-danger hover:border-danger hidden sm:block">
              <Heart size={24} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <div className="flex items-start gap-3">
               <Truck className="text-primary mt-0.5" size={24}/>
               <div>
                 <h4 className="font-bold text-slate-900 text-sm">Free Delivery</h4>
                 <p className="text-xs text-slate-500 mt-0.5">Enter postal code for Delivery Availability</p>
               </div>
             </div>
             <div className="flex items-start gap-3">
               <RotateCcw className="text-primary mt-0.5" size={24}/>
               <div>
                 <h4 className="font-bold text-slate-900 text-sm">Return Delivery</h4>
                 <p className="text-xs text-slate-500 mt-0.5">Free 30 Days Delivery Returns.</p>
               </div>
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
