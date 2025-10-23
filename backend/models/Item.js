import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  
  // --- YEH NAYA FIELD ADD KIYA GAYA HAI ---
  countInStock: {
    type: Number,
    required: true,
    default: 0 // Default stock 0 rakhein
  },
  // ----------------------------------------

  vendors: [{
    name: String,
    price: Number,
  }],
  healthyAlternativeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
export default Item;