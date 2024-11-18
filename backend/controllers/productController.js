const Product = require('../models/Product');
const { validateProduct } = require('../utils/validation'); // Assuming this validation function exists
const mongoose = require('mongoose');

// Helper function to build query
function buildQuery(req) {
    const query = { isActive: true };
    if (req.query.search) {
        query.$or = [
            { name: { $regex: req.query.search, $options: 'i' } },
            { description: { $regex: req.query.search, $options: 'i' } }
        ];
    }
    if (req.query.category) query.category = req.query.category;
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice && !isNaN(req.query.minPrice)) {
            query.price.$gte = parseFloat(req.query.minPrice);
        }
        if (req.query.maxPrice && !isNaN(req.query.maxPrice)) {
            query.price.$lte = parseFloat(req.query.maxPrice);
        }
    }
    return query;
}

// Helper function to build sort query
const buildSortQuery = (sort) => {
    const sortQuery = {};
    switch (sort) {
        case 'price-asc': sortQuery.price = 1; break;
        case 'price-desc': sortQuery.price = -1; break;
        case 'name-asc': sortQuery.name = 1; break;
        case 'name-desc': sortQuery.name = -1; break;
        case 'rating-desc': sortQuery.rating = -1; break;
        default: sortQuery.createdAt = -1;
    }
    return sortQuery;
};

// Get all products with filtering, sorting, and pagination
const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const query = buildQuery(req);
        const sortQuery = buildSortQuery(req.query.sort);

        const [products, total] = await Promise.all([
            Product.find(query).sort(sortQuery).skip(skip).limit(limit).select('-__v'),
            Product.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: products,
            pagination: {
                current: page,
                total,
                totalPages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        res.status(500).json({ success: false, error: 'Error fetching products' });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new product
const createProduct = async (req, res) => {
    try {
        const validation = validateProduct(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ success: false, error: validation.message });
        }

        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        console.error('Error in createProduct:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const validation = validateProduct(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ success: false, error: validation.message });
        }

        const product = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (error) {
        console.error('Error in updateProduct:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// Delete product (soft delete)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error in deleteProduct:', error);
        res.status(500).json({ success: false, error: 'Error deleting product' });
    }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true, featured: true });
        res.json({ success: true, data: products });
    } catch (error) {
        console.error('Error fetching featured products:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock, imageUrl } = req.body;

        const newProduct = new Product({
            name,
            price,
            description,
            category,
            stock,
            imageUrl
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Server error during product addition' });
    }
};

// Function to add a new product
exports.addNewProduct = async (productData) => {
    try {
        // Connect to MongoDB
        if (mongoose.connection.readyState === 0) {
            console.log('Connecting to MongoDB...');
            await mongoose.connect(process.env.MONGO_URI);
            console.log('Connected to MongoDB successfully');
        }

        // Create and save the new product
        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();

        console.log('Product added successfully:', savedProduct.name);
        return savedProduct;
    } catch (error) {
        console.error('Error adding new product:', error);
        throw new Error('Failed to add new product');
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts
};
