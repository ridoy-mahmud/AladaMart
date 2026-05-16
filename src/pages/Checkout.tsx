import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'paynow'>('cod');
  const [shippingLocation, setShippingLocation] = useState<'dhaka' | 'outside' | null>(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '',
    cardName: '', cardNumber: '', exp: '', cvv: ''
  });

  useEffect(() => {
    const fetchBillingInfo = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(prev => ({ ...prev, ...docSnap.data() }));
        } else {
          setFormData(prev => ({ ...prev, email: user.email || '' }));
        }
      } catch (err) {
        console.error("Failed to fetch billing info", err);
      }
    };
    fetchBillingInfo();
  }, [user]);

  if (!user && step !== 3) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
        <p className="mb-8 text-slate-500">You need to log in to place an order and keep track of its status.</p>
        <Link to="/login?redirect=/checkout" className="bg-slate-900 px-8 py-3 rounded-lg text-white font-medium hover:bg-black transition-colors">Log In</Link>
      </div>
    );
  }

  if (items.length === 0 && step !== 3) {
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

  const handleNextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = document.getElementById('checkout-form') as HTMLFormElement;
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }
    window.scrollTo(0, 0);
    setStep(2);
  };

  const shippingCost = paymentMethod === 'cod' ? (shippingLocation === 'dhaka' ? 70 : (shippingLocation === 'outside' ? 140 : 0)) : 0;
  const taxes = total() * 0.05;
  const finalTotal = total() + taxes + shippingCost;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      window.scrollTo(0, 0);
      return;
    }
    
    if (paymentMethod === 'cod' && !shippingLocation) {
      toast.error('Please select a shipping location for Cash on Delivery.');
      return;
    }
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid || 'guest',
          items,
          total: finalTotal,
          billing: formData,
          paymentMethod,
          shippingLocation,
          shippingCost
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to place order.');
      }

      clearCart();
      toast.success('Your order has been placed successfully!');
      setStep(3); // Show success screen
      window.scrollTo(0, 0);
    } catch (err: any) {
      toast.error(err.message || 'Payment Unsuccessful. Please try again.');
    }
  };

  if (step === 3) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-slate-800">Order Successful!</h1>
        <p className="text-lg text-slate-600 mb-8 max-w-md">Thank you for your purchase. We have received your order and are currently processing it.</p>
        <div className="flex gap-4">
          <Link to="/orders" className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-8 py-3 rounded-xl font-bold transition-colors">View Order Status</Link>
          <Link to="/shop" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-colors">Buy More</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:py-16">
      <div className="flex items-center gap-2 mb-8 text-sm md:text-base">
        <span className={`font-bold ${step === 1 ? 'text-primary' : 'text-slate-500 cursor-pointer'}`} onClick={() => setStep(1)}>1. Billing Information</span>
        <ChevronRight size={16} className="text-slate-400" />
        <span className={`font-bold ${step === 2 ? 'text-primary' : 'text-slate-500'}`}>2. Payment Method</span>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
            {step === 1 ? (
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
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                      <input required type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
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
            ) : (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-right-4 duration-300">
                 <h2 className="text-xl font-bold mb-6 text-slate-800">Payment Method</h2>
                 <div className="space-y-4">
                    <label className={`block border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="cod" 
                          checked={paymentMethod === 'cod'} 
                          onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'paynow')}
                          className="w-5 h-5 text-primary focus:ring-primary border-slate-300"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">Cash on Delivery</p>
                          <p className="text-sm text-slate-500">Pay when you receive your order.</p>
                        </div>
                      </div>
                    </label>

                    {paymentMethod === 'cod' && (
                      <div className="pl-12 pr-4 pb-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                         <h4 className="text-sm font-semibold text-slate-700">Select Shipping Location</h4>
                         <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                           <input 
                              type="radio" 
                              name="shippingLocation" 
                              value="dhaka" 
                              checked={shippingLocation === 'dhaka'}
                              onChange={(e) => setShippingLocation(e.target.value as 'dhaka' | 'outside')}
                              className="w-4 h-4 text-primary focus:ring-primary"
                           />
                           <div className="flex-1 flex justify-between">
                              <span className="text-sm font-medium text-slate-800">Inside Dhaka</span>
                              <span className="text-sm font-bold text-slate-900">৳70</span>
                           </div>
                         </label>
                         <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                           <input 
                              type="radio" 
                              name="shippingLocation" 
                              value="outside" 
                              checked={shippingLocation === 'outside'}
                              onChange={(e) => setShippingLocation(e.target.value as 'dhaka' | 'outside')}
                              className="w-4 h-4 text-primary focus:ring-primary"
                           />
                           <div className="flex-1 flex justify-between">
                              <span className="text-sm font-medium text-slate-800">Outside Dhaka</span>
                              <span className="text-sm font-bold text-slate-900">৳140</span>
                           </div>
                         </label>
                      </div>
                    )}

                    <label className={`block border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'paynow' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="paynow" 
                          checked={paymentMethod === 'paynow'} 
                          onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'paynow')}
                          className="w-5 h-5 text-primary focus:ring-primary border-slate-300"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">Pay Now</p>
                          <p className="text-sm text-slate-500">Secure online payment with bKash.</p>
                        </div>
                      </div>
                    </label>
                    
                    {paymentMethod === 'paynow' && (
                      <div className="mt-4 p-5 rounded-xl border border-[#e2136e]/20 bg-[#e2136e]/5 relative overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                             <img src="https://freelogopng.com/images/all_img/1656234745bkash-app-logo-png.png" alt="bKash Logo" className="h-6 object-contain" />
                          </div>
                          <h3 className="font-bold text-[#e2136e] text-lg">Pay with bKash</h3>
                        </div>
                        <p className="text-sm text-slate-700">You will be redirected to the secure bKash payment portal to complete your order.</p>
                      </div>
                    )}
                 </div>
                 
                 <div className="mt-6 flex justify-start">
                    <button type="button" onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-900 font-medium">
                      ← Back to Billing
                    </button>
                 </div>
              </div>
            )}
          </form>
        </div>
        
        <div>
           <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-slate-900 border-b pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                 {items.map(item => (
                   <div key={item._id} className="flex items-center gap-4">
                     <img src={item.thumbnail || undefined} alt={item.title} className="w-16 h-16 object-contain rounded bg-slate-50 p-1" />
                     <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                     </div>
                     <p className="font-bold text-slate-900">৳{(item.price * item.quantity).toFixed(2)}</p>
                   </div>
                 ))}
              </div>
              
              <div className="border-t border-slate-100 pt-4 mb-6 space-y-3">
                 <div className="flex justify-between text-slate-600">
                   <span>Subtotal</span>
                   <span className="font-medium text-slate-900">৳{total().toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-slate-600">
                   <span>Tax (5%)</span>
                   <span className="font-medium text-slate-900">৳{taxes.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-slate-600">
                   <span>Shipping estimate</span>
                   <span className="font-medium text-slate-900">৳{shippingCost.toFixed(2)}</span>
                 </div>
              </div>
              
              <div className="border-t border-slate-100 pt-4 mb-6 flex justify-between items-center">
                 <span className="text-lg font-bold text-slate-900">Total</span>
                 <span className="text-2xl font-bold text-primary">৳{finalTotal.toFixed(2)}</span>
              </div>
              
              {step === 1 ? (
                <button type="button" onClick={handleNextStep} className="w-full flex items-center justify-center bg-slate-900 hover:bg-slate-800 transition-colors px-6 py-4 rounded-xl text-white font-bold shadow-lg text-lg">
                   Continue to Payment
                </button>
              ) : (
                <button form="checkout-form" type="submit" className="w-full flex items-center justify-center bg-primary hover:bg-primary-dark transition-colors px-6 py-4 rounded-xl text-white font-bold shadow-lg shadow-primary/20 text-lg">
                   Place Order
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
