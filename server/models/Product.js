import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  brand: { type: String, default: 'C-STYLE' },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount_price: { type: Number },
  stock: { type: Number, default: 50 },
  rating: { type: Number, default: 4.8 },
  review_count: { type: Number, default: 124 },
  images: [{ type: String }],
  category_id: { type: String, required: true },
  is_new_arrival: { type: Boolean, default: false },
  is_featured: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  colors: [
    {
      name: String,
      hex: String
    }
  ],
  sizes: [{ type: String }]
}, {
  timestamps: true
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
