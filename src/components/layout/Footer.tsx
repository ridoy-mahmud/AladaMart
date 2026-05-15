import React from 'react';
import { Package2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowRight, Clock, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="w-full sm:w-[95%] md:w-[90%] lg:w-[85%] mx-auto px-4 sm:px-0 pt-10 pb-6">
        
        {/* Contact Info Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-slate-200 mb-8">
          <div className="flex items-center gap-3">
            <div className="text-slate-400 group-hover:text-green-600 transition-colors">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Visit Us</p>
              <p className="text-xs text-slate-500">New Orleans, USA</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-slate-400 group-hover:text-green-600 transition-colors">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Call Us</p>
              <p className="text-xs text-slate-500">+12 958 648 597</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-slate-400 group-hover:text-green-600 transition-colors">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Working Hours</p>
              <p className="text-xs text-slate-500">Mon - Sat: 10AM - 7PM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-slate-400 group-hover:text-green-600 transition-colors">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Email Us</p>
              <p className="text-xs text-slate-500">Shopcart@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          <div className="lg:pr-8">
            <Link to="/" className="flex items-center gap-2 mb-4 inline-flex group">
              <span className="text-2xl font-black tracking-tighter text-[#0b4d2c] uppercase group-hover:scale-105 transition-transform origin-left">Shopcar<span className="text-[#34a853]">t</span></span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Discover curated furniture collections at Shopcart, blending style and comfort to elevate your living spaces.
            </p>
            <div className="flex gap-2">
               <a href="#" className="w-9 h-9 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all hover:scale-110"><Youtube size={16} /></a>
               <a href="#" className="w-9 h-9 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all hover:scale-110"><Github size={16} /></a>
               <a href="#" className="w-9 h-9 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all hover:scale-110"><Linkedin size={16} /></a>
               <a href="#" className="w-9 h-9 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all hover:scale-110"><Facebook size={16} /></a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-green-700 hover:translate-x-1 transition-all inline-block">About us</Link></li>
              <li><Link to="/contact" className="hover:text-green-700 hover:translate-x-1 transition-all inline-block">Contact us</Link></li>
              <li><Link to="/terms" className="hover:text-green-700 hover:translate-x-1 transition-all inline-block">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-green-700 hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
              <li><Link to="/faq" className="hover:text-green-700 hover:translate-x-1 transition-all inline-block">FAQs</Link></li>
              <li><Link to="/help" className="hover:text-green-700 hover:translate-x-1 transition-all inline-block">Help</Link></li>
            </ul>
          </div>

        </div>
        
        {/* Copyright */}
        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
           <p>© {new Date().getFullYear()} <span className="font-bold text-slate-900 uppercase tracking-wide">Shopcart</span>. All rights reserved.</p>
           <div className="flex gap-4 mt-4 md:mt-0">
             <Link to="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
             <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
