const Setting = require('../models/settingModel');

exports.getSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await Setting.create({
                shopName: 'BuyMe',
                logo: '/images/logo.png',
                carousel: [
                    { image: '/images/banner1.jpg', title: 'Premium Collection', subtitle: 'Discover our latest arrivals' },
                    { image: '/images/banner2.jpg', title: 'Summer Sale', subtitle: 'Up to 50% off on all items' }
                ]
            });
        }
        res.status(200).json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) settings = new Setting();

        const { shopName, carouselData } = req.body;
        
        if (shopName) settings.shopName = shopName;
        
        // Handle logo
        if (req.files && req.files.logo) {
            settings.logo = `/uploads/${req.files.logo[0].filename}`;
        }

        // Handle carousel data (JSON)
        if (carouselData) {
            const parsedCarousel = JSON.parse(carouselData);
            
            // If new images were uploaded, they will be in req.files.carousel_images
            // Our frontend will send an array of slide objects, some with 'fileIndex'
            if (req.files && req.files.carousel_images) {
                let fileIdx = 0;
                parsedCarousel.forEach(slide => {
                    if (slide.isNewImage && fileIdx < req.files.carousel_images.length) {
                        slide.image = `/uploads/${req.files.carousel_images[fileIdx].filename}`;
                        fileIdx++;
                    }
                    delete slide.isNewImage; // Clean up
                });
            }
            
            settings.carousel = parsedCarousel;
        }

        settings.updatedAt = Date.now();
        await settings.save();
        res.status(200).json({ success: true, settings });
    } catch (error) {
        console.error('Settings Update Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
