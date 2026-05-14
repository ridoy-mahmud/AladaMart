import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '',
    cardName: '', cardNumber: '', exp: '', cvv: ''
  });

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="mb-8">Please add items to your cart before checking out.</p>
        <Link to="/shop" className="bg-primary px-8 py-3 rounded-lg text-white font-medium">Return to Shop</Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      clearCart();
      toast.success('Your order has been placed successfully!');
      navigate('/');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:py-16">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
               <h2 className="text-xl font-bold mb-6 text-slate-800">Billing Information</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                    <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ZIP / Postal Code</label>
                    <input required type="text" name="zip" value={formData.zip} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
               <h2 className="text-xl font-bold mb-6 text-slate-800">Payment Method</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name on Card</label>
                    <input required type="text" name="cardName" value={formData.cardName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                    <input required type="text" name="cardNumber" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiration Date</label>
                    <input required type="text" name="exp" placeholder="MM/YY" value={formData.exp} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                    <input required type="text" name="cvv" placeholder="123" value={formData.cvv} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
               </div>
            </div>
          </form>
        </div>
        
        <div>
           <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-slate-900 border-b pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                 {items.map(item => (
                   <div key={item._id} className="flex items-center gap-4">
                     <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-contain rounded bg-slate-50 p-1" />
                     <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                     </div>
                     <p className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                   </div>
                 ))}
              </div>
              
              <div className="border-t border-slate-100 pt-4 mb-6 space-y-3">
                 <div className="flex justify-between text-slate-600">
                   <span>Subtotal</span>
                   <span className="font-medium text-slate-900">${total().toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-slate-600">
                   <span>Shipping estimate</span>
                   <span className="font-medium text-slate-900">$0.00</span>
                 </div>
                 <div className="flex justify-between text-slate-600">
                   <span>Taxes</span>
                   <span className="font-medium text-slate-900">${(total() * 0.05).toFixed(2)}</span>
                 </div>
              </div>
              
              <div className="border-t border-slate-100 pt-4 mb-6 flex justify-between items-center">
                 <span className="text-lg font-bold text-slate-900">Total</span>
                 <span className="text-2xl font-bold text-primary">${(total() * 1.05).toFixed(2)}</span>
              </div>
              
              <button form="checkout-form" type="submit" className="w-full flex items-center justify-center bg-primary hover:bg-primary-dark transition-colors px-6 py-4 rounded-xl text-white font-bold shadow-lg shadow-primary/20 text-lg">
                 Place Order
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
