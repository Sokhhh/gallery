const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];  // Extract token from Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = user; // Attach user data (role, id) to the request
        next(); // Proceed to the next middleware or route handler
    });
}

module.exports = authenticateJWT;
