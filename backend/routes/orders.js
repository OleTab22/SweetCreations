const express = require('express');
const { createOrder, getOrders, updateOrder, deleteOrder } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getOrders);
router.put('/:orderId', authMiddleware, adminMiddleware, updateOrder);
router.delete('/:orderId', authMiddleware, adminMiddleware, deleteOrder);

module.exports = router;