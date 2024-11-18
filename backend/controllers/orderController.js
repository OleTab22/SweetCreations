const Order = require('../models/Order');
const { validateProducts, validateTotal } = require('../utils/validation'); // Assuming these validation functions exist

// Create a new order
exports.createOrder = async (req, res) => {
    const { products, total } = req.body;
    try {
        // Validate products and total
        const productsValidation = validateProducts(products);
        if (!productsValidation.isValid) {
            return res.status(400).json({ message: productsValidation.message });
        }

        const totalValidation = validateTotal(total);
        if (!totalValidation.isValid) {
            return res.status(400).json({ message: totalValidation.message });
        }

        const order = new Order({ user: req.user.id, products, total });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all orders for a user with pagination
exports.getOrders = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('products')
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments({ user: req.user.id });

        res.json({
            orders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
