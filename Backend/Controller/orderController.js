const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');

/**
 * @desc    Create new order
 * @route   POST /api/v1/orders
 * @access  Authenticated User
 */
exports.createOrder = async (req, res) => {
  try {
    const { CartItems, billingAddress, deliveryEstimate, travelTime, paymentId } = req.body;

    const amount = CartItems.reduce(
      (acc, item) => acc + item.product.price * item.qty,
      0
    );

    const order = await orderModel.create({
      CartItems,
      amount,
      status: 'Delivery Pending',
      trackingStatus: 'Delivery Pending',
      user: req.user ? req.user._id : null,
      billingAddress: billingAddress || {},
      deliveryEstimate: deliveryEstimate || '',
      travelTime: travelTime || '',
      paymentMethod: 'stripe',
      paymentId: paymentId || '',
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
    const orders = await orderModel.find({ user: req.user._id }).sort({ createdAt: -1 });

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
    const orders = await orderModel.find().sort({ createdAt: -1 });

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
    order.trackingStatus = req.body.status;
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
