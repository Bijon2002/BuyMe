const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    deliveryCharge: { type: Number, default: 0 },
    description: String,
    ratings:String,
    images : [
        {
            image: String
        }
    ],
    category: String,
    seller:String,
    stock: String,
    numOfReviews: String,
    createdAt:Date




});

const productModel = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = productModel;