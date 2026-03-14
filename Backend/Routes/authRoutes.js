const express = require('express');
const { 
  registerUser, 
  loginUser,
  getUserProfile,
  updateUserProfile,
  refreshToken,
  logout,
  toggleFavorite
} = require('../Controller/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Protected routes (require authentication)
router.get('/me', isAuthenticated, getUserProfile);      // Get user profile

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, 'profile-' + Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

router.put('/profile', isAuthenticated, upload.single('profilePic'), updateUserProfile); // Update profile
router.post('/favorites/:productId', isAuthenticated, toggleFavorite);

// Test route
router.get('/test', (req, res) => res.json({ 
  success: true,
  message: 'Auth routes working!' 
}));

module.exports = router;