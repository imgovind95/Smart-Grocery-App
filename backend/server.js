import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import pantryRoutes from './routes/pantryRoutes.js'; // Added pantry routes import

// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

// Initialize express app
const app = express();

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow app to accept JSON data in request body
app.use(morgan('dev')); // Log HTTP requests in development mode

// --- API Routes ---
app.use('/api/auth', authRoutes);         // Authentication (login, register, forgot password)
app.use('/api/items', itemRoutes);         // Items (get all, seller add/edit/delete/get mine)
app.use('/api/cart', cartRoutes);          // Cart (get, add, remove)
app.use('/api/orders', orderRoutes);        // Orders (create, get mine)
app.use('/api/seller', sellerRoutes);       // Seller specific (stats)
app.use('/api/users', userRoutes);         // User profile (get, update)
app.use('/api/recipes', recipeRoutes);      // Recipes (get all, get by ID)
app.use('/api/pantry', pantryRoutes);       // Pantry (get, add, update, delete, suggestions)

// Basic route for checking if API is running
app.get('/', (req, res) => {
  res.send('Smart Grocery Cart API is running...');
});

// Define port
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));