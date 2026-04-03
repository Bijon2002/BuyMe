const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers, deleteSubscriber } = require('../Controller/newsletterController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

router.route('/subscribe').post(subscribe);

// Admin Routes
router.get('/admin/subscribers', isAuthenticated, isAdmin, getSubscribers);
router.delete('/admin/subscribers/:id', isAuthenticated, isAdmin, deleteSubscriber);

module.exports = router;
