import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/orders');
        const orders = await res.json();
        
        // Group orders by email
        const custMap: Record<string, any> = {};
        orders.forEach((o: any) => {
           const email = o.billing?.email || 'Unknown';
           if (!custMap[email]) {
              custMap[email] = {
                 email,
                 name: `${o.billing?.firstName || ''} ${o.billing?.lastName || ''}`.trim() || 'Unknown Customer',
                 orders: 0,
                 spent: 0,
                 date: new Date(o.createdAt).toLocaleDateString()
              };
           }
           custMap[email].orders += 1;
           custMap[email].spent += (o.total || 0);
        });
        setCustomers(Object.values(custMap));
      } catch (err) {
        toast.error('Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, []);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Customers</h1>
          <p className="text-slate-500 text-sm">Manage your store customers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-180px)]">
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 bg-slate-50">
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
             <div className="p-8 text-center text-slate-500">Loading customers...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Spent</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <img src={`https://ui-avatars.com/api/?name=${c.name}&background=random`} alt={c.name} className="w-10 h-10 rounded-full" />
                         <span className="text-sm font-bold text-slate-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{c.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{c.orders}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">৳{c.spent.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{c.date}</td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr><td colSpan={5} className="text-center p-8 text-slate-500">No customers found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
