import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronRight } from 'lucide-react';

export default function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'paynow'>('cod');
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

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      window.scrollTo(0, 0);
      return;
    }
    // Simulate API call
    setTimeout(() => {
      clearCart();
      toast.success('Your order has been placed successfully!');
      navigate('/');
    }, 1500);
  };

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
