import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, Package2, Phone, ChevronDown, LogOut, Smartphone, Laptop, Tablet, Headphones, Watch, Monitor, Camera, Speaker } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/useCartStore';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// A mapping to get a nice icon for categories, fallback is Package2
const categoryIcons: Record<string, React.ReactNode> = {
  'smartphones': <Smartphone size={24} className="text-blue-500" />,
  'laptops': <Laptop size={24} className="text-indigo-500" />,
  'tablets': <Tablet size={24} className="text-purple-500" />,
  'accessories': <Headphones size={24} className="text-pink-500" />,
  'smartwatches': <Watch size={24} className="text-orange-500" />,
  'monitors': <Monitor size={24} className="text-teal-500" />,
  'cameras': <Camera size={24} className="text-emerald-500" />,
  'audio': <Speaker size={24} className="text-red-500" />,
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const cartItemsCount = useCartStore(state => state.items.reduce((total, item) => total + item.quantity, 0));
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Failed to log out');
    }
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="text-sm font-medium text-slate-900 hover:text-primary transition-colors">Home</Link>
      <Link to="/deal" className="text-sm border border-red-200 bg-red-50 text-red-600 rounded-full px-3 py-1 font-bold hover:bg-red-100 transition-colors">Hot Deals!</Link>
      <Link to="/shop" className="text-sm font-medium text-slate-900 hover:text-primary transition-colors">Shop</Link>
      <Link to="/about" className="text-sm font-medium text-slate-900 hover:text-primary transition-colors">About</Link>
      <Link to="/contact" className="text-sm font-medium text-slate-900 hover:text-primary transition-colors">Contact</Link>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#1e293b] text-slate-300 text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone size={14} /> +1 234 567 890</span>
            <span className="hidden lg:inline">Free shipping on all orders over $200!</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-white transition-colors flex items-center gap-1">English <ChevronDown size={14}/></button>
            <button className="hover:text-white transition-colors flex items-center gap-1">USD <ChevronDown size={14}/></button>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between gap-4 lg:gap-8 bg-white border-b border-slate-100">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-primary text-white p-1.5 rounded-lg">
            <Package2 size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">Shop<span className="text-primary">Mart</span></span>
        </Link>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5 sm:gap-6 flex-shrink-0">
          {user ? (
            <div className="relative group hidden sm:block">
               <button className="flex items-center gap-2 text-slate-700 hover:text-primary transition-colors">
                  <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="avatar" className="w-8 h-8 rounded-full border border-slate-200" />
               </button>
               <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900 truncate">{user.displayName || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link to="/account/wishlist" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                      <Heart size={16} /> Wishlist
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
               </div>
            </div>
          ) : (
            <Link to="/login" className="text-slate-700 hover:text-primary transition-colors hidden sm:flex flex-col items-center gap-1 group">
              <User size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
            </Link>
          )}

          <Link to="/cart" className="relative text-slate-700 hover:text-primary transition-colors flex items-center gap-2 group">
            <div className="relative">
              <ShoppingCart size={28} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-danger text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <div className="hidden lg:block text-sm font-medium">Cart</div>
          </Link>

          {/* Mobile menu trigger */}
          <button className="md:hidden text-slate-900" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white flex flex-col overflow-y-auto"
          >
            <div className="p-4 bg-slate-100 flex items-center justify-between border-b">
               <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                 <Package2 size={24} className="text-primary"/>
                 <span className="text-xl font-bold">ShopMart</span>
               </Link>
               <button onClick={() => setIsMobileMenuOpen(false)} className="bg-white p-1 rounded-md shadow-sm text-slate-600"><X size={24} /></button>
            </div>
            
            <nav className="flex flex-col border-b">
               {[
                 {name: "Home", path: "/"},
                 {name: "Hot Deals", path: "/deal"},
                 {name: "Shop", path: "/shop"},
                 {name: "About Us", path: "/about"},
                 {name: "Contact", path: "/contact"},
               ].map((item, idx) => (
                 <Link 
                   key={idx} 
                   to={item.path} 
                   onClick={() => setIsMobileMenuOpen(false)} 
                   className="p-4 border-b border-slate-100 text-lg font-medium hover:bg-slate-50 flex justify-between items-center"
                 >
                   {item.name} <ChevronDown size={20} className="text-slate-400 rotate-[-90deg]"/>
                 </Link>
               ))}
               <div className="p-4">
                 <h4 className="font-semibold text-slate-400 text-sm uppercase tracking-wider mb-2">Categories</h4>
                 <div className="flex flex-col gap-2">
                    {categories.map((cat, i) => (
                       <Link key={i} to={`/shop?category=${cat.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-slate-700 font-medium">
                         {cat.name}
                       </Link>
                    ))}
                 </div>
               </div>
            </nav>

            <div className="p-6 grid grid-cols-1 gap-4 mt-auto">
               {user ? (
                 <>
                   <Link to="/account/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="bg-slate-100 text-slate-800 py-3 rounded-lg text-center font-medium shadow-sm">My Wishlist</Link>
                   <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="bg-red-50 text-red-600 py-3 rounded-lg text-center font-medium shadow-sm">Sign Out</button>
                 </>
               ) : (
                 <>
                   <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-slate-900 text-white py-3 rounded-lg text-center font-medium shadow-sm mb-2">Login</Link>
                   <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-primary text-white py-3 rounded-lg text-center font-medium shadow-sm">Register</Link>
                 </>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
