const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/userModel');

// @desc    Get all users (Admin only)
// @route   GET /api/v1/admin/users
// @access  Private/Admin
router.get('/users', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user by ID (Admin only)
// @route   GET /api/v1/admin/users/:id
// @access  Private/Admin
router.get('/users/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user status (Admin only)
// @route   PUT /api/v1/admin/users/:id/status
// @access  Private/Admin
router.put('/users/:id/status', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
    await user.save();
    
    res.json({
      success: true,
      message: 'User status updated',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get Dashboard Stats (Admin only)
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
router.get('/stats', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await require('../models/productModel').countDocuments();
    const orders = await require('../models/orderModel').find();
    
    const totalOrders = orders.length;
    const revenue = orders.reduce((acc, order) => acc + (order.amount || 0), 0);
    
    // Recent 5 users
    const recentUsers = await User.find({}).sort({ createdAt: -1 }).limit(5).select('-password');

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        revenue,
        recentUsers
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Settings Logic
const settingController = require('../Controller/settingController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

router.get('/settings', isAuthenticated, isAdmin, settingController.getSettings);
router.put('/settings', isAuthenticated, isAdmin, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'carousel_images' }
]), settingController.updateSettings);

module.exports = router;