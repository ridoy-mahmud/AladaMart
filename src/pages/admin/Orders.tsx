import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Filter, Eye } from 'lucide-react';

const mockOrders = [
  { id: 'ORD-1001', customer: 'John Doe', date: '2023-11-20', total: 125.00, status: 'Completed', items: 3 },
  { id: 'ORD-1002', customer: 'Jane Smith', date: '2023-11-21', total: 45.00, status: 'Processing', items: 1 },
  { id: 'ORD-1003', customer: 'Robert Johnson', date: '2023-11-21', total: 210.50, status: 'Pending', items: 4 },
  { id: 'ORD-1004', customer: 'Emily Davis', date: '2023-11-22', total: 89.99, status: 'Shipped', items: 2 },
  { id: 'ORD-1005', customer: 'Michael Wilson', date: '2023-11-22', total: 345.00, status: 'Cancelled', items: 1 },
];

const statusColors: any = {
  'Completed': 'bg-green-100 text-green-700',
  'Processing': 'bg-blue-100 text-blue-700',
  'Pending': 'bg-amber-100 text-amber-700',
  'Shipped': 'bg-purple-100 text-purple-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

export default function AdminOrders() {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Orders</h1>
          <p className="text-slate-500 text-sm">Manage and track customer orders</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-180px)]">
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors bg-white">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.items}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors inline-block" title="View Details">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
