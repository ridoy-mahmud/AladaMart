import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';

export default function Wishlist() {
  // In a real app we'd use a store to get the wishlist items
  const wishlistItems: any[] = [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map(item => (
             <div key={item._id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <p>Placeholder for Wishlist Item</p>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
