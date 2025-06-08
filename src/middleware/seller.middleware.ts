import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Users from '../models/Users.schema';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

// Verify JWT token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
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

// Verify Seller token
export const verifySeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await verifyToken(req, res, async () => {
            const user = await Users.findById(req.user.userId);
            if (!user || user.role !== 'seller') {
                return res.status(403).json({ message: 'Access denied. Seller role required.' });
            }
            next();
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
}; 