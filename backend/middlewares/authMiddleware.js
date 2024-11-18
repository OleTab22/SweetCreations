const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            console.warn('Access attempt without token');
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        if (!authHeader.startsWith('Bearer ')) {
            console.warn('Invalid token format');
            return res.status(401).json({ message: 'Invalid token format' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        if (error.name === 'TokenExpiredError') {
            console.warn('Expired token used');
            return res.status(401).json({ message: 'Token expired' });
        }
        console.warn('Invalid token used');
        res.status(401).json({ message: 'Invalid token' });
    }
};
