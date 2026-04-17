const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  removeUserAddress
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.post('/profile/address', protect, addUserAddress);
router.delete('/profile/address/:addressId', protect, removeUserAddress);

module.exports = router;