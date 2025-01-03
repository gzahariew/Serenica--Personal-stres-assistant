import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errHandler.js'; // Import the error handler
 


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler); // Attach the error handler middleware

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
