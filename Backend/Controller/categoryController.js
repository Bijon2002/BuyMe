const Category = require('../models/categoryModel');

// Get all categories (Public)
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });
        res.json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all categories including inactive (Admin)
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ createdAt: -1 });
        res.json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Create category (Admin)
exports.createCategory = async (req, res) => {
    try {
        const { name, description, icon } = req.body;
        const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Category already exists' });
        }
        const category = await Category.create({ name, description, icon });
        res.status(201).json({ success: true, message: 'Category created', category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update category (Admin)
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        res.json({ success: true, message: 'Category updated', category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete category (Admin)
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
