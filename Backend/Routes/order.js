const express = require('express');
const { createOrder } = require('../Controller/orderController');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const orderController = require('../Controller/orderController');



router.route('/').post(createOrder);
router.get('/myorders', isAuthenticated, orderController.myOrders);

// Admin routes
router.get('/', isAuthenticated, isAdmin, orderController.getAllOrders);
router.patch('/:id/status', isAuthenticated, isAdmin, orderController.updateOrderStatus);

module.exports = router; 