const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');

/**
 * @desc    Create new order
 * @route   POST /api/v1/order
 * @access  Authenticated User
 */
exports.createOrder = async (req, res) => {
  try {
    const CartItems = req.body.CartItems;

    const amount = CartItems.reduce(
      (acc, item) => acc + item.product.price * item.qty,
      0
    );

    const order = await orderModel.create({
      CartItems,
      amount,
      status: 'pending',
      user: req.user._id, // Assumes user association is needed
      createdAt: Date.now()
    });

    // Update product stock
    for (const item of CartItems) {
      const product = await productModel.findById(item.product._id);

      if (product) {
        product.stock -= item.qty;
        await product.save();
      }
    }

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get logged in user orders
 * @route   GET /api/v1/order/myorders
 * @access  Authenticated User
 */
exports.myOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all orders
 * @route   GET /api/v1/order
 * @access  Admin
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find();

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update order status
 * @route   PATCH /api/v1/order/:id/status
 * @access  Admin
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = req.body.status;
    await order.save();

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
