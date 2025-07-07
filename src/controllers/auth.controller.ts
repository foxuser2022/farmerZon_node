import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/Users.schema";
import { IUser } from "../interfaces/IUser.interface";
import { registerSchema } from "../validations/auth/register.validation";
import { loginSchema } from "../validations/auth/login.validation";


export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }

        const { name, email, Phone, registerAs, password, cpassword } = value;


        if (password !== cpassword) {
            res.status(400).json({ message: "Passwords do not match" });
            return;
        }

        const isUser = await Users.findOne({ email });
        if (isUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user: IUser = await Users.create({
            name,
            email,
            Phone,
            role: registerAs,
            password: hashedPassword,
        });

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                Phone: user.Phone,
                registerAs: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }

        const { email, password, loginAs } = value


        // Find user
        const user = await Users.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        if (user.role != loginAs) {
            res.status(400).json({ message: "failed to login" });
            return;
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "You have logged in successfully.",
            token,
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error" });
    }
};
