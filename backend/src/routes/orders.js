const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrder,
  getOrderPublic,
  createOrder,
  updateOrderStatus,
  getDashboardStats
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard-stats', protect, authorize('admin', 'superadmin'), getDashboardStats);

router.route('/')
  .get(protect, authorize('admin', 'superadmin'), getOrders)
  .post(createOrder);

// Public order lookup (limited fields, for confirmation page)
router.get('/lookup/:id', getOrderPublic);

router.route('/:id')
  .get(protect, authorize('admin', 'superadmin'), getOrder);

router.put('/:id/status', protect, authorize('admin', 'superadmin'), updateOrderStatus);

module.exports = router;
