import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  // For smart features later
  vendors: [{
    name: String,
    price: Number,
  }],
  healthyAlternativeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
export default Item;