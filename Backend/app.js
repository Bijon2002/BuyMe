const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();

// Middleware FIRST
app.use(express.json());
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
  credentials: true
}));

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Help frontend find original images if requested
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// DB
const connectDatabase = require('./Config/connectDatabase');
connectDatabase();

// Routes
const products = require('./Routes/product');
const orders = require('./Routes/order');
const authRoutes = require('./Routes/authRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const settingsRoutes = require('./Routes/settingsRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const newsletterRoutes = require('./Routes/newsletterRoutes');
const contactRoutes = require('./Routes/contactRoutes');
const settingController = require('./Controller/settingController');
const categoryController = require('./Controller/categoryController');
const { isAuthenticated, isAdmin } = require('./middleware/authMiddleware');

app.use('/api/v1/products', products);
app.use('/api/v1/orders', orders);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/newsletter', newsletterRoutes);
app.use('/api/v1/contact', contactRoutes);

// Expose settings publicly for Home page Carousel
app.get('/api/v1/settings', settingController.getSettings);

// Category routes (public)
app.get('/api/v1/categories', categoryController.getCategories);

// Category routes (admin)
app.get('/api/v1/admin/categories', isAuthenticated, isAdmin, categoryController.getAllCategories);
app.post('/api/v1/admin/categories', isAuthenticated, isAdmin, categoryController.createCategory);
app.put('/api/v1/admin/categories/:id', isAuthenticated, isAdmin, categoryController.updateCategory);
app.delete('/api/v1/admin/categories/:id', isAuthenticated, isAdmin, categoryController.deleteCategory);

app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(
    `Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`
  );
});
