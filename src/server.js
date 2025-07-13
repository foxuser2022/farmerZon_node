import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { setSocketIO } from './controllers/message.controller.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Validate required environment variables
const requiredEnvVars = ['PORT', 'MONGODB_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

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

// Set Socket.IO instance in message controller
setSocketIO(io);

// API Routes
app.use("/api", routes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Handle new message
  socket.on('send_message', (data) => {
    // Broadcast to all participants in the conversation
    data.participants.forEach(participantId => {
      socket.to(`user_${participantId}`).emit('receive_message', {
        message: data.message,
        conversationId: data.conversationId
      });
    });
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.to(`user_${data.toUserId}`).emit('user_typing', {
      conversationId: data.conversationId,
      userId: data.fromUserId
    });
  });

  // Handle stop typing
  socket.on('stop_typing', (data) => {
    socket.to(`user_${data.toUserId}`).emit('user_stop_typing', {
      conversationId: data.conversationId,
      userId: data.fromUserId
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
server.listen(PORT, () => {
  console.log(`Farmerzon Api:  http://localhost:${PORT}`);
}); 