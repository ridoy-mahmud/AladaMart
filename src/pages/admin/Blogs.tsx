import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Edit2, Trash2, GripVertical, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    _id: '', title: '', slug: '', excerpt: '', content: '', coverImage: '',
    category: '', readTime: '', isPublished: true, author: '', authorAvatar: ''
  });

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs/all');
      const data = await res.json();
      setBlogs(data);
    } catch (e) {
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = formData._id ? `/api/blogs/${formData._id}` : '/api/blogs';
      const method = formData._id ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Failed to save blog');
      toast.success('Blog saved successfully');
      setFormData({ _id: '', title: '', slug: '', excerpt: '', content: '', coverImage: '', category: '', readTime: '', isPublished: true, author: '', authorAvatar: '' });
      setIsEditing(false);
      fetchBlogs();
    } catch (error) {
      toast.error('Error saving blog');
    }
  };

  const handleDelete = async (id: string) => {
    // Confirmation is removed due to iframe sandbox restrictions in preview
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete blog');
      toast.success('Blog deleted');
      fetchBlogs();
    } catch (error) {
      toast.error('Error deleting blog');
    }
  };

  const movePosition = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blogs.length - 1)) return;
    
    const newBlogs = [...blogs];
    const itemToMove = newBlogs.splice(index, 1)[0];
    newBlogs.splice(direction === 'up' ? index - 1 : index + 1, 0, itemToMove);
    
    const reordered = newBlogs.map((b, i) => ({ _id: b._id, position: i + 1 }));
    setBlogs(newBlogs); // optimistic ui update

    try {
      const res = await fetch('/api/blogs/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: reordered })
      });
      if (!res.ok) throw new Error('Failed to reorder');
      toast.success('Reordered successfully');
    } catch (error) {
      toast.error('Error reordering');
      fetchBlogs(); // revert
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Manage Blogs</h1>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              New Blog
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">{formData._id ? 'Edit Blog' : 'Create New Blog'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slug (auto-generated if empty)</label>
                  <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Read Time (e.g. 5 min read)</label>
                  <input type="text" value={formData.readTime} onChange={e => setFormData({...formData, readTime: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Author Name</label>
                  <input type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Author Avatar URL</label>
                  <input type="text" value={formData.authorAvatar} onChange={e => setFormData({...formData, authorAvatar: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image URL</label>
                  <input type="text" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
                  <textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" rows={2} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Content (Markdown supported) *</label>
                  <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" rows={25} />
                </div>
                <div className="md:col-span-2 flex items-center bg-slate-50 p-4 rounded-lg border border-slate-200 gap-3">
                  <input type="checkbox" id="isPublished" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="w-5 h-5 text-primary rounded focus:ring-primary border-slate-300" />
                  <label htmlFor="isPublished" className="text-sm font-medium text-slate-900 cursor-pointer">Publish this blog post immediately</label>
                </div>
              </div>
              <div className="flex gap-4 border-t pt-6">
                <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">Save Blog Post</button>
                <button type="button" onClick={() => { setIsEditing(false); setFormData({ _id: '', title: '', slug: '', excerpt: '', content: '', coverImage: '', category: '', readTime: '', isPublished: true, author: '', authorAvatar: '' }); }} className="px-6 py-2.5 border border-slate-300 font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 w-16">Reorder</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3 hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
                ) : blogs.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8">No blogs found.</td></tr>
                ) : (
                  blogs.map((blog, index) => (
                    <tr key={blog._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-center">
                          <button onClick={() => movePosition(index, 'up')} disabled={index === 0} className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30">▲</button>
                          <button onClick={() => movePosition(index, 'down')} disabled={index === blogs.length - 1} className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30">▼</button>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{blog.title}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-slate-500">{blog.category}</td>
                      <td className="px-4 py-3 text-center">
                        {blog.isPublished ? <Check className="mx-auto text-green-500" size={16}/> : <X className="mx-auto text-red-500" size={16}/>}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button 
                          onClick={() => { setFormData(blog); setIsEditing(true); }}
                          className="text-blue-600 p-1 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-500 p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
