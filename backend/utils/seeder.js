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
    imageUrl: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    price: 45,
    imageUrl: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Organic Milk',
    category: 'Dairy',
    price: 60,
    imageUrl: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Coca-Cola Can',
    category: 'Beverages',
    price: 40,
    imageUrl: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Fresh Onions',
    category: 'Vegetables',
    price: 30,
    imageUrl: 'https://images.pexels.com/photos/6635921/pexels-photo-6635921.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Farm Potatoes',
    category: 'Vegetables',
    price: 40,
    imageUrl: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Vine Tomatoes',
    category: 'Vegetables',
    price: 50,
    imageUrl: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Classic Lays Chips',
    category: 'Snacks',
    price: 20,
    imageUrl: 'https://images.pexels.com/photos/6783351/pexels-photo-6783351.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Basmati Rice (1kg)',
    category: 'Pantry',
    price: 150,
    imageUrl: 'https://images.pexels.com/photos/164054/pexels-photo-164054.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Extra Virgin Olive Oil',
    category: 'Pantry',
    price: 450,
    imageUrl: 'https://images.pexels.com/photos/33789/olive-oil-olive-fresh-spheres.jpg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Amul Cheese Slices',
    category: 'Dairy',
    price: 110,
    imageUrl: 'https://images.pexels.com/photos/3621168/pexels-photo-3621168.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Plain Yogurt (400g)',
    category: 'Dairy',
    price: 75,
    imageUrl: 'https://images.pexels.com/photos/4033232/pexels-photo-4033232.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Salted Butter (100g)',
    category: 'Dairy',
    price: 55,
    imageUrl: 'https://images.pexels.com/photos/5969512/pexels-photo-5969512.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Penne Pasta (500g)',
    category: 'Pantry',
    price: 90,
    imageUrl: 'https://images.pexels.com/photos/1487511/pexels-photo-1487511.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'All-Purpose Flour (1kg)',
    category: 'Pantry',
    price: 60,
    imageUrl: 'https://images.pexels.com/photos/8771143/pexels-photo-8771143.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Instant Coffee Powder',
    category: 'Beverages',
    price: 250,
    imageUrl: 'https://images.pexels.com/photos/373966/pexels-photo-373966.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Chocolate Chip Cookies',
    category: 'Snacks',
    price: 80,
    imageUrl: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Antibacterial Bar Soap',
    category: 'Personal Care',
    price: 40,
    imageUrl: 'https://images.pexels.com/photos/4174765/pexels-photo-4174765.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Herbal Shampoo (250ml)',
    category: 'Personal Care',
    price: 180,
    imageUrl: 'https://images.pexels.com/photos/7692196/pexels-photo-7692196.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Fluoride Toothpaste',
    category: 'Personal Care',
    price: 95,
    imageUrl: 'https://images.pexels.com/photos/4240801/pexels-photo-4240801.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Dishwashing Liquid',
    category: 'Household',
    price: 115,
    imageUrl: 'https://images.pexels.com/photos/4239014/pexels-photo-4239014.jpeg?auto=compress&cs=tinysrgb&w=600',
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