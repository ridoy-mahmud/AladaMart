import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Settings</h1>
          <p className="text-slate-500 text-sm">Manage your store settings</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-3xl">
        <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">General Settings</h2>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Store Name</label>
            <input type="text" defaultValue="AladaMart" className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Store Description</label>
            <textarea rows={3} defaultValue="Your one stop shop for everything." className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"></textarea>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Currency</label>
              <select className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Timezone</label>
              <select className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                <option value="UTC">UTC</option>
                <option value="EST">EST</option>
                <option value="PST">PST</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button type="button" className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
              <Save size={18} /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
