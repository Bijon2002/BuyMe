const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDatabase = require('../Config/connectDatabase');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Setting = require('../models/settingModel');
const User = require('../models/userModel');

const categories = [
  { name: 'Electronics', description: 'Smartphones, laptops, audio & more', icon: 'fas fa-laptop' },
  { name: 'Fashion', description: 'Clothing, shoes, accessories & trends', icon: 'fas fa-tshirt' },
  { name: 'Home & Living', description: 'Furniture, décor & kitchen essentials', icon: 'fas fa-couch' },
  { name: 'Beauty & Care', description: 'Skincare, makeup & personal care', icon: 'fas fa-spa' },
  { name: 'Sports & Outdoors', description: 'Fitness gear, camping & adventure', icon: 'fas fa-running' },
  { name: 'Books & Media', description: 'Bestsellers, audiobooks & entertainment', icon: 'fas fa-book' },
  { name: 'Accessories', description: 'Watches, bags, wallets & jewelry', icon: 'fas fa-gem' },
  { name: 'Gaming', description: 'Consoles, controllers & gaming gear', icon: 'fas fa-gamepad' },
];

const products = [
  // ==================== Electronics (8 items) ====================
  {
    name: 'MacBook Pro 16" M3 Max',
    price: '3499',
    description: 'The most powerful MacBook ever. Featuring the groundbreaking M3 Max chip with up to 128GB of unified memory, a stunning Liquid Retina XDR display, and all-day battery life. Perfect for professionals who demand the best.',
    ratings: '4.9',
    category: 'Electronics',
    seller: 'Apple Store',
    stock: '25',
    numOfReviews: '847',
    images: [{ image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    price: '349',
    description: 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal-clear hands-free calling with 4 beamforming microphones. 30-hour battery life.',
    ratings: '4.8',
    category: 'Electronics',
    seller: 'Sony Official',
    stock: '120',
    numOfReviews: '2341',
    images: [{ image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'iPad Air M2 11-inch',
    price: '599',
    description: 'Supercharged by the M2 chip. A stunning 11-inch Liquid Retina display with P3 wide color. Supports Apple Pencil Pro for creative workflows.',
    ratings: '4.7',
    category: 'Electronics',
    seller: 'Apple Store',
    stock: '85',
    numOfReviews: '1256',
    images: [{ image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    price: '1299',
    description: 'Galaxy AI is here. The ultimate smartphone experience with a built-in S Pen, 200MP camera, titanium frame, and intelligent AI features.',
    ratings: '4.6',
    category: 'Electronics',
    seller: 'Samsung Store',
    stock: '60',
    numOfReviews: '3421',
    images: [{ image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    price: '99',
    description: 'The iconic productivity mouse perfected. 8K DPI any-surface tracking, quiet clicks, and MagSpeed electromagnetic scrolling.',
    ratings: '4.7',
    category: 'Electronics',
    seller: 'Logitech',
    stock: '300',
    numOfReviews: '4521',
    images: [{ image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Dell UltraSharp 32" 4K Monitor',
    price: '899',
    description: 'Professional-grade 32-inch 4K UHD monitor with IPS Black technology, 98% DCI-P3 color accuracy, and USB-C hub connectivity.',
    ratings: '4.8',
    category: 'Electronics',
    seller: 'Dell Technologies',
    stock: '40',
    numOfReviews: '1890',
    images: [{ image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'AirPods Pro 2nd Gen',
    price: '249',
    description: 'Active Noise Cancellation up to 2x more effective. Adaptive Transparency lets outside sounds in. Personalized Spatial Audio with dynamic head tracking.',
    ratings: '4.7',
    category: 'Electronics',
    seller: 'Apple Store',
    stock: '200',
    numOfReviews: '6789',
    images: [{ image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Canon EOS R6 Mark II Camera',
    price: '2499',
    description: 'Full-frame mirrorless camera with 24.2MP CMOS sensor, up to 40fps electronic shutter, 4K 60p video, and advanced Dual Pixel CMOS AF II.',
    ratings: '4.9',
    category: 'Electronics',
    seller: 'Canon Official',
    stock: '18',
    numOfReviews: '567',
    images: [{ image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop' }]
  },

  // ==================== Fashion (6 items) ====================
  {
    name: 'Cashmere Blend Overcoat',
    price: '489',
    description: 'Luxuriously soft cashmere-wool blend overcoat with a tailored silhouette, silk-lined interior, and horn buttons. Timeless elegance for any occasion.',
    ratings: '4.8',
    category: 'Fashion',
    seller: 'Luxe Atelier',
    stock: '30',
    numOfReviews: '234',
    images: [{ image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Premium Italian Leather Sneakers',
    price: '225',
    description: 'Handcrafted in Italy using full-grain leather with a minimalist design. Features Margom sole for superior comfort and durability.',
    ratings: '4.7',
    category: 'Fashion',
    seller: 'Artisan Footwear',
    stock: '55',
    numOfReviews: '890',
    images: [{ image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Merino Wool Turtleneck',
    price: '129',
    description: 'Fine gauge 100% Australian Merino wool turtleneck. Temperature-regulating and incredibly soft next to skin. Machine washable.',
    ratings: '4.6',
    category: 'Fashion',
    seller: 'Nordic Essentials',
    stock: '80',
    numOfReviews: '567',
    images: [{ image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Tailored Slim-Fit Chinos',
    price: '89',
    description: 'Premium stretch cotton chinos with a modern slim fit, reinforced seams, and YKK hardware. Available in 12 seasonal colors.',
    ratings: '4.5',
    category: 'Fashion',
    seller: 'Urban Thread',
    stock: '150',
    numOfReviews: '1234',
    images: [{ image: 'https://images.unsplash.com/photo-1473966968600-fa804b868cca?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Designer Silk Dress',
    price: '359',
    description: 'Flowing 100% mulberry silk dress with hand-finished seams. Perfect drape for cocktail events and evening occasions.',
    ratings: '4.8',
    category: 'Fashion',
    seller: 'Luxe Atelier',
    stock: '25',
    numOfReviews: '412',
    images: [{ image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Heritage Denim Jacket',
    price: '175',
    description: 'Classic selvedge denim jacket crafted from 14oz Japanese raw denim. Features copper rivets and quilted flannel lining.',
    ratings: '4.6',
    category: 'Fashion',
    seller: 'Heritage Denim Co',
    stock: '65',
    numOfReviews: '789',
    images: [{ image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop' }]
  },

  // ==================== Home & Living (5 items) ====================
  {
    name: 'Scandinavian Oak Dining Table',
    price: '1299',
    description: 'Solid FSC-certified European oak dining table with clean Scandinavian lines. Seats 6 comfortably. Hand-finished with natural oil.',
    ratings: '4.9',
    category: 'Home & Living',
    seller: 'Nordic Home',
    stock: '12',
    numOfReviews: '345',
    images: [{ image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Smart Aromatherapy Diffuser',
    price: '79',
    description: 'WiFi-enabled ultrasonic diffuser with app control, ambient LED lighting in 16 million colors, and whisper-quiet operation.',
    ratings: '4.6',
    category: 'Home & Living',
    seller: 'Zen Living',
    stock: '200',
    numOfReviews: '2345',
    images: [{ image: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Egyptian Cotton Sheet Set',
    price: '199',
    description: '1000 thread count long-staple Egyptian cotton sheets. OEKO-TEX certified. Includes flat sheet, fitted sheet, and 2 pillowcases.',
    ratings: '4.8',
    category: 'Home & Living',
    seller: 'Luxe Linens',
    stock: '45',
    numOfReviews: '1567',
    images: [{ image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Handblown Glass Pendant Light',
    price: '249',
    description: 'Artisan handblown glass pendant light with brass hardware. Creates stunning ambient lighting. Each piece is unique.',
    ratings: '4.7',
    category: 'Home & Living',
    seller: 'Lumière Studio',
    stock: '35',
    numOfReviews: '456',
    images: [{ image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Minimalist Desk Organizer Set',
    price: '59',
    description: 'Premium walnut and brass desk organizer set. Includes pen holder, card stand, cable management tray, and coaster.',
    ratings: '4.5',
    category: 'Home & Living',
    seller: 'Craft & Co',
    stock: '120',
    numOfReviews: '890',
    images: [{ image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800&auto=format&fit=crop' }]
  },

  // ==================== Beauty & Care (5 items) ====================
  {
    name: 'Retinol Advanced Serum',
    price: '68',
    description: 'Clinical-strength 1% retinol serum with hyaluronic acid and vitamin E. Reduces fine lines and improves skin texture in 4 weeks.',
    ratings: '4.7',
    category: 'Beauty & Care',
    seller: 'GlowLab Skincare',
    stock: '300',
    numOfReviews: '4567',
    images: [{ image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Professional Hair Dryer',
    price: '159',
    description: 'Salon-grade 1875W hair dryer with negative ion technology. Reduces frizz by 73%. Includes concentrator and diffuser attachments.',
    ratings: '4.5',
    category: 'Beauty & Care',
    seller: 'ProStyle',
    stock: '90',
    numOfReviews: '2100',
    images: [{ image: 'https://images.unsplash.com/photo-1522338140262-f46f5912018a?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Vitamin C Brightening Moisturizer',
    price: '45',
    description: 'Lightweight daily moisturizer infused with 15% Vitamin C and niacinamide. Brightens, hydrates, and protects. SPF 30.',
    ratings: '4.6',
    category: 'Beauty & Care',
    seller: 'GlowLab Skincare',
    stock: '250',
    numOfReviews: '3456',
    images: [{ image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Luxury Perfume Collection Set',
    price: '189',
    description: 'Curated set of 5 premium eau de parfum fragrances in elegant glass bottles. Notes range from floral to woody. Gift-ready packaging.',
    ratings: '4.8',
    category: 'Beauty & Care',
    seller: 'Maison de Parfum',
    stock: '40',
    numOfReviews: '1234',
    images: [{ image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Jade Roller & Gua Sha Set',
    price: '39',
    description: 'Authentic Grade-A jade roller and gua sha set. Reduces puffiness, promotes lymphatic drainage, and enhances serum absorption.',
    ratings: '4.4',
    category: 'Beauty & Care',
    seller: 'Zen Living',
    stock: '180',
    numOfReviews: '2890',
    images: [{ image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=800&auto=format&fit=crop' }]
  },

  // ==================== Sports & Outdoors (5 items) ====================
  {
    name: 'Carbon Fiber Road Bike',
    price: '2199',
    description: 'Ultra-lightweight T800 carbon fiber frame with Shimano 105 groupset. Aerodynamic tube shaping for maximum speed.',
    ratings: '4.8',
    category: 'Sports & Outdoors',
    seller: 'Velocity Cycling',
    stock: '15',
    numOfReviews: '234',
    images: [{ image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Smart Fitness Tracker Pro',
    price: '199',
    description: 'Advanced health monitoring with ECG, SpO2, and stress tracking. Built-in GPS, 14-day battery, and water resistant to 50m.',
    ratings: '4.6',
    category: 'Sports & Outdoors',
    seller: 'FitTech',
    stock: '120',
    numOfReviews: '5678',
    images: [{ image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Ultralight Camping Tent',
    price: '349',
    description: 'Just 2.8 lbs packed weight. 3-season double-wall tent with 5000mm waterproof rating. Sets up in under 3 minutes.',
    ratings: '4.7',
    category: 'Sports & Outdoors',
    seller: 'Summit Gear',
    stock: '35',
    numOfReviews: '789',
    images: [{ image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Premium Yoga Mat',
    price: '79',
    description: 'Extra-thick 6mm natural rubber yoga mat with alignment markings. Non-slip surface on both sides. Includes carrying strap.',
    ratings: '4.5',
    category: 'Sports & Outdoors',
    seller: 'ZenFit',
    stock: '200',
    numOfReviews: '3456',
    images: [{ image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Insulated Water Bottle 32oz',
    price: '35',
    description: 'Triple-wall vacuum insulated stainless steel. Keeps drinks cold for 24 hours or hot for 12. Leak-proof lid with carrying handle.',
    ratings: '4.6',
    category: 'Sports & Outdoors',
    seller: 'HydroCore',
    stock: '500',
    numOfReviews: '8901',
    images: [{ image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop' }]
  },

  // ==================== Gaming (5 items) ====================
  {
    name: 'Mechanical Gaming Keyboard',
    price: '169',
    description: 'Hot-swappable mechanical switches with per-key RGB backlighting. Aluminum frame, PBT keycaps, and USB-C connectivity.',
    ratings: '4.7',
    category: 'Gaming',
    seller: 'HyperGear',
    stock: '100',
    numOfReviews: '3456',
    images: [{ image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Ultra-Wide Gaming Monitor 34"',
    price: '799',
    description: '34-inch 1440p ultra-wide curved display with 165Hz refresh rate, 1ms response time, and G-Sync compatibility.',
    ratings: '4.8',
    category: 'Gaming',
    seller: 'PixelForge',
    stock: '30',
    numOfReviews: '2100',
    images: [{ image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Ergonomic Gaming Chair',
    price: '449',
    description: 'Racing-inspired design with 4D armrests, magnetic headrest, integrated lumbar support, and recline up to 165 degrees.',
    ratings: '4.5',
    category: 'Gaming',
    seller: 'GameThrone',
    stock: '45',
    numOfReviews: '1567',
    images: [{ image: 'https://images.unsplash.com/photo-1598550476439-6847785fce66?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Wireless Gaming Mouse',
    price: '129',
    description: 'Ultra-lightweight 58g wireless gaming mouse with 25K DPI sensor, 70-hour battery, and optical mechanical switches.',
    ratings: '4.7',
    category: 'Gaming',
    seller: 'HyperGear',
    stock: '150',
    numOfReviews: '4567',
    images: [{ image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'PS5 DualSense Controller',
    price: '69',
    description: 'Next-gen wireless controller with haptic feedback, adaptive triggers, built-in microphone, and 12-hour battery life.',
    ratings: '4.6',
    category: 'Gaming',
    seller: 'Sony Official',
    stock: '200',
    numOfReviews: '7890',
    images: [{ image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop' }]
  },

  // ==================== Accessories (5 items) ====================
  {
    name: 'Automatic Chronograph Watch',
    price: '1895',
    description: 'Swiss-made automatic movement with 80-hour power reserve, sapphire crystal, and 100m water resistance. Exhibition caseback.',
    ratings: '4.9',
    category: 'Accessories',
    seller: 'Heritage Timepieces',
    stock: '10',
    numOfReviews: '456',
    images: [{ image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Full-Grain Messenger Bag',
    price: '289',
    description: 'Hand-stitched vegetable-tanned leather messenger bag. Fits 15-inch laptops with dedicated pockets and brass hardware.',
    ratings: '4.7',
    category: 'Accessories',
    seller: 'Artisan Leather Co',
    stock: '40',
    numOfReviews: '789',
    images: [{ image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Titanium Aviator Sunglasses',
    price: '195',
    description: 'Lightweight titanium frame with polarized CR-39 lenses and UV400 protection. Includes premium leather case.',
    ratings: '4.6',
    category: 'Accessories',
    seller: 'OpticaLux',
    stock: '65',
    numOfReviews: '1234',
    images: [{ image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Leather Bifold Wallet',
    price: '85',
    description: 'Slim bifold wallet crafted from top-grain Italian leather. Features RFID blocking, 8 card slots, and 2 bill compartments.',
    ratings: '4.5',
    category: 'Accessories',
    seller: 'Artisan Leather Co',
    stock: '100',
    numOfReviews: '2345',
    images: [{ image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Pearl Necklace Set',
    price: '299',
    description: 'Freshwater cultured pearl necklace and earring set. 18K gold-plated clasp. AAA quality pearls with beautiful luster.',
    ratings: '4.8',
    category: 'Accessories',
    seller: 'Maison Bijoux',
    stock: '20',
    numOfReviews: '567',
    images: [{ image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6cc?q=80&w=800&auto=format&fit=crop' }]
  },

  // ==================== Books & Media (4 items) ====================
  {
    name: 'The Art of Innovation',
    price: '29',
    description: 'Bestselling guide to creative thinking and innovation in business. Hardcover edition with exclusive author illustrations.',
    ratings: '4.5',
    category: 'Books & Media',
    seller: 'Penguin Publishing',
    stock: '500',
    numOfReviews: '3456',
    images: [{ image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Vintage Vinyl Record Player',
    price: '249',
    description: 'Belt-driven turntable with built-in preamp, Bluetooth connectivity, and premium AT-3600L cartridge. Walnut wood finish.',
    ratings: '4.7',
    category: 'Books & Media',
    seller: 'AudioPhile Co',
    stock: '30',
    numOfReviews: '890',
    images: [{ image: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Kindle Paperwhite Signature',
    price: '189',
    description: '6.8-inch glare-free display, adjustable warm light, 32GB storage, wireless charging, and auto-adjusting front light.',
    ratings: '4.8',
    category: 'Books & Media',
    seller: 'Amazon Devices',
    stock: '150',
    numOfReviews: '5678',
    images: [{ image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    name: 'Premium Journal Notebook Set',
    price: '45',
    description: 'Set of 3 Italian leather-bound journals with 120gsm acid-free paper. Lay-flat binding and ribbon bookmark. A5 size.',
    ratings: '4.6',
    category: 'Books & Media',
    seller: 'Papeterie Fine',
    stock: '200',
    numOfReviews: '1234',
    images: [{ image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=800&auto=format&fit=crop' }]
  },
];

const settingsData = {
  shopName: 'BuyMe',
  logo: '/images/logo.png',
  carousel: [
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop',
      title: 'PREMIUM COLLECTIONS',
      subtitle: 'Experience the pinnacle of luxury and quality in every detail.'
    },
    {
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=2000&auto=format&fit=crop',
      title: 'NEXT-GEN ELECTRONICS',
      subtitle: 'High-performance gear for your digital life, curated for the modern world.'
    },
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2000&auto=format&fit=crop',
      title: 'LUXURY LIFESTYLE',
      subtitle: 'Elevate your everyday with our curated selection of premium essentials.'
    }
  ]
};

const seedDatabase = async () => {
  try {
    await connectDatabase();
    console.log('🔗 Connected to database');

    // Seed Admin User
    const adminExists = await User.findOne({ email: 'admin@buyme.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@buyme.com',
        password: 'Admin@123',
        role: 'admin',
        isActive: true,
        emailVerified: true,
        lastLogin: new Date()
      });
      console.log('✅ Created admin user: admin@buyme.com / Admin@123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Seed Settings
    await Setting.deleteMany({});
    await Setting.create(settingsData);
    console.log('✅ Seeded store settings and carousel with Unsplash images');

    // Seed Categories
    await Category.deleteMany({});
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Seeded ${createdCategories.length} categories with FontAwesome icons`);

    // Seed Products
    await Product.deleteMany({});
    const productsWithDates = products.map((p, i) => ({
      ...p,
      createdAt: new Date(Date.now() - (i * 86400000)) // stagger dates
    }));
    await Product.insertMany(productsWithDates);
    console.log(`✅ Seeded ${products.length} premium products with images`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Admin Login: admin@buyme.com');
    console.log('🔑 Admin Password: Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
