import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import routes from './routes';

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '.env') });

// Validate required environment variables
const requiredEnvVars = ['PORT', 'MONGODB_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}

const app: Express = express();
const PORT: string | number = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api", routes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Farmerzon Api:  http://localhost:${PORT}`);
}); 