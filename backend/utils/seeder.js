import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Item from '../models/Item.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js'; // User model import
import Recipe from '../models/Recipe.js'; // <-- RECIPE MODEL IMPORT KAREIN

dotenv.config();

await connectDB();

// Yahaan aapke saare items hain
const itemsData = [
    {
        name: 'Fresh Apples',
        category: 'Fruits',
        price: 120,
        imageUrl: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=600',
        countInStock: 20
    },
    {
        name: 'Whole Wheat Bread',
        category: 'Bakery',
        price: 45,
        imageUrl: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
        countInStock: 20
    },
    {
        name: 'Organic Milk',
        category: 'Dairy',
        price: 60,
        imageUrl: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600',
        countInStock: 20
    },
    {
        name: 'Coca-Cola Can',
        category: 'Beverages',
        price: 40,
        imageUrl: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=600',
        countInStock: 20
    },
    {
        name: 'Fresh Onions',
        category: 'Vegetables',
        price: 30,
        imageUrl: 'https://images.pexels.com/photos/144206/pexels-photo-144206.jpeg', 
        countInStock: 20
    },
    {
        name: 'Farm Potatoes',
        category: 'Vegetables',
        price: 40,
        imageUrl: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=600',
        countInStock: 20
    },
    {
        name: 'Vine Tomatoes',
        category: 'Vegetables',
        price: 50,
        imageUrl: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600',
        countInStock: 20
    },
    {
        name: 'Classic Lays Chips',
        category: 'Snacks',
        price: 20,
        imageUrl: 'https://images.pexels.com/photos/30358849/pexels-photo-30358849.jpeg', 
        countInStock: 20
    },
    {
        name: 'Basmati Rice (1kg)',
        category: 'Pantry',
        price: 150,
        imageUrl: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg', 
        countInStock: 20
    },
    {
        name: 'Extra Virgin Olive Oil',
        category: 'Pantry',
        price: 450,
        imageUrl: 'https://images.pexels.com/photos/27497768/pexels-photo-27497768.jpeg', 
        countInStock: 20
    },
    {
        name: 'Amul Cheese Slices',
        category: 'Dairy',
        price: 110,
        imageUrl: 'https://images.pexels.com/photos/6660243/pexels-photo-6660243.jpeg', 
        countInStock: 20
    },
    {
        name: 'Plain Yogurt (400g)',
        category: 'Dairy',
        price: 75,
        imageUrl: 'https://images.pexels.com/photos/13466256/pexels-photo-13466256.jpeg', 
        countInStock: 20
    },
    {
        name: 'Salted Butter (100g)',
        category: 'Dairy',
        price: 55,
        imageUrl: 'https://images.pexels.com/photos/7965898/pexels-photo-7965898.jpeg', 
        countInStock: 20
    },
    {
        name: 'Penne Pasta (500g)',
        category: 'Pantry',
        price: 90,
        imageUrl: 'https://images.pexels.com/photos/1487511/pexels-photo-1487511.jpeg?auto=compress&cs=tinysrgb&w=600',
        countInStock: 20
    },
    {
        name: 'All-Purpose Flour (1kg)',
        category: 'Pantry',
        price: 60,
        imageUrl: 'https://images.pexels.com/photos/4475558/pexels-photo-4475558.jpeg', 
        countInStock: 20
    },
    {
        name: 'Instant Coffee Powder',
        category: 'Beverages',
        price: 250,
        imageUrl: 'https://images.pexels.com/photos/6621337/pexels-photo-6621337.jpeg', 
        countInStock: 20
    },
    {
        name: 'Chocolate Chip Cookies',
        category: 'Snacks',
        price: 80,
        imageUrl: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=600',
        countInStock: 20
    },
    {
        name: 'Antibacterial Bar Soap',
        category: 'Personal Care',
        price: 40,
        imageUrl: 'https://images.pexels.com/photos/5240615/pexels-photo-5240615.jpeg', 
        countInStock: 20
    },
    {
        name: 'Herbal Shampoo (250ml)',
        category: 'Personal Care',
        price: 180,
        imageUrl: 'https://images.pexels.com/photos/18066458/pexels-photo-18066458.jpeg', 
        countInStock: 20
    },
    {
        name: 'Fluoride Toothpaste',
        category: 'Personal Care',
        price: 95,
        imageUrl: 'https://images.pexels.com/photos/5613567/pexels-photo-5613567.jpeg', 
        countInStock: 20
    },
    {
        name: 'Dishwashing Liquid',
        category: 'Household',
        price: 115,
        imageUrl: 'https://images.pexels.com/photos/31175781/pexels-photo-31175781.jpeg', 
        countInStock: 20
    },
];

const importData = async () => {
    try {
        let adminUser = await User.findOne({ role: 'seller' });
        if (!adminUser) {
            adminUser = await User.findOne();
        }

        if (!adminUser) {
            console.error('Error: No users found. Please create a user first.');
            process.exit(1);
        }

        const itemsWithSeller = itemsData.map(item => {
            return { ...item, seller: adminUser._id };
        });

        // Puraana data clear karein
        await Item.deleteMany();
        await Cart.deleteMany();
        await Recipe.deleteMany(); // <-- RECIPES BHI CLEAR KAREIN

        // Items ko insert karein taaki unki IDs mil sakein
        const createdItems = await Item.insertMany(itemsWithSeller);
        console.log('Items Imported!');

        // --- SAMPLE RECIPE ADD KARNE KA CODE ---
        // Recipe ke liye zaroori items ko 'createdItems' array se dhoondhein
        const onionItem = createdItems.find(item => item.name === 'Fresh Onions');
        const tomatoItem = createdItems.find(item => item.name === 'Vine Tomatoes');
        // Aap yahaan aur items dhoondh sakte hain

        // Check karein ki items mile ya nahi
        if (!onionItem || !tomatoItem) {
            console.error('Error: Required items (Onions, Tomatoes) not found for recipe seeding.');
        } else {
             const sampleRecipes = [
                {
                    name: 'Simple Tomato Onion Curry',
                    description: 'A basic and quick curry base.',
                    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600', // Placeholder image
                    instructions: '1. Chop onions and tomatoes.\n2. Sauté onions until golden.\n3. Add tomatoes and cook until soft.\n4. Add spices and water as needed.', // Instructions ko newline ke saath format karein
                    ingredients: [
                        { item: onionItem._id, quantity: 2, unit: 'pcs' },
                        { item: tomatoItem._id, quantity: 3, unit: 'pcs' },
                        // Yahaan dusre ingredients ke IDs add karein agar aapne unhe itemsData mein daala hai
                    ],
                    prepTime: '10 mins',
                    cookTime: '15 mins',
                    servings: 2,
                }
                // Aap yahaan aur recipes add kar sakte hain
            ];
             await Recipe.insertMany(sampleRecipes);
             console.log('Recipes Imported! ✅');
        }
        // ------------------------------------

        console.log('Data Import Complete!'); // Final success message
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Item.deleteMany();
        await Cart.deleteMany();
        await Recipe.deleteMany(); // <-- RECIPES BHI DELETE KAREIN
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