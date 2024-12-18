const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION } = process.env; // Define JWT secret and expiration in .env

// Middleware to check if the user has the required role
const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];  // Extract token from Authorization header

        if (!token) {
            return res.status(401).json({ error: 'Authentication failed: No token provided' });
        }

        try {
            // Verify the token and extract the payload
            const decoded = jwt.verify(token, JWT_SECRET);

            //console.log(decoded);
            
            // Check if the role matches the required role
            if (decoded.role !== requiredRole) {
                return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
            }

            // Attach user info to the request object
            req.user = decoded;
            next();  // Proceed to the next middleware/route handler
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({ error: 'Authentication failed: Invalid or expired token' });
        }
    };
};

module.exports = authorizeRole;
