const express = require('express');
const { addNewProduct } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to add a new product
router.post('/add-product', authMiddleware, async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await addNewProduct(productData);
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 