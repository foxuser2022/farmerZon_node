import { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    Phone?: string;  // Optional since it's optional in the validation schema
    role: 'seller' | 'buyer';
    createdAt: Date;
    updatedAt: Date;
} 