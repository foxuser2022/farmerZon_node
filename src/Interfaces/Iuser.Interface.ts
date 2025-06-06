export interface IUser extends Document {
    _id: any;
    name: string;
    email: string;
    password: string;
    role: 'seller' | 'buyer';
    createdAt: Date;
    updatedAt: Date;
}
