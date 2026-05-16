import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, Search, Filter, Loader, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount: '0',
    stock: '',
    brandName: '',
    categoryName: '',
    thumbnail: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : (data?.docs || []));
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Confirmation is removed due to iframe sandbox restrictions in preview
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted successfully');
        setProducts(products.filter(p => p._id !== id));
      } else {
        toast.error('Failed to delete product');
      }
    } catch (err) {
      toast.error('Error deleting product');
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '', description: '', price: '', discount: '0', stock: '', brandName: '', categoryName: '', thumbnail: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingId(product._id);
    setFormData({
      title: product.title || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      discount: product.discount?.toString() || '0',
      stock: product.stock?.toString() || '',
      brandName: product.brandName || '',
      categoryName: product.categoryName || '',
      thumbnail: product.thumbnail || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        price: Number(formData.price),
        discount: Number(formData.discount),
        stock: Number(formData.stock)
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(`Product ${editingId ? 'updated' : 'created'} successfully`);
        setIsModalOpen(false);
        fetchProducts(); // Refresh list
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save product');
      }
    } catch (err) {
      toast.error('Error saving product');
    }
  };

  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Products</h1>
          <p className="text-slate-500 text-sm">Manage your store products</p>
        </div>
        <button onClick={openAddModal} className="bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-180px)]">
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
             <div className="h-full flex items-center justify-center">
                <Loader size={32} className="animate-spin text-primary" />
             </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 rounded-lg bg-slate-100 p-1 flex items-center justify-center border border-slate-200 shrink-0 overflow-hidden">
                           <img src={p.thumbnail || 'https://via.placeholder.com/150'} alt={p.title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                         </div>
                         <div className="min-w-0">
                           <p className="text-sm font-bold text-slate-900 truncate max-w-[250px]" title={p.title}>{p.title}</p>
                           <p className="text-xs text-slate-500">{p.brandName || 'Store'}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="text-sm text-slate-600 px-2.5 py-1 bg-slate-100 rounded-md font-medium">{p.categoryName || 'General'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="text-sm font-bold text-slate-900">${p.price?.toFixed(2)}</span>
                       {p.discount > 0 && <span className="text-xs text-danger font-medium ml-2 border border-danger/20 rounded px-1.5 py-0.5 bg-danger/5">-{p.discount}%</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stock > 10 ? 'In Stock' : p.stock > 0 ? `Low (${p.stock})` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal(p)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(p._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                         <Search size={40} className="text-slate-300" />
                         <p>No products found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="productForm" onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Product Title *</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Price ($) *</label>
                    <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Discount (%)</label>
                    <input type="number" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Stock Quantity *</label>
                    <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Brand Name</label>
                    <input type="text" value={formData.brandName} onChange={e => setFormData({...formData, brandName: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                    <input type="text" value={formData.categoryName} onChange={e => setFormData({...formData, categoryName: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Thumbnail Image URL</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="https://example.com/image.jpg" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} className="flex-1 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                      {formData.thumbnail && (
                        <div className="w-10 h-10 border border-slate-200 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50">
                           <img src={formData.thumbnail} alt="preview" className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                    <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"></textarea>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" form="productForm" className="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-md">
                {editingId ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
