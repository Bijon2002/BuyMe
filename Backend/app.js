const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();

// Middleware FIRST
app.use(express.json());
app.use(cors());

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
const settingController = require('./Controller/settingController');

app.use('/api/v1/products', products);
app.use('/api/v1/orders', orders);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);

// Expose settings publicly for Home page Carousel
app.get('/api/v1/settings', settingController.getSettings);

app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
