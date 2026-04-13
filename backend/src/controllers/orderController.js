const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendOrderConfirmation, sendOrderStatusUpdate, sendPaymentConfirmation, sendAdminNewOrderNotification } = require('../utils/emailService');

exports.getOrders = async (req, res, next) => {
  try {
    const { status, search, dateFrom, dateTo, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo + 'T23:59:59.999Z');
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name price images');

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.getOrderPublic = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .select('orderNumber customer.name customer.email items total status shippingAddress paymentMethod createdAt');

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { customer, items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in order' });
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, error: `Product ${item.product} not found` });
      }
      if (product.inventory < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.name}`
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });

      total += product.price * item.quantity;

      product.inventory -= item.quantity;
      await product.save();
    }

    const initialStatus = paymentMethod === 'Bank Transfer' ? 'awaiting_payment' : 'pending';

    const order = await Order.create({
      customer,
      user: req.user ? req.user._id : undefined,
      items: orderItems,
      total,
      status: initialStatus,
      shippingAddress,
      paymentMethod
    });

    const populated = await Order.findById(order._id)
      .populate('items.product', 'name price images');

    sendOrderConfirmation(populated).catch(err => console.error('Email error:', err));
    sendAdminNewOrderNotification(populated).catch(err => console.error('Admin email error:', err));

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['awaiting_payment', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const previousOrder = await Order.findById(req.params.id);
    if (!previousOrder) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const previousStatus = previousOrder.status;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.product', 'name price images');

    // Send email notifications on status change
    if (previousStatus !== status) {
      if (previousStatus === 'awaiting_payment' && status === 'pending') {
        sendPaymentConfirmation(order).catch(err => console.error('Email error:', err));
      } else if (['processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        sendOrderStatusUpdate(order).catch(err => console.error('Email error:', err));
      }
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const Contact = require('../models/Contact');

    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const totalProducts = await Product.countDocuments({ active: true });

    const pendingOrders = await Order.countDocuments({ status: { $in: ['pending', 'awaiting_payment'] } });
    const unreadMessages = await Contact.countDocuments({ status: 'unread' });

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber customer.name total status createdAt');

    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          sold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalProducts,
        pendingOrders,
        unreadMessages,
        totalCustomers: await Order.distinct('customer.email').then(e => e.length),
        recentOrders: recentOrders.map(o => ({
          _id: o._id,
          orderNumber: o.orderNumber,
          customer: o.customer.name,
          total: o.total,
          status: o.status,
          createdAt: o.createdAt
        })),
        topProducts
      }
    });
  } catch (err) {
    next(err);
  }
};
