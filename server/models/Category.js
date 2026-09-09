import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  image: { type: String, required: true },
  is_sale: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
