import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 flex-shrink-0 group ${className}`}>
      <div className="relative flex items-center justify-center bg-gradient-to-br from-[#0b4d2c] to-[#34a853] p-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
        <ShoppingBag size={22} strokeWidth={2.5} className="text-white" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white"></span>
      </div>
      <span className="text-2xl font-black tracking-tighter text-[#0b4d2c] uppercase group-hover:text-[#34a853] transition-colors origin-left">
        Alada<span className="text-[#34a853] group-hover:text-[#0b4d2c] transition-colors">Mart</span>
      </span>
    </div>
  );
}
