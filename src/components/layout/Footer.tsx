import React from 'react';
import { Package2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Newsletter Section */}
        <div className="bg-primary/10 rounded-3xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="md:w-1/2">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Subscribe to our Newsletter</h3>
              <p className="text-slate-400">Get the latest updates on new products and upcoming sales.</p>
           </div>
           <div className="w-full md:w-1/2 relative">
             <input type="email" placeholder="Enter your email address" className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-full py-4 pl-6 pr-32 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
             <button className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary-dark transition-colors text-white font-medium rounded-full px-6 flex items-center gap-2">
               Subscribe <ArrowRight size={18} />
             </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          
          <div className="lg:pr-8">
            <Link to="/" className="flex items-center gap-2 mb-6 inline-flex">
              <Package2 size={28} className="text-primary"/>
              <span className="text-2xl font-bold text-white tracking-tight">Shop<span className="text-primary">Mart</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-8">
              Your ultimate destination for premium quality tech products, accessories, and electronics. 
              We provide the best shopping experience with secure payments and fast delivery.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Twitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Youtube size={18} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-6 tracking-wide">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> About Us</Link></li>
              <li><Link to="/shop" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Shop</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> FAQs</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Blog</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-6 tracking-wide">Customer Service</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/account" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> My Account</Link></li>
              <li><Link to="/track-order" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Track Order</Link></li>
              <li><Link to="/return-policy" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Returns & Refunds</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Shipping Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-6 tracking-wide">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-primary"/>
                 </div>
                 <span className="mt-1.5">123 Tech Avenue, Silicon Valley, CA 94025, United States</span>
              </li>
              <li className="flex gap-3 items-center">
                 <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-primary"/>
                 </div>
                 <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex gap-3 items-center">
                 <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-primary"/>
                 </div>
                 <span>support@shopmart.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© {new Date().getFullYear()} ShopMart. All rights reserved.</p>
          <div className="flex gap-2">
             <div className="px-3 py-1.5 bg-slate-800 rounded text-xs font-semibold text-white tracking-wider">VISA</div>
             <div className="px-3 py-1.5 bg-slate-800 rounded text-xs font-semibold text-white tracking-wider">MASTERCARD</div>
             <div className="px-3 py-1.5 bg-slate-800 rounded text-xs font-semibold text-white tracking-wider">PAYPAL</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
