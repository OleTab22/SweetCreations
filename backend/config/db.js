// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error('MongoDB URI is missing from .env file');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
