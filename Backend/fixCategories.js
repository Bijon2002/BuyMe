/**
 * BuyMe Category Fix Script
 * Run: node fixCategories.js
 * Updates existing categories with correct Font Awesome icons
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Category = require('./models/categoryModel');
const MONGO_URI = process.env.DB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/buyme';

const categoryFixes = [
  { name: 'Electronics',       icon: 'fas fa-laptop',      isActive: true },
  { name: 'Fashion',           icon: 'fas fa-tshirt',      isActive: true },
  { name: 'Accessories',       icon: 'fas fa-gem',         isActive: true },
  { name: 'Gaming',            icon: 'fas fa-gamepad',     isActive: true },
  { name: 'Home & Living',     icon: 'fas fa-couch',       isActive: true },
  { name: 'Sports & Outdoors', icon: 'fas fa-running',     isActive: true },
  { name: 'Beauty & Care',     icon: 'fas fa-spa',         isActive: true },
  { name: 'Books & Media',     icon: 'fas fa-book',        isActive: true },
  { name: 'Cameras',           icon: 'fas fa-camera',      isActive: true },
  { name: 'Kitchen',           icon: 'fas fa-utensils',    isActive: true },
];

async function fixCategories() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  for (const fix of categoryFixes) {
    const result = await Category.findOneAndUpdate(
      { name: fix.name },
      { icon: fix.icon, isActive: fix.isActive },
      { upsert: true, new: true }
    );
    console.log(`✅ ${result.name} → icon: ${result.icon}`);
  }

  const total = await Category.countDocuments({ isActive: true });
  console.log(`\n🎉 Done! ${total} active categories in DB.`);
  await mongoose.disconnect();
}

fixCategories().catch(err => { console.error('❌', err.message); process.exit(1); });
