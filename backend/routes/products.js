const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// GET /api/products - with filtering, sorting, and pagination
router.get('/', productController.getAllProducts);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

// POST /api/products - Create a new product (admin only)
router.post('/', authMiddleware, adminMiddleware, productController.createProduct);

// PUT /api/products/:id - Update a product (admin only)
router.put('/:id', authMiddleware, adminMiddleware, productController.updateProduct);

// DELETE /api/products/:id - Delete a product (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

// GET /api/products/featured - Get featured products
router.get('/featured', productController.getFeaturedProducts);

// Add product route
router.post('/', authMiddleware, productController.addProduct);

module.exports = router;