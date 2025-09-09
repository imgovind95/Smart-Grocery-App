import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Item from '../models/Item.js';
import Cart from '../models/Cart.js'; // 1. Import Cart model

dotenv.config();

await connectDB();

const items = [
  {
    name: 'Fresh Apples',
    category: 'Fruits',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b69665?w=500',
  },
  {
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500',
  },
  {
    name: 'Organic Milk',
    category: 'Dairy',
    price: 60,
    imageUrl: 'https://images.unsplash.com/photo-1620189507195-68309c04c4d0?w=500',
  },
  {
    name: 'Coca-Cola Can',
    category: 'Beverages',
    price: 40,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500',
  },
  // --- New Items Below ---
  {
    name: 'Fresh Onions',
    category: 'Vegetables',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1587049352851-eac23c457b6f?w=500',
  },
  {
    name: 'Farm Potatoes',
    category: 'Vegetables',
    price: 40,
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500',
  },
  {
    name: 'Vine Tomatoes',
    category: 'Vegetables',
    price: 50,
    imageUrl: 'https://images.unsplash.com/photo-1561138241-942d458836a9?w=500',
  },
  {
    name: 'Classic Lays Chips',
    category: 'Snacks',
    price: 20,
    imageUrl: 'https://images.unsplash.com/photo-1576405234123-3801f9b3e15b?w=500',
  },
  {
    name: 'Basmati Rice (1kg)',
    category: 'Pantry',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1586201375765-c124a275f345?w=500',
  },
  {
    name: 'Extra Virgin Olive Oil',
    category: 'Pantry',
    price: 450,
    imageUrl: 'https://images.unsplash.com/photo-1626135338634-453f669a456c?w=500',
  },
  {
    name: 'Amul Cheese Slices',
    category: 'Dairy',
    price: 110,
    imageUrl: 'https://images.unsplash.com/photo-1618210988229-a417e8124239?w=500',
  },
];

const importData = async () => {
  try {
    await Item.deleteMany();
    await Cart.deleteMany(); // 2. Add this line to clear carts
    await Item.insertMany(items);
    console.log('Data Imported! ✅');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Item.deleteMany();
    await Cart.deleteMany(); // 3. Also add it here for consistency
    console.log('Data Destroyed! ❌');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}