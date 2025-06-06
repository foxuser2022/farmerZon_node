import { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'seller' | 'buyer';
    createdAt: Date;
    updatedAt: Date;
} 