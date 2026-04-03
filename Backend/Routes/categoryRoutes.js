const express = require('express');
const router = express.Router();
const categoryController = require('../Controller/categoryController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Public: Get active categories
router.get('/', categoryController.getCategories);

// Admin routes
router.get('/admin', isAuthenticated, isAdmin, categoryController.getAllCategories);
router.post('/', isAuthenticated, isAdmin, categoryController.createCategory);
router.put('/:id', isAuthenticated, isAdmin, categoryController.updateCategory);
router.delete('/:id', isAuthenticated, isAdmin, categoryController.deleteCategory);

module.exports = router;
