const express = require('express');
const router = express.Router();
const { submitContact, getContacts, replyContact } = require('../Controller/contactController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Public route for form submission
router.post('/submit', submitContact);

// Admin routes for contact management
router.get('/', isAuthenticated, isAdmin, getContacts);
router.post('/reply/:id', isAuthenticated, isAdmin, replyContact);

module.exports = router;
