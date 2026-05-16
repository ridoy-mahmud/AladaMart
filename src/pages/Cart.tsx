import React from 'react';
import { useCartStore } from '../store/useCartStore';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCartStore();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mb-6 text-primary">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-slate-900">Your cart is empty</h1>
        <p className="text-slate-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Browse our products to find something you'll love.</p>
        <Link to="/shop" className="bg-primary hover:bg-primary-dark transition-colors px-8 py-3 rounded-lg text-white font-medium shadow-md">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-slate-900 tracking-tight">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => {
             const uniqueId = (item as any).cartItemId || item._id;
             return (
               <div key={uniqueId} className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-xl shadow-sm border border-slate-100 relative">
                 <img src={item.thumbnail || undefined} alt={item.title} className="w-24 h-24 object-contain rounded-md bg-slate-50" />
                 <div className="flex-1 text-center sm:text-left">
                    <Link to={`/product/${item._id}`} className="font-semibold text-lg hover:text-primary transition-colors text-slate-900">{item.title}</Link>
                    {(item.color || item.size) && (
                      <p className="text-sm text-slate-500 mt-0.5 space-x-2">
                        {item.color && <span>Color: <span className="font-medium text-slate-700">{item.color}</span></span>}
                        {item.size && <span>Size: <span className="font-medium text-slate-700">{item.size}</span></span>}
                      </p>
                    )}
                    <p className="text-primary font-bold mt-1">${item.price.toFixed(2)}</p>
                 </div>
                 
                 <div className="flex items-center gap-3 bg-white rounded-lg p-1 border border-slate-200">
                   <button onClick={() => updateQuantity(uniqueId, item.quantity - 1)} className="p-1 hover:bg-slate-50 rounded transition-colors text-slate-600"><Minus size={18} /></button>
                   <span className="w-8 text-center font-medium text-slate-900">{item.quantity}</span>
                   <button onClick={() => updateQuantity(uniqueId, item.quantity + 1)} className="p-1 hover:bg-slate-50 rounded transition-colors text-slate-600"><Plus size={18} /></button>
                 </div>
                 
                 <div className="font-bold text-lg w-24 text-right hidden sm:block text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                 </div>

                 <button onClick={() => removeItem(uniqueId)} className="absolute top-4 right-4 text-slate-400 hover:text-danger transition-colors p-2 sm:p-0 sm:relative sm:top-auto sm:right-auto">
                   <Trash2 size={20} />
                 </button>
               </div>
             );
          })}
        </div>
        
        <div>
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-slate-900 border-b pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                 <div className="flex justify-between text-slate-600">
                   <span>Subtotal</span>
                   <span className="font-medium text-slate-900">${total().toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-slate-600">
                   <span>Shipping estimate</span>
                   <span className="font-medium text-slate-900">Calculated at checkout</span>
                 </div>
              </div>
              
              <div className="border-t border-slate-100 pt-4 mb-6 flex justify-between items-center">
                 <span className="text-lg font-bold text-slate-900">Total</span>
                 <span className="text-2xl font-bold text-primary">${total().toFixed(2)}</span>
              </div>
              
              <button 
                onClick={() => {
                  if (user) {
                    navigate('/checkout');
                  } else {
                    navigate('/login?redirect=/checkout');
                  }
                }}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark transition-colors px-6 py-4 rounded-lg text-white font-medium shadow-md shadow-primary/20 text-lg"
              >
                 Proceed to Checkout <ArrowRight size={20} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
