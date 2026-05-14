import React from 'react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">About ShopMart</h1>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">
            Founded in 2026, ShopMart is your go-to destination for the latest technology, gadgets, and home appliances. We passionately believe that high-quality technology should be accessible to everyone, everywhere. 
          </p>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Our mission is to empower you with products that simplify your life and fuel your ambitions. Working directly with top-tier brands, we ensure authenticity and deliver value directly to your doorstep.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
               <h3 className="text-3xl font-bold text-primary mb-2">10k+</h3>
               <p className="text-slate-700 font-medium">Happy Customers</p>
            </div>
            <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/10">
               <h3 className="text-3xl font-bold text-secondary mb-2">50+</h3>
               <p className="text-slate-700 font-medium">Top Brands</p>
            </div>
            <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200">
               <h3 className="text-3xl font-bold text-slate-800 mb-2">24/7</h3>
               <p className="text-slate-700 font-medium">Customer Support</p>
            </div>
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
               <h3 className="text-3xl font-bold text-emerald-600 mb-2">100%</h3>
               <p className="text-slate-700 font-medium">Secure Payment</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
           <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" alt="Team" className="rounded-3xl shadow-2xl object-cover w-full h-[600px]"/>
           <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-xl hidden lg:block max-w-sm">
             <div className="flex text-secondary mb-3">
               {[1,2,3,4,5].map(i => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
             </div>
             <p className="text-slate-700 italic">"ShopMart has completely changed how I buy electronics. The shipping is incredibly fast and their support team is amazing."</p>
             <p className="font-bold text-slate-900 mt-4">- Sarah J.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
