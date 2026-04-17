const express = require('express');
const router = express.Router();
const {
  getDeliveryOptions,
  getAvailableRiders,
  getRiderById,
  updateRiderLocation,
  getNearbyRiders
} = require('../controllers/deliveryController');

router.get('/options', getDeliveryOptions);
router.get('/riders/available', getAvailableRiders);
router.get('/riders/nearby', getNearbyRiders);
router.get('/riders/:id', getRiderById);
router.put('/riders/:id/location', updateRiderLocation);

module.exports = router;