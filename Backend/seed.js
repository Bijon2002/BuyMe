/**
 * BuyMe Database Seed Script
 * Run: node seed.js
 * Seeds categories and 80+ products across 10 categories
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Category = require('./models/categoryModel');
const Product = require('./models/productModel');

const MONGO_URI = process.env.DB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/buyme';

const categories = [
  { name: 'Electronics', icon: 'fas fa-laptop', description: 'Gadgets, phones, laptops and more', isActive: true },
  { name: 'Fashion', icon: 'fas fa-tshirt', description: 'Clothing, shoes and accessories', isActive: true },
  { name: 'Accessories', icon: 'fas fa-gem', description: 'Watches, bags, wallets and sunglasses', isActive: true },
  { name: 'Gaming', icon: 'fas fa-gamepad', description: 'Consoles, games and peripherals', isActive: true },
  { name: 'Home & Living', icon: 'fas fa-couch', description: 'Furniture, decor and bedding', isActive: true },
  { name: 'Sports & Outdoors', icon: 'fas fa-running', description: 'Fitness, camping and sports gear', isActive: true },
  { name: 'Beauty & Care', icon: 'fas fa-spa', description: 'Skincare, haircare and fragrances', isActive: true },
  { name: 'Books & Media', icon: 'fas fa-book', description: 'Books, ebooks and music players', isActive: true },
  { name: 'Cameras', icon: 'fas fa-camera', description: 'DSLR, mirrorless and action cameras', isActive: true },
  { name: 'Kitchen', icon: 'fas fa-utensils', description: 'Appliances, cookware and tools', isActive: true },
];

const products = [
  // ─── Electronics ──────────────────────────────────────────────
  { name: 'MacBook Pro 16" M3 Max', price: '3499', category: 'Electronics', description: 'The most powerful MacBook ever with M3 Max chip, 36GB RAM and 40-core GPU. Perfect for creative professionals.', ratings: '4.9', numOfReviews: '847', stock: '15', deliveryCharge: 0, seller: 'Apple Store', images: [{ image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Sony WH-1000XM5 Headphones', price: '349', category: 'Electronics', description: 'Industry-leading noise cancellation headphones with 30-hour battery life and multipoint connection.', ratings: '4.8', numOfReviews: '2341', stock: '42', deliveryCharge: 0, seller: 'Sony Official', images: [{ image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'iPad Air M2 11-inch', price: '599', category: 'Electronics', description: 'Supercharged by M2 chip. Ultra-sharp Liquid Retina display with True Tone and P3 wide color.', ratings: '4.7', numOfReviews: '1256', stock: '28', deliveryCharge: 0, seller: 'Apple Store', images: [{ image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Samsung Galaxy S24 Ultra', price: '1299', category: 'Electronics', description: 'Galaxy AI is here. Built-in S Pen, 200MP camera and titanium frame. The ultimate Android flagship.', ratings: '4.6', numOfReviews: '3421', stock: '35', deliveryCharge: 0, seller: 'Samsung Official', images: [{ image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Dell XPS 15 Laptop', price: '1799', category: 'Electronics', description: 'Stunning OLED display, Intel Core i9 and NVIDIA RTX 4070. The ultimate Windows laptop for creators.', ratings: '4.7', numOfReviews: '987', stock: '18', deliveryCharge: 0, seller: 'Dell Official', images: [{ image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Apple AirPods Pro 2nd Gen', price: '249', category: 'Electronics', description: 'Up to 2x more Active Noise Cancellation. Adaptive Audio. Personalized Spatial Audio.', ratings: '4.8', numOfReviews: '5678', stock: '60', deliveryCharge: 0, seller: 'Apple Store', images: [{ image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Samsung 4K QLED Smart TV 65"', price: '1199', category: 'Electronics', description: 'Quantum HDR, Neural Quantum Processor 4K, 100% Color Volume. Your cinema at home.', ratings: '4.6', numOfReviews: '1432', stock: '10', deliveryCharge: 0, seller: 'Samsung Official', images: [{ image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Google Pixel 8 Pro', price: '999', category: 'Electronics', description: 'The most pro Pixel ever with Google AI, best-in-class camera system and 7 years of updates.', ratings: '4.5', numOfReviews: '876', stock: '25', deliveryCharge: 0, seller: 'Google Store', images: [{ image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },

  // ─── Fashion ──────────────────────────────────────────────────
  { name: 'Cashmere Blend Overcoat', price: '489', category: 'Fashion', description: 'Luxurious 80% cashmere blend overcoat with satin lining. Timeless silhouette for any formal occasion.', ratings: '4.8', numOfReviews: '234', stock: '20', deliveryCharge: 0, seller: 'LuxeWear', images: [{ image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Premium Italian Leather Sneakers', price: '225', category: 'Fashion', description: 'Hand-stitched full-grain Italian leather sneakers. Comfort meets luxury with memory foam insoles.', ratings: '4.7', numOfReviews: '890', stock: '30', deliveryCharge: 0, seller: 'ItalianShoe Co.', images: [{ image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Merino Wool Turtleneck', price: '129', category: 'Fashion', description: 'Ultra-soft 100% merino wool with natural temperature regulation. Available in 12 curated colors.', ratings: '4.6', numOfReviews: '567', stock: '45', deliveryCharge: 0, seller: 'WoolCraft', images: [{ image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Tailored Slim-Fit Chinos', price: '89', category: 'Fashion', description: 'Stretch-cotton blend chinos with a modern slim fit. Wrinkle-resistant for travel and office.', ratings: '4.5', numOfReviews: '1234', stock: '55', deliveryCharge: 0, seller: 'ModernFit', images: [{ image: 'https://images.unsplash.com/photo-1473966968600-fa804b868cca?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Silk Evening Dress', price: '345', category: 'Fashion', description: 'Pure silk charmeuse evening dress with delicate draping. Timeless elegance for special occasions.', ratings: '4.9', numOfReviews: '178', stock: '12', deliveryCharge: 0, seller: 'EveningGlow', images: [{ image: 'https://images.unsplash.com/photo-1566479179817-0b1c32bc3b49?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Oxford Button-Down Shirt', price: '79', category: 'Fashion', description: 'Classic Oxford weave cotton shirt. Versatile enough for business casual or weekend wear.', ratings: '4.4', numOfReviews: '2100', stock: '80', deliveryCharge: 0, seller: 'ClassicCotton', images: [{ image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Designer Denim Jacket', price: '159', category: 'Fashion', description: 'Vintage-washed Japanese selvedge denim jacket with contrast stitching. A wardrobe staple.', ratings: '4.6', numOfReviews: '543', stock: '25', deliveryCharge: 0, seller: 'DenimCraft', images: [{ image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },

  // ─── Accessories ──────────────────────────────────────────────
  { name: 'Automatic Chronograph Watch', price: '1895', category: 'Accessories', description: 'Swiss-made automatic chronograph with sapphire crystal glass. Water resistant to 100m.', ratings: '4.9', numOfReviews: '456', stock: '8', deliveryCharge: 0, seller: 'TimeMaster', images: [{ image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Full-Grain Messenger Bag', price: '289', category: 'Accessories', description: 'Full-grain vegetable-tanned leather messenger bag. Fits a 15" laptop. Develops beautiful patina.', ratings: '4.7', numOfReviews: '789', stock: '14', deliveryCharge: 0, seller: 'LeatherCraft', images: [{ image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Titanium Aviator Sunglasses', price: '195', category: 'Accessories', description: 'Ultralight titanium frame with polarized gradient lenses. UV400 protection with spring hinges.', ratings: '4.6', numOfReviews: '1234', stock: '22', deliveryCharge: 0, seller: 'SunStyle', images: [{ image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Leather Bifold Wallet', price: '85', category: 'Accessories', description: 'RFID-blocking slim bifold wallet in full-grain leather. Holds 8 cards with dedicated bill compartment.', ratings: '4.5', numOfReviews: '2345', stock: '50', deliveryCharge: 0, seller: 'SlimWallet Co.', images: [{ image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Smart Watch Series 9', price: '449', category: 'Accessories', description: 'Advanced health monitoring with ECG, blood oxygen and crash detection. All-day battery life.', ratings: '4.8', numOfReviews: '3456', stock: '30', deliveryCharge: 0, seller: 'TechWear', images: [{ image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Luxury Silk Scarf', price: '125', category: 'Accessories', description: 'Hand-rolled 100% silk twill scarf with original print. 90cm x 90cm. Made in Italy.', ratings: '4.7', numOfReviews: '321', stock: '18', deliveryCharge: 0, seller: 'SilkHouse', images: [{ image: 'https://images.unsplash.com/photo-1601924921557-45b2d7bc19b7?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },

  // ─── Gaming ───────────────────────────────────────────────────
  { name: 'Mechanical Gaming Keyboard', price: '169', category: 'Gaming', description: 'Per-key RGB mechanical keyboard with Cherry MX switches. Anti-ghosting with N-key rollover.', ratings: '4.7', numOfReviews: '3456', stock: '38', deliveryCharge: 0, seller: 'GameGear', images: [{ image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Ultra-Wide Gaming Monitor 34"', price: '799', category: 'Gaming', description: '34" QD-OLED 175Hz with 0.03ms response time and HDR1000. The most immersive PC gaming experience.', ratings: '4.8', numOfReviews: '2100', stock: '12', deliveryCharge: 0, seller: 'DisplayPro', images: [{ image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Ergonomic Gaming Chair', price: '449', category: 'Gaming', description: 'Racing-style gaming chair with lumbar pillow, 4D armrests and 165° recline. 5-year warranty.', ratings: '4.5', numOfReviews: '1567', stock: '15', deliveryCharge: 0, seller: 'ComfortGaming', images: [{ image: 'https://images.unsplash.com/photo-1598550476439-6847785fce66?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Wireless Gaming Mouse', price: '129', category: 'Gaming', description: '26,000 DPI optical sensor, 70+ hour battery and 2.4GHz wireless. Zero compromise performance.', ratings: '4.7', numOfReviews: '4567', stock: '42', deliveryCharge: 0, seller: 'PrecisionGear', images: [{ image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'PlayStation 5 Console', price: '499', category: 'Gaming', description: 'Experience lightning-fast loading with ultra-high speed SSD, deeper immersion with haptic feedback.', ratings: '4.9', numOfReviews: '8901', stock: '5', deliveryCharge: 0, seller: 'PlayStation', images: [{ image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Gaming Headset 7.1 Surround', price: '89', category: 'Gaming', description: 'Virtual 7.1 surround sound, retractable noise-cancelling microphone and memory foam ear cups.', ratings: '4.5', numOfReviews: '2789', stock: '35', deliveryCharge: 0, seller: 'SoundGaming', images: [{ image: 'https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },

  // ─── Home & Living ────────────────────────────────────────────
  { name: 'Scandinavian Oak Dining Table', price: '1299', category: 'Home & Living', description: 'Solid FSC-certified oak table for 6 people. Clean Scandinavian lines with oiled wood finish.', ratings: '4.9', numOfReviews: '345', stock: '4', deliveryCharge: 0, seller: 'NordicHome', images: [{ image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Smart Aromatherapy Diffuser', price: '79', category: 'Home & Living', description: 'Ultrasonic diffuser with 7-color LED ambient light, timer and app control for 500ml tank.', ratings: '4.6', numOfReviews: '2345', stock: '28', deliveryCharge: 0, seller: 'ZenHome', images: [{ image: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Egyptian Cotton Sheet Set', price: '199', category: 'Home & Living', description: '1000 thread count Egyptian cotton bedding. Sateen weave with a silk-smooth hand feel.', ratings: '4.8', numOfReviews: '1567', stock: '22', deliveryCharge: 0, seller: 'LuxeBedding', images: [{ image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Handblown Glass Pendant Light', price: '249', category: 'Home & Living', description: 'Artisan handblown amber glass pendant with brass fittings. Adds warm, ambient light to any space.', ratings: '4.7', numOfReviews: '456', stock: '10', deliveryCharge: 0, seller: 'ArtisanLights', images: [{ image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Linen Throw Pillow Set', price: '65', category: 'Home & Living', description: 'Set of 4 Belgian linen throw pillows with feather inserts. Mix and match colors for any aesthetic.', ratings: '4.5', numOfReviews: '890', stock: '40', deliveryCharge: 0, seller: 'TextileHome', images: [{ image: 'https://images.unsplash.com/photo-1540638349517-3abd5afc5847?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Cast Iron Dutch Oven 6qt', price: '179', category: 'Home & Living', description: 'Enamelled cast iron Dutch oven with self-basting lid. Perfect for braising, baking bread and soups.', ratings: '4.8', numOfReviews: '2100', stock: '20', deliveryCharge: 0, seller: 'ChefCookware', images: [{ image: 'https://images.unsplash.com/photo-1584990347449-a9e6a88f15b2?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },

  // ─── Sports & Outdoors ────────────────────────────────────────
  { name: 'Carbon Fiber Road Bike', price: '2199', category: 'Sports & Outdoors', description: 'Ultegra groupset on a carbon monocoque frameset. Race-ready with aero geometry and tubeless tires.', ratings: '4.8', numOfReviews: '234', stock: '6', deliveryCharge: 0, seller: 'VeloRace', images: [{ image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Smart Fitness Tracker Pro', price: '199', category: 'Sports & Outdoors', description: 'GPS, heart rate, SpO2, sleep tracking and 7-day battery. Swim-proof and ultra-thin at 9.9mm.', ratings: '4.6', numOfReviews: '5678', stock: '45', deliveryCharge: 0, seller: 'FitTech', images: [{ image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Ultralight Camping Tent', price: '349', category: 'Sports & Outdoors', description: '2-person ultralight backpacking tent at 1.1kg. Dual-door, dual-vestibule design for 3-season adventures.', ratings: '4.7', numOfReviews: '789', stock: '16', deliveryCharge: 0, seller: 'AlpineGear', images: [{ image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Premium Yoga Mat', price: '79', category: 'Sports & Outdoors', description: '6mm thick non-slip natural rubber yoga mat with alignment lines. Eco-friendly and antimicrobial.', ratings: '4.5', numOfReviews: '3456', stock: '55', deliveryCharge: 0, seller: 'ZenFit', images: [{ image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Adjustable Dumbbell Set', price: '299', category: 'Sports & Outdoors', description: 'Quick-adjust dumbbells replacing 15 sets of weights. 5-52.5 lbs per dumbbell, compact storage.', ratings: '4.7', numOfReviews: '1678', stock: '20', deliveryCharge: 0, seller: 'IronFlex', images: [{ image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Trail Running Shoes', price: '149', category: 'Sports & Outdoors', description: 'Maximum grip Vibram outsole with breathable mesh upper. Waterproof Gore-Tex version available.', ratings: '4.6', numOfReviews: '2345', stock: '35', deliveryCharge: 0, seller: 'TrailRun Co.', images: [{ image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },

  // ─── Beauty & Care ────────────────────────────────────────────
  { name: 'Retinol Advanced Serum', price: '68', category: 'Beauty & Care', description: '0.3% encapsulated retinol with hyaluronic acid for enhanced delivery. Reduces fine lines in 4 weeks.', ratings: '4.7', numOfReviews: '4567', stock: '60', deliveryCharge: 0, seller: 'SkinScience', images: [{ image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Professional Hair Dryer', price: '159', category: 'Beauty & Care', description: '2200W professional AC motor hair dryer with ionic technology. 6 heat and 2 speed settings.', ratings: '4.5', numOfReviews: '2100', stock: '30', deliveryCharge: 0, seller: 'HairPro', images: [{ image: 'https://images.unsplash.com/photo-1522338140262-f46f5912018a?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Vitamin C Brightening Moisturizer', price: '45', category: 'Beauty & Care', description: '15% Vitamin C complex with ferulic acid and niacinamide. Clinically proven to brighten in 2 weeks.', ratings: '4.6', numOfReviews: '3456', stock: '50', deliveryCharge: 0, seller: 'GlowLab', images: [{ image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Luxury Perfume Collection Set', price: '189', category: 'Beauty & Care', description: 'Set of 5 travel-size EDPs from iconic French perfume houses. Perfect gift for any occasion.', ratings: '4.8', numOfReviews: '1234', stock: '18', deliveryCharge: 0, seller: 'ParfumLux', images: [{ image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Electric Face Cleansing Brush', price: '89', category: 'Beauty & Care', description: 'Sonic cleansing brush with 4 modes. Removes 99.5% of impurities. Waterproof with wireless charging.', ratings: '4.5', numOfReviews: '1890', stock: '25', deliveryCharge: 0, seller: 'SkinTech', images: [{ image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Hyaluronic Acid Eye Cream', price: '38', category: 'Beauty & Care', description: 'Triple molecular weight hyaluronic acid eye cream. Targets dark circles, puffiness and fine lines.', ratings: '4.4', numOfReviews: '2567', stock: '45', deliveryCharge: 0, seller: 'HydraLab', images: [{ image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },

  // ─── Books & Media ────────────────────────────────────────────
  { name: 'The Art of Innovation', price: '29', category: 'Books & Media', description: 'Tom Kelley reveals the secrets behind IDEO\'s legendary creative culture. A must-read for entrepreneurs.', ratings: '4.5', numOfReviews: '3456', stock: '100', deliveryCharge: 0, seller: 'BookHouse', images: [{ image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Vintage Vinyl Record Player', price: '249', category: 'Books & Media', description: 'Belt-drive turntable with built-in preamp, Bluetooth and USB for converting vinyl to digital.', ratings: '4.7', numOfReviews: '890', stock: '14', deliveryCharge: 0, seller: 'RetroSound', images: [{ image: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Kindle Paperwhite Signature', price: '189', category: 'Books & Media', description: 'Our most advanced Kindle. Auto-adjusting front light, wireless charging and 32GB storage.', ratings: '4.8', numOfReviews: '5678', stock: '40', deliveryCharge: 0, seller: 'Amazon', images: [{ image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Premium Journal Notebook Set', price: '45', category: 'Books & Media', description: 'Set of 3 A5 notebooks with lay-flat binding, acid-free paper and ribbon bookmarks.', ratings: '4.6', numOfReviews: '1234', stock: '75', deliveryCharge: 0, seller: 'StationeryHouse', images: [{ image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Atomic Habits — James Clear', price: '18', category: 'Books & Media', description: 'The #1 New York Times bestseller. An easy and proven way to build good habits and break bad ones.', ratings: '4.9', numOfReviews: '12345', stock: '200', deliveryCharge: 0, seller: 'BookHouse', images: [{ image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },

  // ─── Cameras ──────────────────────────────────────────────────
  { name: 'Sony A7 IV Full Frame Mirrorless', price: '2499', category: 'Cameras', description: '33MP full-frame BSI-CMOS sensor, 4K 60fps video and real-time Eye AF. The hybrid camera of choice.', ratings: '4.9', numOfReviews: '678', stock: '8', deliveryCharge: 0, seller: 'Sony Official', images: [{ image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Canon EOS R50 Mirrorless', price: '699', category: 'Cameras', description: 'Entry-level mirrorless with 24MP APS-C sensor, subject tracking AF and 4K video. Perfect for beginners.', ratings: '4.6', numOfReviews: '1234', stock: '20', deliveryCharge: 0, seller: 'Canon Official', images: [{ image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'GoPro HERO12 Black', price: '399', category: 'Cameras', description: '5.3K60 video, HyperSmooth 6.0 stabilization and waterproof to 10m without housing.', ratings: '4.7', numOfReviews: '2345', stock: '25', deliveryCharge: 0, seller: 'GoPro', images: [{ image: 'https://images.unsplash.com/photo-1551651653-c5ab04c5d02e?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'DJI Mavic 3 Pro Drone', price: '2199', category: 'Cameras', description: 'Triple-camera flagship drone with Hasselblad main camera, 43-min flight time and omnidirectional sensing.', ratings: '4.8', numOfReviews: '456', stock: '7', deliveryCharge: 0, seller: 'DJI Official', images: [{ image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Polaroid Now+ Instant Camera', price: '149', category: 'Cameras', description: 'Next-gen i-Type camera with 5 creative Lens Filters and Bluetooth app control for double exposure.', ratings: '4.5', numOfReviews: '890', stock: '30', deliveryCharge: 0, seller: 'Polaroid', images: [{ image: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },

  // ─── Kitchen ──────────────────────────────────────────────────
  { name: 'Espresso Machine with Grinder', price: '699', category: 'Kitchen', description: 'Built-in conical burr grinder, 15-bar pressure pump and steam wand. Café quality at home.', ratings: '4.8', numOfReviews: '1234', stock: '12', deliveryCharge: 0, seller: 'CaféPro', images: [{ image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'KitchenAid Stand Mixer', price: '449', category: 'Kitchen', description: '5-quart tilt-head stand mixer with 10 speeds, includes 3 bowls. Icon of every serious kitchen.', ratings: '4.9', numOfReviews: '5678', stock: '18', deliveryCharge: 0, seller: 'KitchenAid', images: [{ image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Air Fryer XL 6-Quart', price: '129', category: 'Kitchen', description: 'Up to 75% less fat than traditional frying. Presets for air fry, bake, roast, reheat and dehydrate.', ratings: '4.7', numOfReviews: '8901', stock: '40', deliveryCharge: 0, seller: 'TastiCook', images: [{ image: 'https://images.unsplash.com/photo-1621188988909-fbef0a0a88ea?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Japanese Santoku Knife Set', price: '189', category: 'Kitchen', description: 'VG-10 Damascus steel 67-layer blade set. Include 3.5" paring, 7" Santoku and 8" chef knife.', ratings: '4.8', numOfReviews: '2100', stock: '22', deliveryCharge: 0, seller: 'BladeCraft', images: [{ image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Vitamix 5200 Blender', price: '399', category: 'Kitchen', description: 'Variable speed control, self-cleaning design. Pulverizes whole foods for silky-smooth results in seconds.', ratings: '4.8', numOfReviews: '3456', stock: '15', deliveryCharge: 0, seller: 'Vitamix', images: [{ image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
  { name: 'Instant Pot Duo 7-in-1', price: '99', category: 'Kitchen', description: 'Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and warmer in one.', ratings: '4.7', numOfReviews: '12345', stock: '55', deliveryCharge: 0, seller: 'InstantBrands', images: [{ image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?q=80&w=800&auto=format&fit=crop' }], createdAt: new Date() },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Seed categories
    console.log('\n🗂️  Seeding categories...');
    for (const cat of categories) {
      const existing = await Category.findOne({ name: cat.name });
      if (!existing) {
        await Category.create(cat);
        console.log(`   ✅ Created: ${cat.name}`);
      } else {
        console.log(`   ⚠️  Skipped (exists): ${cat.name}`);
      }
    }

    // Seed products
    console.log('\n📦  Seeding products...');
    let created = 0, skipped = 0;
    for (const p of products) {
      const existing = await Product.findOne({ name: p.name });
      if (!existing) {
        await Product.create(p);
        console.log(`   ✅ ${p.name} [${p.category}]`);
        created++;
      } else {
        skipped++;
      }
    }

    console.log(`\n🎉  Done! Created ${created} products, skipped ${skipped} duplicates.`);
    console.log(`📊  Total categories: ${categories.length}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
