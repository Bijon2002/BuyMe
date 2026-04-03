const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const settingController = require('../Controller/settingController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Multer config for settings uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `setting-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// Public: Get settings
router.get('/', settingController.getSettings);

// Admin: Update settings
router.put('/', isAuthenticated, isAdmin,
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'carousel_images', maxCount: 10 }
    ]),
    settingController.updateSettings
);

module.exports = router;
