const validateProduct = (req, res, next) => {
    const { name, price, description, category, imageUrl } = req.body;

    const errors = [];

    if (!name?.trim()) errors.push('Product name is required');
    if (!price || price < 0) errors.push('Valid price is required');
    if (!description?.trim()) errors.push('Description is required');
    
    const imageUrlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i;
    if (!imageUrl?.trim() || !imageUrlPattern.test(imageUrl)) {
        errors.push('Valid image URL is required');
    }
    
    const validCategories = ['Cakes', 'Cupcakes', 'Pastries'];
    if (category && !validCategories.includes(category)) {
        errors.push('Invalid category');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors
        });
    }

    next();
};

module.exports = validateProduct;
