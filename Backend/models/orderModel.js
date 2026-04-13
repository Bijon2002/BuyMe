const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    CartItems: Array,
    amount: String,
    status: { type: String, default: 'Delivery Pending' },
    trackingStatus: { type: String, default: 'Delivery Pending' },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    billingAddress: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        postalCode: { type: String, default: '' },
        country: { type: String, default: '' },
    },
    deliveryEstimate: { type: String, default: '' },
    travelTime: { type: String, default: '' },
    paymentMethod: { type: String, default: 'stripe' },
    paymentId: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;