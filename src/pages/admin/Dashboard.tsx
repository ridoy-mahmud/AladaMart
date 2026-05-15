import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { DollarSign, ShoppingBag, Users, TrendingUp, TrendingDown, Package, Activity, Loader } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const revenueData = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3000, orders: 139 },
  { name: 'Mar', revenue: 2000, orders: 980 },
  { name: 'Apr', revenue: 2780, orders: 390 },
  { name: 'May', revenue: 1890, orders: 480 },
  { name: 'Jun', revenue: 2390, orders: 380 },
  { name: 'Jul', revenue: 3490, orders: 430 },
  { name: 'Aug', revenue: 4000, orders: 240 },
  { name: 'Sep', revenue: 3000, orders: 139 },
  { name: 'Oct', revenue: 5000, orders: 980 },
  { name: 'Nov', revenue: 6780, orders: 1200 },
  { name: 'Dec', revenue: 8890, orders: 1300 },
];

const categoryData = [
  { name: 'Electronics', sales: 4000 },
  { name: 'Clothing', sales: 3000 },
  { name: 'Home & Garden', sales: 2000 },
  { name: 'Sports', sales: 2780 },
];

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, brands: 0, categories: 0 });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch real data for stats and recent products where possible
    const fetchDashboardData = async () => {
      try {
        const [prodRes, brandRes, catRes] = await Promise.all([
          fetch('/api/products?limit=5'),
          fetch('/api/brands'),
          fetch('/api/categories')
        ]);
        
        const prodData = await prodRes.json();
        const brandsData = await brandRes.json();
        const catData = await catRes.json();
        
        setStats({
           products: prodData.totalDocs || prodData.length || 0,
           brands: brandsData.length || 0,
           categories: catData.length || 0
        });

        if (Array.isArray(prodData) || prodData?.docs) {
           const items = Array.isArray(prodData) ? prodData : prodData.docs;
           setRecentProducts(items.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading && user) {
       fetchDashboardData();
    }
  }, [authLoading, user]);

  if (authLoading || loading) {
     return (
       <div className="flex h-screen w-full items-center justify-center bg-slate-50">
          <Loader size={32} className="animate-spin text-primary" />
       </div>
     )
  }

  const StatCard = ({ title, value, icon, trend, up }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 text-slate-700 rounded-xl">
           {icon}
        </div>
        <div className={`px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold ${up ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
          {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trend}
        </div>
      </div>
      <div>
        <h4 className="text-slate-500 text-sm font-medium mb-1">{title}</h4>
        <h2 className="text-3xl font-black text-slate-900">{value}</h2>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value="$45,231" icon={<DollarSign size={24} />} trend="12.5%" up={true} />
        <StatCard title="Total Orders" value="1,245" icon={<ShoppingBag size={24} />} trend="5.2%" up={true} />
        <StatCard title="Total Products" value={stats.products} icon={<Package size={24} />} trend="1.1%" up={true} />
        <StatCard title="Active Users" value="842" icon={<Users size={24} />} trend="2.4%" up={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-900">Revenue Analytics</h3>
             <select className="bg-slate-50 border-none text-sm font-medium rounded-lg text-slate-700 p-2 focus:ring-0">
               <option>This Year</option>
               <option>Last Year</option>
             </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00b252" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00b252" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0F172A' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#00b252" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
           <h3 className="text-lg font-bold text-slate-900 mb-6">Sales by Category</h3>
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#0F172A', fontSize: 13, fontWeight: 500}} width={100} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', padding: '8px' }} />
                <Bar dataKey="sales" fill="#0f172a" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders/Products Table */}
        <div className="bg-white rounded-2xl border border-slate-200 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white z-10">
            <h3 className="text-lg font-bold text-slate-900">Recent Products Activity</h3>
            <button className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentProducts.map((p, i) => (
                  <tr key={p._id || i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-slate-100 p-1 flex items-center justify-center border border-slate-200">
                           <img src={p.thumbnail} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                         </div>
                         <div className="min-w-0">
                           <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{p.title}</p>
                           <p className="text-xs text-slate-500">{p.brandName || 'Brand'}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="text-sm text-slate-600">{p.categoryName || 'Category'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="text-sm font-bold text-slate-900">${p.price?.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-md">In Stock</span>
                    </td>
                  </tr>
                ))}
                {recentProducts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
           <h3 className="text-lg font-bold text-slate-900 mb-6">System Health</h3>
           <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Activity size={16} className="text-primary" /> CPU Usage
                  </div>
                  <span className="text-sm font-bold text-slate-900">42%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Activity size={16} className="text-blue-500" /> Memory
                  </div>
                  <span className="text-sm font-bold text-slate-900">68%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                     Storage
                  </div>
                  <span className="text-sm font-bold text-slate-900">12%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-900 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>

           </div>

           <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-1">Database Connected</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> MongoDB running smoothly</p>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
