const Rider = require('../models/Rider');

const deliveryOptions = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    price: 5.99,
    estimatedTime: '3-5 business days',
    description: 'Regular shipping via our delivery partners'
  },
  {
    id: 'express',
    name: 'Express Delivery',
    price: 12.99,
    estimatedTime: '1-2 business days',
    description: 'Fast shipping with priority handling'
  },
  {
    id: 'rider',
    name: 'Personal Rider',
    price: 15.99,
    estimatedTime: 'Same day delivery',
    description: 'Direct delivery by our personal riders'
  }
];

// @desc    Get delivery options
// @route   GET /api/delivery/options
// @access  Public
const getDeliveryOptions = (req, res) => {
  res.json(deliveryOptions);
};

// @desc    Get available riders
// @route   GET /api/delivery/riders/available
// @access  Public
const getAvailableRiders = async (req, res) => {
  try {
    const riders = await Rider.find({ available: true })
      .select('-currentLocation')
      .sort({ rating: -1 });
    
    res.json(riders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get rider by ID
// @route   GET /api/delivery/riders/:id
// @access  Public
const getRiderById = async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id)
      .select('-currentLocation');
    
    if (rider) {
      res.json(rider);
    } else {
      res.status(404).json({ message: 'Rider not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update rider location
// @route   PUT /api/delivery/riders/:id/location
// @access  Private/Rider
const updateRiderLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const rider = await Rider.findById(req.params.id);
    
    if (rider) {
      rider.currentLocation = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };
      
      await rider.save();
      res.json({ message: 'Location updated successfully' });
    } else {
      res.status(404).json({ message: 'Rider not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get nearby riders
// @route   GET /api/delivery/riders/nearby
// @access  Public
const getNearbyRiders = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 10000 } = req.query;
    
    const riders = await Rider.find({
      available: true,
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).select('name vehicle rating phone');
    
    res.json(riders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDeliveryOptions,
  getAvailableRiders,
  getRiderById,
  updateRiderLocation,
  getNearbyRiders
};