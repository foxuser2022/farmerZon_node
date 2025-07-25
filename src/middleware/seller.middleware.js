import jwt from 'jsonwebtoken';
import Users from '../models/Users.schema.js';

// Verify JWT token
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        // Attach full user info from DB
        const user = await Users.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token: user not found.' });
        }
        req.user = { userId: user._id, role: user.role, name: user.name, email: user.email };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

// Verify Seller token
export const verifySeller = async (req, res, next) => {
    await verifyToken(req, res, () => {
        if (!req.user || req.user.role !== 'seller') {
            return res.status(403).json({ message: 'Access denied. Seller account required.' });
        }
        next();
    });
}; 