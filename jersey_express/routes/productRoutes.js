const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsByType,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

router.route('/').get(getProducts).post(createProduct);
router.route('/search').get(searchProducts);
router.route('/type/:type').get(getProductsByType);
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

module.exports = router;