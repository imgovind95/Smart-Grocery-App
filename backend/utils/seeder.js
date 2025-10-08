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
    imageUrl: 'https://images.pexels.com/photos/144206/pexels-photo-144206.jpeg',
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
    imageUrl: 'https://images.pexels.com/photos/30358849/pexels-photo-30358849.jpeg',
  },
  {
    name: 'Basmati Rice (1kg)',
    category: 'Pantry',
    price: 150,
    imageUrl: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg',
  },
  {
    name: 'Extra Virgin Olive Oil',
    category: 'Pantry',
    price: 450,
    imageUrl: 'https://images.pexels.com/photos/27497768/pexels-photo-27497768.jpeg',
  },
  {
    name: 'Amul Cheese Slices',
    category: 'Dairy',
    price: 110,
    imageUrl: 'https://images.pexels.com/photos/6660243/pexels-photo-6660243.jpeg',
  },
  {
    name: 'Plain Yogurt (400g)',
    category: 'Dairy',
    price: 75,
    imageUrl: 'https://images.pexels.com/photos/13466256/pexels-photo-13466256.jpeg',
  },
  {
    name: 'Salted Butter (100g)',
    category: 'Dairy',
    price: 55,
    imageUrl: 'https://images.pexels.com/photos/7965898/pexels-photo-7965898.jpeg',
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
    imageUrl: 'https://images.pexels.com/photos/4475558/pexels-photo-4475558.jpeg',
  },
  {
    name: 'Instant Coffee Powder',
    category: 'Beverages',
    price: 250,
    imageUrl: 'https://images.pexels.com/photos/6621337/pexels-photo-6621337.jpeg',
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
    imageUrl: 'https://images.pexels.com/photos/5240615/pexels-photo-5240615.jpeg',
  },
  {
    name: 'Herbal Shampoo (250ml)',
    category: 'Personal Care',
    price: 180,
    imageUrl: 'https://images.pexels.com/photos/18066458/pexels-photo-18066458.jpeg',
  },
  {
    name: 'Fluoride Toothpaste',
    category: 'Personal Care',
    price: 95,
    imageUrl: 'https://images.pexels.com/photos/5613567/pexels-photo-5613567.jpeg',
  },
  {
    name: 'Dishwashing Liquid',
    category: 'Household',
    price: 115,
    imageUrl: 'https://images.pexels.com/photos/31175781/pexels-photo-31175781.jpeg',
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