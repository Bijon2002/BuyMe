const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const {
  getProducts,
  getSingleProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview
} = require('../Controller/productController');

const multer = require('multer');
const path = require('path');

// Multer Config for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// Public routes
router.get('/', getProducts); 
router.get('/settings', require('../Controller/settingController').getSettings);
router.get('/:id', getSingleProducts);
router.get('/:id/reviews', getProductReviews);

// Protected routes (require login)
router.post('/:id/reviews', isAuthenticated, createProductReview);
router.delete('/:id/reviews', isAuthenticated, deleteReview);

// Admin-only routes with Image Upload support
router.post('/', isAuthenticated, isAdmin, upload.array('images'), addProduct);
router.put('/:id', isAuthenticated, isAdmin, upload.array('images'), updateProduct);
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct);

module.exports = router;