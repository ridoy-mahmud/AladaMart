import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks for reaching out! We will get back to you soon.");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
       <div className="text-center max-w-2xl mx-auto mb-16">
         <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Contact Us</h1>
         <p className="text-lg text-slate-600">Have a question or feedback? We would love to hear from you. Fill out the form below or contact us directly.</p>
       </div>

       <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
               <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center text-primary mb-4">
                 <Phone size={28} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">Phone</h3>
               <p className="text-slate-600">+1 (234) 567 890</p>
               <p className="text-slate-600">Mon-Fri 9am-6pm</p>
             </div>
             
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
               <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center text-primary mb-4">
                 <Mail size={28} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">Email</h3>
               <p className="text-slate-600">support@shopmart.com</p>
               <p className="text-slate-600">sales@shopmart.com</p>
             </div>

             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
               <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center text-primary mb-4">
                 <MapPin size={28} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">Location</h3>
               <p className="text-slate-600">123 Commerce St</p>
               <p className="text-slate-600">New York, NY 10001</p>
             </div>
          </div>

          <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
             <h2 className="text-2xl font-bold text-slate-900 mb-8">Send a Message</h2>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                    <input 
                      required type="text" 
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Your Email</label>
                    <input 
                      required type="email" 
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea 
                    required rows={6} 
                    value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                  ></textarea>
                </div>
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all">
                  Send Message
                </button>
             </form>
          </div>
       </div>
    </div>
  );
}
