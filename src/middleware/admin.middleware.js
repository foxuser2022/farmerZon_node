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

// Verify Admin token
export const verifyAdmin = async (req, res, next) => {
    try {
        await verifyToken(req, res, async () => {
            const user = await Users.findById(req.user.userId);
            if (!user || user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied. Admin role required.' });
            }
            next();
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
}; 