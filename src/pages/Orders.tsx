import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: any;
    if (user) {
      fetchOrders();
      interval = setInterval(() => {
        fetchOrders(true); // silent fetch
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user]);

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch(`/api/orders/user/${user?.uid}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      if (!silent) toast.error('Failed to load your orders.');
    } finally {
      if (!silent) setLoading(false);
    }
  }

  if (authLoading) return <div className="min-h-screen pt-24 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login?redirect=/orders" />;

  const statusColors: any = {
    'Completed': 'bg-green-100 text-green-700',
    'Processing': 'bg-blue-100 text-blue-700',
    'Pending': 'bg-amber-100 text-amber-700',
    'Shipped': 'bg-purple-100 text-purple-700',
    'Cancelled': 'bg-red-100 text-red-700',
    'Delivered': 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Order History</h1>
        <Link to="/profile" className="text-primary hover:underline font-medium">Back to Profile</Link>
      </div>

      {loading ? (
         <div className="text-center py-20 text-slate-500 text-lg">Loading your orders...</div>
      ) : orders.length === 0 ? (
         <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm max-w-2xl mx-auto">
           <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
           </svg>
           <h3 className="text-2xl font-bold mb-2 text-slate-800">No orders found</h3>
           <p className="text-slate-500 mb-6 text-lg">You haven't placed any orders with us yet.</p>
           <Link to="/shop" className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-[0.98]">Browse Products</Link>
         </div>
      ) : (
         <div className="space-y-6">
           {orders.map(order => (
             <div key={order._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
               <div className="border-b border-slate-100 bg-slate-50 p-4 md:p-6 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1 font-medium">Order Placed</p>
                    <p className="font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1 font-medium">Total</p>
                    <p className="font-bold text-slate-900">৳{(order.total || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1 font-medium">Order #</p>
                    <p className="font-bold text-slate-900">{order._id.substring(0,8).toUpperCase()}</p>
                  </div>
                  <div className="md:ml-auto text-right">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${statusColors[order.status] || 'bg-slate-100 text-slate-700'}`}>
                      {order.status}
                    </span>
                    {order.paymentMethod === 'cod' && (
                       <p className="text-xs text-slate-500 mt-2 font-medium">Cash on Delivery</p>
                    )}
                  </div>
               </div>
               
               <div className="p-4 md:p-6 divide-y divide-slate-100">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-6">
                      <div className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-2">
                        <img src={item.thumbnail || undefined} className="w-full h-full object-contain mix-blend-multiply" alt={item.title} />
                      </div>
                      <div className="flex-1">
                         <Link to={`/product/${item.slug || ''}`} className="font-bold text-lg text-slate-900 line-clamp-1 hover:text-primary transition-colors">{item.title}</Link>
                         <div className="flex gap-4 mt-1">
                           <p className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">Qty: {item.quantity}</p>
                           {item.selectedSize && <p className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">Size: {item.selectedSize}</p>}
                           {item.selectedColor && <p className="text-sm text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded font-medium">Color: <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.selectedColor }}></span></p>}
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="font-bold text-lg text-slate-900">
                           ৳{(item.price * item.quantity).toFixed(2)}
                         </div>
                      </div>
                    </div>
                  ))}
               </div>
             </div>
           ))}
         </div>
      )}
    </div>
  );
}
