const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    CartItems:Array,
    amount:String,
    status:String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    createdAt:Date
});

const orderModel = mongoose.model('Order',orderSchema);

module.exports = orderModel;