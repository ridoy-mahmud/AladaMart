import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Check, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const location = useLocation();

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, priceRange, sort, searchQuery]);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [location.search, searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('limit', '50');
        if (searchQuery) queryParams.append('search', searchQuery);

        const [prodRes, catRes, brandRes] = await Promise.all([
          fetch(`/api/products?${queryParams.toString()}`).catch(() => null),
          fetch('/api/categories').catch(() => null),
          fetch('/api/brands').catch(() => null)
        ]);
        
        const prods = prodRes && prodRes.ok ? await prodRes.json() : [];
        setProducts(Array.isArray(prods) ? prods : (prods?.docs || []));
        
        setCategories(catRes && catRes.ok ? await catRes.json() : []);
        setBrands(brandRes && brandRes.ok ? await brandRes.json() : []);
      } catch (error) {
        console.error('Failed to fetch shop data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery]);

  const filteredProducts = products.filter((p: any) => {
    if (selectedCategory && p.categoryName !== selectedCategory) return false;
    if (selectedBrand && p.brandName !== selectedBrand && p.brand?.name !== selectedBrand && p.brand?.slug !== selectedBrand) return false;
    if (p.price > priceRange) return false;
    return true;
  }).sort((a: any, b: any) => {
    switch (sort) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const activeFiltersCount = (selectedCategory ? 1 : 0) + (selectedBrand ? 1 : 0);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const handlePageChange = (page: number | ((prev: number) => number)) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous Button
    pages.push(
      <button 
        key="prev" 
        onClick={() => handlePageChange(prev => Math.max(1, typeof prev === 'number' ? prev - 1 : 1))}
        disabled={currentPage === 1}
        className={`px-4 h-10 rounded-lg flex items-center justify-center border font-medium transition-colors ${currentPage === 1 ? 'border-slate-100 text-slate-300 cursor-not-allowed' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
      >
        Previous
      </button>
    );

    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => handlePageChange(1)} className="w-10 h-10 rounded-lg flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 hidden sm:flex">1</button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots-1" className="w-10 h-10 flex items-center justify-center text-slate-400 hidden sm:flex">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button 
            key={i} 
            onClick={() => handlePageChange(i)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${currentPage === i ? 'border-primary bg-primary text-white font-bold shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {i}
          </button>
        );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots-2" className="w-10 h-10 flex items-center justify-center text-slate-400 hidden sm:flex">...</span>);
      }
      pages.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)} className="w-10 h-10 rounded-lg flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 hidden sm:flex">{totalPages}</button>
      );
    }

    // Next Button
    pages.push(
      <button 
        key="next" 
        onClick={() => handlePageChange(prev => Math.min(totalPages, typeof prev === 'number' ? prev + 1 : totalPages))}
        disabled={currentPage === totalPages}
        className={`px-4 h-10 rounded-lg flex items-center justify-center border font-medium transition-colors ${currentPage === totalPages ? 'border-slate-100 text-slate-300 cursor-not-allowed' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
      >
        Next
      </button>
    );

    return (
      <div className="flex flex-wrap justify-center items-center mt-12 gap-2">
        {pages}
      </div>
    );
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange(2000);
    setSearchParams(new URLSearchParams());
  };

  const FilterSidebar = () => (
    <div className="flex flex-col gap-8">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b">Categories</h3>
        <ul className="space-y-3">
          <li 
            className={`cursor-pointer flex items-center justify-between text-sm ${!selectedCategory ? 'text-primary font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setSelectedCategory('')}
          >
            <span>All Categories</span>
          </li>
          {categories.map((c) => (
            <li 
              key={c._id} 
              className={`cursor-pointer flex items-center justify-between text-sm ${selectedCategory === c.slug ? 'text-primary font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              onClick={() => setSelectedCategory(c.slug)}
            >
              <span>{c.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b">Brands</h3>
        <ul className="space-y-3">
          <li 
            className={`cursor-pointer flex items-center text-sm ${!selectedBrand ? 'text-primary font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setSelectedBrand('')}
          >
             <div className={`w-4 h-4 rounded border mr-2 flex items-center justify-center ${!selectedBrand ? 'bg-primary border-primary text-white' : 'border-slate-300'}`}>
                {!selectedBrand && <Check size={12} />}
             </div>
             All Brands
          </li>
          {brands.map((b) => (
            <li 
              key={b._id} 
              className={`cursor-pointer flex items-center text-sm ${selectedBrand === b.name || selectedBrand === b.slug ? 'text-primary font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              onClick={() => setSelectedBrand(b.slug || b.name)}
            >
              <div className={`w-4 h-4 rounded border mr-2 flex items-center justify-center ${selectedBrand === b.name || selectedBrand === b.slug ? 'bg-primary border-primary text-white' : 'border-slate-300'}`}>
                {(selectedBrand === b.name || selectedBrand === b.slug) && <Check size={12} />}
              </div>
              {b.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
         <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b">Price Range</h3>
         <div className="px-1">
           <input 
             type="range" 
             min="0" 
             max="2000" 
             step="50" 
             value={priceRange} 
             onChange={(e) => setPriceRange(Number(e.target.value))}
             className="w-full accent-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
           />
           <div className="flex justify-between items-center mt-3 text-sm text-slate-600 font-medium">
             <span>$0</span>
             <span>Up to ${priceRange}</span>
           </div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2">
              <button 
                className="lg:hidden flex items-center gap-2 bg-slate-100 text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter size={16} /> Filters {activeFiltersCount > 0 && <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">{activeFiltersCount}</span>}
              </button>
              <div className="text-sm text-slate-500 hidden sm:block">
                Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> results {searchQuery && <span>for "<span className="text-primary font-bold">{searchQuery}</span>"</span>}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="text-sm text-danger hover:underline">Clear Filters</button>
              )}
              <span className="text-sm text-slate-500 whitespace-nowrap hidden sm:inline">Sort by:</span>
              <div className="relative flex-1 sm:flex-none">
                <select 
                  className="w-full sm:w-auto appearance-none bg-white border border-slate-200 text-slate-900 text-sm font-medium rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
              </div>
            </div>
          </div>

          {/* Mobile active filters snippet */}
          <div className="sm:hidden text-sm text-slate-500 mb-4 px-1">
            Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> results {searchQuery && <span>for "<span className="text-primary font-bold">{searchQuery}</span>"</span>}
          </div>

          {/* Product Grid */}
          {loading ? (
             <div className="w-full flex justify-center py-20">
               <Loader text="Loading products..." />
             </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {paginatedProducts.map((p: any, i: number) => (
                  <ProductCard key={p._id} product={p} idx={i} />
                ))}
              </div>
              {/* Pagination */}
              {renderPagination()}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
               <h3 className="text-xl font-bold text-slate-700 mb-2">No products found</h3>
               <p className="text-slate-500 mb-6">Try adjusting your filters or search query.</p>
               <button onClick={clearFilters} className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors">Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 z-50 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 shadow-2xl flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-1.5 bg-slate-100 rounded-md hover:bg-slate-200"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <FilterSidebar />
              </div>
              <div className="p-4 border-t bg-slate-50 flex gap-3">
                <button onClick={clearFilters} className="flex-1 bg-white border border-slate-200 py-3 rounded-lg font-medium">Clear All</button>
                <button onClick={() => setIsFilterOpen(false)} className="flex-1 bg-primary text-white py-3 rounded-lg font-medium">Apply</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
