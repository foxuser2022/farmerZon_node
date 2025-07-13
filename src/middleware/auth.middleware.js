import jwt from 'jsonwebtoken';
import Users from '../models/Users.schema.js';

// Verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

// General auth middleware for messages
export const authMiddleware = async (req, res, next) => {
    try {
        await verifyToken(req, res, async () => {
            const user = await Users.findById(req.user.userId);
            if (!user) {
                return res.status(401).json({ message: 'Invalid token: user not found.' });
            }
            req.user.id = req.user.userId; // Set id for consistency
            next();
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
}; 