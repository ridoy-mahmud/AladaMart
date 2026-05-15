import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Markdown from 'react-markdown';
import Loader from '../components/Loader';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs/slug/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => {
        setPost(null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <Loader />;

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Post not found</h1>
        <p className="text-slate-600 mb-8">The article you're looking for doesn't exist or has been moved.</p>
        <Link to="/blog" className="flex items-center gap-2 text-white bg-slate-900 px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors">
          <ArrowLeft size={20} /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-10 text-white">
          <div className="mb-6 flex items-center justify-center">
            <span className="bg-primary/90 text-white text-sm font-bold tracking-wider uppercase px-4 py-1.5 rounded-full backdrop-blur-sm">
              {post.category}
            </span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            {post.title}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base text-white/90"
          >
            <div className="flex items-center gap-2 border-r border-white/20 pr-4">
              <img src={post.authorAvatar} alt={post.author} className="w-8 h-8 rounded-full border border-white/30" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5 border-r border-white/20 pr-4">
              <Calendar size={16} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row gap-8 lg:gap-12 relative">
        
        {/* Social Share Sidebar */}
        <div className="md:w-16 flex-shrink-0 order-2 md:order-1 pt-6">
          <div className="sticky top-24 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider md:text-center mb-2 hidden md:block">Share</span>
            <div className="flex md:flex-col items-center gap-4 border-t md:border-t-0 md:border-r border-slate-200 py-4 md:py-0 md:pr-4">
              <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-colors">
                <Facebook size={18} />
              </button>
              <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-sky-500 hover:border-sky-500 hover:bg-sky-50 transition-colors">
                <Twitter size={18} />
              </button>
              <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-700 hover:border-blue-700 hover:bg-blue-50 transition-colors">
                <Linkedin size={18} />
              </button>
              <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-900 hover:bg-slate-100 transition-colors">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 order-1 md:order-2">
          <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-2xl">
            <Markdown>{post.content}</Markdown>
          </div>
          
          <div className="mt-16 pt-8 border-t border-slate-200 flex items-center justify-between">
            <Link to="/blog" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors">
              <ArrowLeft size={18} /> Back to All Articles
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
