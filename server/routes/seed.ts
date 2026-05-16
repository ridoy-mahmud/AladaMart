import { Router } from 'express';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Brand } from '../models/Brand.js';
import mongoose from 'mongoose';

const router = Router();

const BannerSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  image: String,
  link: String,
  buttonText: String,
  position: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  coverImage: String,
  category: String,
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

const CouponSchema = new mongoose.Schema({
  code: { type: String, uppercase: true },
  discountType: String,
  discountValue: Number,
  minimumPurchase: Number,
  validFrom: Date,
  validUntil: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);

// Existing Categories...
const sampleCategories = [
  { name: "Smartphones", slug: "smartphones", icon: "📱", image: "https://picsum.photos/400?1", isActive: true, productCount: 0 },
  { name: "Laptops & PC", slug: "laptops-pc", icon: "💻", image: "https://picsum.photos/400?2", isActive: true, productCount: 0 },
  { name: "Audio & Headphones", slug: "audio-headphones", icon: "🎧", image: "https://picsum.photos/400?3", isActive: true, productCount: 0 },
  { name: "Cameras", slug: "cameras", icon: "📷", image: "https://picsum.photos/400?4", isActive: true, productCount: 0 },
  { name: "Tablets", slug: "tablets", icon: "📟", image: "https://picsum.photos/400?8", isActive: true, productCount: 0 },
  { name: "Wearables", slug: "wearables", icon: "⌚", image: "https://picsum.photos/400?9", isActive: true, productCount: 0 },
  { name: "Gaming", slug: "gaming", icon: "🎮", image: "https://picsum.photos/400?5", isActive: true, productCount: 0 },
  { name: "Home Appliances", slug: "home-appliances", icon: "🏠", image: "https://picsum.photos/400?6", isActive: true, productCount: 0 },
  { name: "Accessories", slug: "accessories", icon: "🔌", image: "https://picsum.photos/400?7", isActive: true, productCount: 0 },
  { name: "Television", slug: "television", icon: "📺", image: "https://picsum.photos/400?10", isActive: true, productCount: 0 },
];

const sampleBrands = [
  { name: "Apple", slug: "apple", logo: "apple-logo.png", isActive: true },
  { name: "Samsung", slug: "samsung", logo: "samsung-logo.png", isActive: true },
  { name: "Sony", slug: "sony", logo: "sony-logo.png", isActive: true },
  { name: "HP", slug: "hp", logo: "hp-logo.png", isActive: true },
  { name: "Canon", slug: "canon", logo: "canon-logo.png", isActive: true },
  { name: "JBL", slug: "jbl", logo: "jbl-logo.png", isActive: true },
  { name: "Intel", slug: "intel", logo: "intel-logo.png", isActive: true },
  { name: "Realme", slug: "realme", logo: "realme-logo.png", isActive: true },
  { name: "LG", slug: "lg", logo: "lg-logo.png", isActive: true },
  { name: "Bose", slug: "bose", logo: "bose-logo.png", isActive: true },
];

const realisticProducts = [
  // Smartphones
  { title: "iPhone 16 Pro Max", price: 1199, brand: "Apple", category: "Smartphones", thumb: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop" },
  { title: "Samsung Galaxy S25 Ultra", price: 1299, brand: "Samsung", category: "Smartphones", thumb: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop" },
  { title: "Google Pixel 9 Pro", price: 999, brand: "Samsung", category: "Smartphones", thumb: "https://images.unsplash.com/photo-1598327105666-5b89351cb315?q=80&w=800&auto=format&fit=crop" },
  { title: "Realme Note 60x", price: 299, brand: "Realme", category: "Smartphones", thumb: "https://images.unsplash.com/photo-1598327105854-c9431e67610d?q=80&w=800&auto=format&fit=crop" },
  { title: "OnePlus 12", price: 799, brand: "Samsung", category: "Smartphones", thumb: "https://images.unsplash.com/photo-1575316281084-3866223b3790?q=80&w=800&auto=format&fit=crop" },
  { title: "iPhone 15", price: 799, brand: "Apple", category: "Smartphones", thumb: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop" },
  
  // Laptops
  { title: "MacBook Pro M4", price: 1999, brand: "Apple", category: "Laptops & PC", thumb: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop" },
  { title: "HP Laptop AMD Ryzen 5", price: 599, brand: "HP", category: "Laptops & PC", thumb: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop" },
  { title: "Dell XPS 15", price: 1499, brand: "Intel", category: "Laptops & PC", thumb: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop" },
  { title: "ASUS ROG Strix", price: 1299, brand: "Intel", category: "Laptops & PC", thumb: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop" },
  { title: "MacBook Air M3", price: 1099, brand: "Apple", category: "Laptops & PC", thumb: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop" },
  { title: "Lenovo ThinkPad X1", price: 1399, brand: "Intel", category: "Laptops & PC", thumb: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop" },

  // Audio
  { title: "Apple AirPods Max", price: 549, brand: "Apple", category: "Audio & Headphones", thumb: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=800&auto=format&fit=crop" },
  { title: "AirPods Pro 3rd Gen", price: 249, brand: "Apple", category: "Audio & Headphones", thumb: "https://images.unsplash.com/photo-1606220588913-b3eea4158421?q=80&w=800&auto=format&fit=crop" },
  { title: "Sony WH-CH520", price: 79, brand: "Sony", category: "Audio & Headphones", thumb: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop" },
  { title: "JBL E55BT", price: 129, brand: "JBL", category: "Audio & Headphones", thumb: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop" },
  { title: "Bose QuietComfort 45", price: 329, brand: "Bose", category: "Audio & Headphones", thumb: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop" },
  { title: "Sony WF-1000XM5", price: 298, brand: "Sony", category: "Audio & Headphones", thumb: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop" },

  // Cameras
  { title: "Canon EOS 250D", price: 650, brand: "Canon", category: "Cameras", thumb: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop" },
  { title: "Sony A7 IV", price: 2498, brand: "Sony", category: "Cameras", thumb: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop" },
  { title: "GoPro Hero 12", price: 399, brand: "Sony", category: "Cameras", thumb: "https://images.unsplash.com/photo-1565536480111-9a7c8ba0c8d1?q=80&w=800&auto=format&fit=crop" },
  { title: "Fujifilm X-T5", price: 1699, brand: "Canon", category: "Cameras", thumb: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=800&auto=format&fit=crop" },

  // Tablets
  { title: "iPad Pro M4", price: 1099, brand: "Apple", category: "Tablets", thumb: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop" },
  { title: "Samsung Galaxy Tab S9", price: 799, brand: "Samsung", category: "Tablets", thumb: "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=800&auto=format&fit=crop" },
  { title: "iPad Air 5", price: 599, brand: "Apple", category: "Tablets", thumb: "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?q=80&w=800&auto=format&fit=crop" },

  // Wearables
  { title: "Apple Watch Ultra 2", price: 799, brand: "Apple", category: "Wearables", thumb: "https://images.unsplash.com/photo-1434493789847-2f02b0c166d1?q=80&w=800&auto=format&fit=crop" },
  { title: "Samsung Galaxy Watch 6", price: 299, brand: "Samsung", category: "Wearables", thumb: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop" },
  { title: "Garmin Fenix 7", price: 699, brand: "Samsung", category: "Wearables", thumb: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop" },

  // Gaming
  { title: "PS5 Console", price: 499, brand: "Sony", category: "Gaming", thumb: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800&auto=format&fit=crop" },
  { title: "Xbox Series X", price: 499, brand: "Sony", category: "Gaming", thumb: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=800&auto=format&fit=crop" },
  { title: "Nintendo Switch OLED", price: 349, brand: "Sony", category: "Gaming", thumb: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=800&auto=format&fit=crop" },
  { title: "PlayStation VR2", price: 549, brand: "Sony", category: "Gaming", thumb: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800&auto=format&fit=crop" },

  // TV
  { title: "Samsung OLED 65\"", price: 1799, brand: "Samsung", category: "Television", thumb: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop" },
  { title: "LG C4 OLED 55\"", price: 1499, brand: "LG", category: "Television", thumb: "https://images.unsplash.com/photo-1552831388-6a0b35077328?q=80&w=800&auto=format&fit=crop" },
  { title: "Sony Bravia XR 65\"", price: 1999, brand: "Sony", category: "Television", thumb: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=800&auto=format&fit=crop" },

  // 20 New Products Added
  { title: "Razer DeathAdder V3 Pro", price: 149, brand: "Realme", category: "Accessories", thumb: "https://images.unsplash.com/photo-1527814050087-179f826353d2?q=80&w=800&auto=format&fit=crop" },
  { title: "Logitech MX Master 3S", price: 99, brand: "LG", category: "Accessories", thumb: "https://images.unsplash.com/photo-1615663245857-ac931145a201?q=80&w=800&auto=format&fit=crop" },
  { title: "Keychron K2 Wireless", price: 89, brand: "HP", category: "Accessories", thumb: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop" },
  { title: "Dell UltraSharp 27 4K", price: 599, brand: "Intel", category: "Accessories", thumb: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=800&auto=format&fit=crop" },
  { title: "Elgato Stream Deck", price: 149, brand: "Sony", category: "Accessories", thumb: "https://images.unsplash.com/photo-1621213076722-e3a1ec43d0fd?q=80&w=800&auto=format&fit=crop" },
  { title: "Samsung T7 Portable SSD 1TB", price: 119, brand: "Samsung", category: "Accessories", thumb: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=800&auto=format&fit=crop" },
  { title: "Apple Magic Trackpad", price: 129, brand: "Apple", category: "Accessories", thumb: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop" },
  { title: "Dyson V15 Detect", price: 699, brand: "LG", category: "Home Appliances", thumb: "https://images.unsplash.com/photo-1558317374-067fb5f400cb?q=80&w=800&auto=format&fit=crop" },
  { title: "Philips Hue Starter Kit", price: 199, brand: "LG", category: "Home Appliances", thumb: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800&auto=format&fit=crop" },
  { title: "Nespresso Vertuo Plus", price: 159, brand: "LG", category: "Home Appliances", thumb: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop" },
  { title: "Ember Temperature Control Mug", price: 129, brand: "LG", category: "Home Appliances", thumb: "https://images.unsplash.com/photo-1517502474136-11f8e12d4d9b?q=80&w=800&auto=format&fit=crop" },
  { title: "Sonos Arc Soundbar", price: 899, brand: "LG", category: "Audio & Headphones", thumb: "https://images.unsplash.com/photo-1545620958-3d1486bc05a1?q=80&w=800&auto=format&fit=crop" },
  { title: "Bose SoundLink Flex", price: 149, brand: "Bose", category: "Audio & Headphones", thumb: "https://images.unsplash.com/photo-1615215096185-c54dced1ceba?q=80&w=800&auto=format&fit=crop" },
  { title: "Sony HT-A7000", price: 1299, brand: "Sony", category: "Audio & Headphones", thumb: "https://images.unsplash.com/photo-1588693273928-912df075d31d?q=80&w=800&auto=format&fit=crop" },
  { title: "Insta360 X3", price: 449, brand: "Canon", category: "Cameras", thumb: "https://images.unsplash.com/photo-1526170375885-4dcf0171a067?q=80&w=800&auto=format&fit=crop" },
  { title: "DJI Mini 3 Pro", price: 759, brand: "Canon", category: "Cameras", thumb: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop" },
  { title: "Nikon Z fc", price: 959, brand: "Canon", category: "Cameras", thumb: "https://images.unsplash.com/photo-1518105749320-b3b3a3bc9dfc?q=80&w=800&auto=format&fit=crop" },
  { title: "Kindle Paperwhite", price: 139, brand: "Apple", category: "Tablets", thumb: "https://images.unsplash.com/photo-1594958184511-3ee4408304c5?q=80&w=800&auto=format&fit=crop" },
  { title: "Microsoft Surface Pro 9", price: 999, brand: "Intel", category: "Tablets", thumb: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop" },
  { title: "Oura Ring Gen3", price: 299, brand: "Apple", category: "Wearables", thumb: "https://images.unsplash.com/photo-1627989580309-bfaf3ce58ce8?q=80&w=800&auto=format&fit=crop" }
];

const sampleBlogs = [
  { title: "Top 10 Tech Gadgets for 2026", slug: "top-10-tech-gadgets", excerpt: "Discover the most anticipated gadgets...", content: "# Top 10 Tech Gadgets for 2026\n\nDiscover the most anticipated gadgets coming this year. From AI-powered smart home hubs to transparent OLED displays, the future is here.", coverImage: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop", category: "Tech News", isPublished: true },
  { title: "How to Choose the Perfect Laptop", slug: "how-to-choose-laptop", excerpt: "A comprehensive guide to buying your next machine.", content: "# How to Choose the Perfect Laptop\n\nBuying a laptop can be overwhelming with so many choices. Here is what you need to prioritize: CPU, RAM, display quality, and battery life depending on your use case.", coverImage: "https://images.unsplash.com/photo-1531297172867-628c6e269137?q=80&w=800&auto=format&fit=crop", category: "Buying Guide", isPublished: true },
  { title: "Smart Home Setup: A Beginner's Guide", slug: "smart-home-setup", excerpt: "Everything you need to automate your life.", content: "# Smart Home Setup: A Beginner's Guide\n\nAutomating your home is easier than ever. Start with smart plugs and lightbulbs, then move on to a central hub and smart locks. Security and convenience combined.", coverImage: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop", category: "How-to", isPublished: true }
];

const sampleBanners = [
  { title: "Grab Upto 50% Off On Selected Headphone", subtitle: "Weekly Savings", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop", position: "hero", link: "/shop", isActive: true },
];

const sampleCoupons = [
  { code: "WELCOME10", discountType: "percentage", discountValue: 10, minimumPurchase: 50, validFrom: new Date(), validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true },
  { code: "SAVE20", discountType: "percentage", discountValue: 20, minimumPurchase: 100, validFrom: new Date(), validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true },
  { code: "FLAT50", discountType: "fixed", discountValue: 50, minimumPurchase: 200, validFrom: new Date(), validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true },
];

const generateProducts = (categories: any[], brands: any[]) => {
  const products = [];

  for (const item of realisticProducts) {
    const cat = categories.find(c => c.name === item.category);
    const brand = brands.find(b => b.name === item.brand);
    
    if(!cat) continue;

    const discount = Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 5 : 0;
    
    products.push({
        title: item.title,
        slug: item.title.toLowerCase().replace(/\s+/g, '-'),
        description: `Experience the latest technology with the ${item.title}. Engineered for performance and reliability, it meets all your daily needs with premium style.`,
        shortDescription: `High quality ${cat.name.toLowerCase()} for exceptional experience.`,
        price: item.price - (item.price * (discount / 100)),
        originalPrice: item.price,
        discount,
        thumbnail: item.thumb,
        images: [{ url: item.thumb }],
        category: cat._id,
        categoryName: cat.slug,
        brand: brand?._id,
        brandName: brand?.name,
        stock: Math.floor(Math.random() * 100) + 10,
        rating: +(Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 - 5.0
        reviewCount: Math.floor(Math.random() * 500) + 10,
        isFeatured: Math.random() > 0.6,
        isNewArrival: Math.random() > 0.5,
        isBestSeller: Math.random() > 0.5,
        colors: [{ name: "Black", hex: "#000000" }, { name: "Silver", hex: "#e2e8f0" }]
    });
  }
  return products;
}

router.post('/', async (req, res) => {
  try {
    // Clear existing
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Brand.deleteMany({});
    await Blog.deleteMany({});
    await Banner.deleteMany({});
    await Coupon.deleteMany({});

    // Seed Categories & Brands
    const createdCategories = await Category.insertMany(sampleCategories as any);
    const createdBrands = await Brand.insertMany(sampleBrands as any);
    
    // Seed Products
    const sampleProducts = generateProducts(createdCategories, createdBrands);
    await Product.insertMany(sampleProducts as any);
    
    // Seed Blogs, Banners, Coupons
    const createdBlogs = await Blog.insertMany(sampleBlogs as any);
    const createdBanners = await Banner.insertMany(sampleBanners as any);
    const createdCoupons = await Coupon.insertMany(sampleCoupons as any);

    res.json({ message: 'Database seeded successfully with targeted products!', counts: {
        categories: createdCategories.length,
        brands: createdBrands.length,
        products: sampleProducts.length,
        blogs: createdBlogs.length,
        banners: createdBanners.length,
        coupons: createdCoupons.length
    }});
  } catch (error: any) {
    console.error("Seed error:", error);
    res.status(500).json({ error: 'Failed to seed database', details: error.message });
  }
});

export default router;
