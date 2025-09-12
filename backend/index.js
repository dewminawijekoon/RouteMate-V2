import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { Expo } from 'expo-server-sdk';

// Import middleware
import { errorHandler, requestLogger, corsHandler } from './middleware/index.js';

// Import database utilities
import { checkDatabaseHealth } from './utils/database.js';

// Import routes
import chatbotRoutes from './routes/chatbot.js';
import lostItemsRoutes from './routes/lostItems.js';
import usersRoutes from './routes/users.js';
import routesRoutes from './routes/routes.js';
import tripsRoutes from './routes/trips.js';
import pushRoutes from './routes/push.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server and Socket.IO
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Create Expo push notification service
const expo = new Expo();

// Make io and expo available to routes
app.locals.io = io;
app.locals.expo = expo;

// Middleware
app.use(requestLogger);
app.use(corsHandler);
app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
  const dbHealth = await checkDatabaseHealth();
  res.json({ 
    status: 'ok',
    database: dbHealth,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/chatbot', chatbotRoutes);
app.use('/lost-items', lostItemsRoutes);
app.use('/users', usersRoutes);
app.use('/routes', routesRoutes);
app.use('/trips', tripsRoutes);
app.use('/push', pushRoutes);

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Handle location updates from buses
  socket.on('locationUpdate', (data) => {
    console.log('Received location update:', data);
    // Broadcast to all clients
    socket.broadcast.emit('locationUpdate', data);
  });
  
  // Handle trip updates
  socket.on('tripUpdate', (data) => {
    console.log('Received trip update:', data);
    socket.broadcast.emit('tripUpdate', data);
  });
  
  // Handle lost item notifications
  socket.on('lostItemUpdate', (data) => {
    console.log('Received lost item update:', data);
    socket.broadcast.emit('lostItemUpdate', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`RouteMate backend running on port ${PORT}`);
  console.log(`Socket.IO server enabled`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

