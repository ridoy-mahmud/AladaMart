import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, Package2, Phone, ChevronDown, LogOut, Smartphone, Laptop, Tablet, Headphones, Watch, Monitor, Camera, Speaker, Search, LayoutDashboard } from 'lucide-react';
import Logo from '../Logo';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const cartItemsCount = useCartStore(state => state.items.reduce((total, item) => total + item.quantity, 0));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const fetchSearch = async () => {
        try {
          const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}&limit=5`);
          const data = await res.json();
          setSearchResults(data.products || []);
          setIsSearchOpen(true);
        } catch (err) {
          console.error(err);
        }
      };
      // Debounce slightly
      const timer = setTimeout(fetchSearch, 300);
      return () => clearTimeout(timer);
    } else {
        setSearchResults([]);
        setIsSearchOpen(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Failed to log out');
    }
  };

  const NavLinks = () => {
    const isActive = (path: string) => location.pathname === path;
    const linkClass = (path: string) => `text-[15px] transition-colors pb-1 ${isActive(path) ? 'font-bold text-green-700 border-b-2 border-green-700' : 'font-medium text-slate-700 hover:text-green-700'}`;
    
    return (
      <>
        <Link to="/" className={linkClass('/')}>Home</Link>
        <Link to="/shop" className={linkClass('/shop')}>Shop</Link>
        <Link to="/blog" className={linkClass('/blog')}>Blog</Link>
        <Link to="/deal" className={linkClass('/deal')}>Hot Deal</Link>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md">
      
      {/* Main Header */}
      <div className="w-full sm:w-[95%] md:w-[90%] lg:w-[85%] mx-auto px-4 sm:px-0 py-4 sm:py-5 flex items-center justify-between gap-4 lg:gap-8 bg-transparent">
        
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <Logo />
        </Link>

        {/* Navigation & Search (Desktop) */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-start ml-12 lg:ml-20 max-w-3xl">
           <nav className="flex items-center gap-6 flex-shrink-0">
             <NavLinks />
           </nav>
           
           {/* Search */}
           <div className="relative flex-1 max-w-[240px] ml-4" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onFocus={() => { if(searchQuery.trim().length > 1) setIsSearchOpen(true); }}
                   placeholder="Search..." 
                   className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                 />
                 <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
                   <Search size={18} />
                 </button>
              </form>
              
              {/* Search Suggestions Dropdown */}
              <AnimatePresence>
                {isSearchOpen && searchResults.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 p-2 flex flex-col gap-1 max-h-[400px] overflow-y-auto"
                  >
                    <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Products</div>
                    {searchResults.map((product) => (
                       <Link 
                         key={product._id} 
                         to={`/product/${product.slug}`}
                         onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                         className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors"
                       >
                          <div className="w-10 h-10 bg-slate-50 rounded-md p-1 flex-shrink-0 border border-slate-100">
                             <img src={product.thumbnail} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <h5 className="text-sm font-medium text-slate-800 truncate">{product.title}</h5>
                             <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-bold text-slate-900">${(product.discount > 0 ? product.price : (product.originalPrice || product.price)).toFixed(2)}</span>
                                {product.discount > 0 && <span className="text-[10px] text-slate-400 line-through">${product.originalPrice?.toFixed(2)}</span>}
                             </div>
                          </div>
                       </Link>
                    ))}
                    <button 
                      onClick={handleSearchSubmit} 
                      className="mt-1 w-full py-2 text-sm text-center text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors border-t border-slate-100"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

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
                    {(user.email === 'mahamulhasan38@gmail.com' || user.email === 'ridoymahmud678@gmail.com') && (
                      <Link to="/admin/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    )}
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
            <Link to="/login" className="text-slate-700 hover:text-green-700 transition-colors hidden sm:flex flex-col items-center gap-1 group">
              <User size={28} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
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
               <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                 <Logo />
               </Link>
               <button onClick={() => setIsMobileMenuOpen(false)} className="bg-white p-1 rounded-md shadow-sm text-slate-600"><X size={24} /></button>
            </div>
            
            <div className="p-4 border-b border-slate-100">
               <form onSubmit={(e) => { handleSearchSubmit(e); setIsMobileMenuOpen(false); }} className="relative w-full">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..." 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-full py-3 pl-4 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
                    <Search size={20} />
                  </button>
               </form>
            </div>
            
            <nav className="flex flex-col border-b">
               {[
                 {name: "Home", path: "/"},
                 {name: "Hot Deals", path: "/deal"},
                 {name: "Shop", path: "/shop"},
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
