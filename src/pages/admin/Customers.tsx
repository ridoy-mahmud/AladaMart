import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search } from 'lucide-react';

const mockCustomers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', orders: 12, spent: 1250, date: '2023-11-20' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', orders: 5, spent: 450, date: '2023-12-05' },
  { id: '3', name: 'Robert Johnson', email: 'robert@example.com', orders: 2, spent: 85, date: '2024-01-12' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', orders: 8, spent: 890, date: '2024-02-28' },
  { id: '5', name: 'Michael Wilson', email: 'michael@example.com', orders: 21, spent: 3450, date: '2024-03-15' },
];

export default function AdminCustomers() {
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
              {mockCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <img src={`https://ui-avatars.com/api/?name=${c.name}&background=random`} alt={c.name} className="w-10 h-10 rounded-full" />
                       <span className="text-sm font-bold text-slate-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{c.orders}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">${c.spent.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
