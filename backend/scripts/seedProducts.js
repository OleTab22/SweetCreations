const mongoose = require('mongoose');
const path = require('path');
const readline = require('readline');
const Product = require('../models/Product');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const products = [
    {
        name: "Classic Vanilla Cake",
        price: 35.99,
        description: "A light and fluffy vanilla cake with smooth buttercream frosting.",
        category: "Cakes",
        stock: 10,
        imageUrl: "/images/products/vanilla-cake.jpg",
        additionalImages: [
            "/images/products/vanilla-cake-slice.jpg",
            "/images/products/vanilla-cake-top.jpg"
        ],
        specifications: {
            servings: "8-10",
            size: "9 inch round",
            allergens: ["Eggs", "Dairy", "Wheat"],
            storageInstructions: "Best served at room temperature. Store refrigerated for up to 3 days."
        },
        rating: 4.8
    },
    {
        name: "Chocolate Fudge Cake",
        price: 38.99,
        description: "Rich, moist chocolate cake layered with decadent fudge frosting. Made with premium dark chocolate and topped with chocolate ganache.",
        category: "Cakes",
        stock: 8,
        imageUrl: "/images/products/chocolate-cake.jpg",
        additionalImages: [
            "/images/products/chocolate-cake-slice.jpg",
            "/images/products/chocolate-cake-top.jpg"
        ],
        specifications: {
            servings: "8-10",
            size: "9 inch round",
            allergens: ["Eggs", "Dairy", "Wheat", "Soy"],
            storageInstructions: "Best served at room temperature. Store refrigerated for up to 4 days."
        },
        rating: 4.9
    },
    {
        name: "Red Velvet Cupcakes",
        price: 24.99,
        description: "Classic red velvet cupcakes topped with cream cheese frosting. A perfect blend of cocoa and vanilla flavors.",
        category: "Cupcakes",
        stock: 24,
        imageUrl: "/images/products/red-velvet-cupcakes.jpg",
        additionalImages: [
            "/images/products/red-velvet-cupcake-single.jpg",
            "/images/products/red-velvet-cupcake-box.jpg"
        ],
        specifications: {
            servings: "12 pieces",
            size: "Standard cupcake size",
            allergens: ["Eggs", "Dairy", "Wheat"],
            storageInstructions: "Store refrigerated for up to 3 days."
        },
        rating: 4.7
    }
];

async function seedProducts() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGO_URI); // For debugging
        
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log('Connected to MongoDB successfully');

        // Confirmation prompt
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Are you sure you want to delete existing products and seed new ones? (yes/no) ', async (answer) => {
            if (answer.toLowerCase() !== 'yes') {
                console.log('Seeding aborted.');
                rl.close();
                await mongoose.connection.close();
                process.exit(0);
            } else {
                rl.close();

                // Clear existing products based on environment
                if (process.env.NODE_ENV === 'development') {
                    console.log('Clearing existing products...');
                    await Product.deleteMany({ isActive: false });
                }

                // Insert new products
                console.log('Inserting new products...');
                const createdProducts = await Product.insertMany(products);

                console.log('Products seeded successfully:');
                createdProducts.forEach(product => {
                    console.log(`- ${product.name}`);
                });

                await mongoose.connection.close();
                console.log('Database connection closed');
                process.exit(0);
            }
        });
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedProducts();
