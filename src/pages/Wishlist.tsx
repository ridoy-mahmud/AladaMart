import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/useCartStore';

export default function Wishlist() {
  const { user } = useAuth();
  const { addItem } = useCartStore();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`/api/wishlist/user/${user?.uid}`);
      const data = await res.json();
      setWishlistItems(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load wishlist.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.uid, productId })
      });
      setWishlistItems(prev => prev.filter(p => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove.');
    }
  };

  if (loading) {
     return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">Loading wishlist...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Wishlist</h1>
      
      {!user ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
           <h2 className="text-2xl font-bold text-slate-900 mb-3">Please log in</h2>
           <p className="text-slate-500 mb-8">You need to log in to view and save products to your wishlist.</p>
           <Link to="/login?redirect=/account/wishlist" className="bg-primary text-white font-medium py-3 px-8 rounded-full">Log In</Link>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Heart size={40} className="text-primary fill-primary" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-8 max-w-md">Browse our categories and discover our best deals and products. Add them to your wishlist to keep track!</p>
          <Link to="/shop" className="bg-slate-900 text-white font-medium py-3 px-8 rounded-full hover:bg-primary transition-colors shadow-md">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map(item => (
             <div key={item._id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col group hover:shadow-md transition-all">
                <div className="relative aspect-square mb-4 bg-slate-50 rounded-xl overflow-hidden">
                   <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
                   <button onClick={() => removeFromWishlist(item._id)} className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-red-500 hover:bg-red-50 transition-colors">
                      <Heart size={16} fill="currentColor" />
                   </button>
                </div>
                <Link to={`/product/${item.slug}`} className="font-bold text-slate-900 hover:text-primary transition-colors line-clamp-1 mb-1">{item.title}</Link>
                <p className="text-primary font-bold text-lg mb-4">${item.price}</p>
                <button 
                  onClick={() => {
                     addItem({
                        _id: item._id,
                        title: item.title,
                        price: item.price,
                        thumbnail: item.thumbnail,
                        quantity: 1
                     });
                     toast.success('Added to cart');
                  }} 
                  className="mt-auto w-full py-2.5 rounded-lg border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                   <ShoppingCart size={18} /> Add to Cart
                </button>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
