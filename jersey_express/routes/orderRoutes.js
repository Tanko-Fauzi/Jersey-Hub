const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
  assignRider,
  updateTracking
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(createOrder)
  .get(protect, admin, getAllOrders);

router.route('/myorders')
  .get(getMyOrders);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

router.route('/:id/rider')
  .put(protect, admin, assignRider);

router.route('/:id/tracking')
  .put(protect, admin, updateTracking);

module.exports = router;