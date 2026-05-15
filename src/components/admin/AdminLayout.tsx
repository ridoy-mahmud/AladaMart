import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Search, Bell, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user, signOut, loading } = useAuth();
  
  const allowedEmails = ['mahamulhasan38@gmail.com', 'ridoymahmud678@gmail.com'];
  if (!loading && (!user || !allowedEmails.includes(user.email || ''))) {
     return <Navigate to="/" replace />;
  }

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 flex-shrink-0">
          <Link to="/" className="flex items-center">
            <Logo className="scale-75 origin-left" />
          </Link>
          <span className="ml-2 text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded text-[10px]">ADMIN</span>
        </div>
        
        <div className="flex-1 py-6 flex flex-col gap-1 px-3 overflow-y-auto">
          {links.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === link.path ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200">
          <button onClick={signOut} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
           <div className="flex items-center gap-2 relative">
              <Search size={18} className="absolute left-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm w-64 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
           </div>

           <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-500 hover:text-primary transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}`} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-200" />
                <div className="text-sm">
                  <p className="font-bold text-slate-900 leading-none mb-0.5">{user?.displayName || 'Admin'}</p>
                  <p className="text-[11px] text-slate-500">{user?.email}</p>
                </div>
              </div>
           </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
}
