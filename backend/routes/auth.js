const express = require('express');
const { register, login, logout, resetPassword, verifyEmail } = require('../controllers/authController');
const { sensitiveLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// Register route
router.post('/register', register);

// Login route with rate limiting
router.post('/login', sensitiveLimiter, login);

// Logout route
router.post('/logout', logout);

// Password reset route
router.post('/reset-password', resetPassword);

// Email verification route
router.get('/verify-email/:token', verifyEmail);

module.exports = router;
