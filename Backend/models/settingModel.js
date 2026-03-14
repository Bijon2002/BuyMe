const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    shopName: {
        type: String,
        default: 'BuyMe'
    },
    logo: {
        type: String,
        default: '/images/logo.png'
    },
    carousel: [
        {
            image: { type: String, required: true },
            title: { type: String },
            subtitle: { type: String }
        }
    ],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Setting', settingSchema);
