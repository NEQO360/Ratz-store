const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin', 'superadmin'), createProduct);

router.get('/admin/all', protect, authorize('admin', 'superadmin'), getAdminProducts);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin', 'superadmin'), updateProduct)
  .delete(protect, authorize('admin', 'superadmin'), deleteProduct);

module.exports = router;
