import express from 'express';

const router = express.Router();

// Mock / Seed Data matching the user's reference image (C-STYLE)
const categoriesData = [
  { id: 'cat-1', name: 'Tops', slug: 'tops', image: 'https://images.pexels.com/photos/7703038/pexels-photo-7703038.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
  { id: 'cat-2', name: 'Bottoms', slug: 'bottoms', image: 'https://images.pexels.com/photos/8619007/pexels-photo-8619007.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
  { id: 'cat-3', name: 'Dresses', slug: 'dresses', image: 'https://images.pexels.com/photos/2235071/pexels-photo-2235071.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
  { id: 'cat-4', name: 'Shoes', slug: 'shoes', image: 'https://images.pexels.com/photos/1456733/pexels-photo-1456733.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
  { id: 'cat-5', name: 'Accessories', slug: 'accessories', image: 'https://images.pexels.com/photos/1340641/pexels-photo-1340641.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
  { id: 'cat-6', name: 'Men', slug: 'men', image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
  { id: 'cat-7', name: 'Sale', slug: 'sale', image: '', is_sale: true }
];

const newArrivalsProducts = [
  {
    id: 'cstyle-1',
    name: 'Ribbed Knit Top',
    slug: 'ribbed-knit-top',
    brand: 'C-STYLE',
    description: 'Soft ribbed cotton knit top with refined neckline and flattering body-con fit.',
    price: 29.90,
    rating: 4.9,
    review_count: 84,
    images: ['https://images.pexels.com/photos/7703038/pexels-photo-7703038.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'],
    category_id: 'tops',
    is_new_arrival: true,
    colors: [
      { name: 'Cream', hex: '#EAE6DF' },
      { name: 'Black', hex: '#1C1917' },
      { name: 'Olive', hex: '#606856' },
      { name: 'Dusty Pink', hex: '#D9B3A7' }
    ],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'cstyle-2',
    name: 'Wide-Leg Jeans',
    slug: 'wide-leg-jeans',
    brand: 'C-STYLE',
    description: 'High-waisted relaxed wide-leg denim jeans crafted from premium organic cotton.',
    price: 49.90,
    rating: 4.8,
    review_count: 112,
    images: ['https://images.pexels.com/photos/8619007/pexels-photo-8619007.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'],
    category_id: 'bottoms',
    is_new_arrival: true,
    colors: [
      { name: 'Light Wash', hex: '#8DA9C4' },
      { name: 'Classic Blue', hex: '#4A7A96' },
      { name: 'Dark Indigo', hex: '#2C3E50' }
    ],
    sizes: ['24', '26', '28', '30', '32']
  },
  {
    id: 'cstyle-3',
    name: 'Linen Blend Shirt',
    slug: 'linen-blend-shirt',
    brand: 'C-STYLE',
    description: 'Breathable relaxed linen button-down shirt designed for everyday sophistication.',
    price: 34.90,
    rating: 4.7,
    review_count: 67,
    images: ['https://images.pexels.com/photos/2235071/pexels-photo-2235071.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'],
    category_id: 'tops',
    is_new_arrival: true,
    colors: [
      { name: 'Ivory White', hex: '#F5F5EC' },
      { name: 'Beige Sand', hex: '#D7C4B7' },
      { name: 'Sage Green', hex: '#8A9A86' }
    ],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'cstyle-4',
    name: 'Oversized Sweater',
    slug: 'oversized-sweater',
    brand: 'C-STYLE',
    description: 'Cozy heavy-knit crewneck sweater with dropped shoulders and subtle rib detailing.',
    price: 39.90,
    rating: 4.9,
    review_count: 145,
    images: ['https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'],
    category_id: 'tops',
    is_new_arrival: true,
    colors: [
      { name: 'Charcoal', hex: '#2B2D42' },
      { name: 'Navy Blue', hex: '#1B263B' },
      { name: 'Heather Grey', hex: '#8D99AE' }
    ],
    sizes: ['S', 'M', 'L']
  },
  {
    id: 'cstyle-5',
    name: 'Classic Sneakers',
    slug: 'classic-sneakers',
    brand: 'C-STYLE',
    description: 'Clean minimalist low-top leather sneakers with cushioned insoles for all-day comfort.',
    price: 59.90,
    rating: 4.9,
    review_count: 210,
    images: ['https://images.pexels.com/photos/1456733/pexels-photo-1456733.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'],
    category_id: 'shoes',
    is_new_arrival: true,
    colors: [
      { name: 'Off-White', hex: '#EAE8E1' },
      { name: 'Midnight Black', hex: '#1A1A1A' },
      { name: 'Warm Taupe', hex: '#9A8C98' }
    ],
    sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10']
  },
  {
    id: 'cstyle-6',
    name: 'Shoulder Bag',
    slug: 'shoulder-bag',
    brand: 'C-STYLE',
    description: 'Structured vegan leather handbag with magnetic flap closure and gold-tone hardware.',
    price: 24.90,
    rating: 4.8,
    review_count: 98,
    images: ['https://images.pexels.com/photos/1340641/pexels-photo-1340641.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'],
    category_id: 'accessories',
    is_new_arrival: true,
    colors: [
      { name: 'Tan Brown', hex: '#B5838D' },
      { name: 'Deep Espresso', hex: '#4A3E3D' },
      { name: 'Onyx Black', hex: '#1A1A1A' }
    ],
    sizes: ['One Size']
  }
];

const collectionsData = [
  {
    id: 'col-1',
    title: 'The Everyday Edit',
    subtitle: 'Effortless pieces for your daily look',
    image: 'https://images.pexels.com/photos/8619007/pexels-photo-8619007.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'
  },
  {
    id: 'col-2',
    title: 'Weekend Vibes',
    subtitle: 'Relaxed styles for your downtime',
    image: 'https://images.pexels.com/photos/7703038/pexels-photo-7703038.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'
  },
  {
    id: 'col-3',
    title: 'Date Night',
    subtitle: 'Bold & sleek look for evening out',
    image: 'https://images.pexels.com/photos/2235071/pexels-photo-2235071.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'
  },
  {
    id: 'col-4',
    title: 'Power Tailoring',
    subtitle: 'Tailored fits that mean business',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'
  }
];

// GET /api/categories
router.get('/categories', (req, res) => {
  res.json({ success: true, data: categoriesData });
});

// GET /api/products
router.get('/products', (req, res) => {
  const { category, search, new_arrivals } = req.query;
  let result = [...newArrivalsProducts];

  if (category) {
    result = result.filter(p => p.category_id.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  if (new_arrivals === 'true') {
    result = result.filter(p => p.is_new_arrival);
  }

  res.json({ success: true, count: result.length, data: result });
});

// GET /api/products/:slug
router.get('/products/:slug', (req, res) => {
  const product = newArrivalsProducts.find(p => p.slug === req.params.slug || p.id === req.params.slug);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

// GET /api/collections
router.get('/collections', (req, res) => {
  res.json({ success: true, data: collectionsData });
});

// POST /api/ai-assistant
router.post('/ai-assistant', (req, res) => {
  const { prompt } = req.body;
  const text = (prompt || '').toLowerCase();

  let responseText = "I'm happy to assist you! Explore our latest C-STYLE drops, featuring timeless tailoring and sleek essentials.";
  
  if (text.includes('item') || text.includes('find') || text.includes('top') || text.includes('jeans')) {
    responseText = "Here are top items trending right now: Ribbed Knit Top ($29.90), Wide-Leg Jeans ($49.90), and Linen Blend Shirt ($34.90). Would you like me to filter by size or color?";
  } else if (text.includes('style') || text.includes('occasion') || text.includes('outfit')) {
    responseText = "For a chic date night look, match our Ribbed Knit Top with Wide-Leg Jeans and the Shoulder Bag ($24.90). Add Classic Sneakers ($59.90) for an effortless touch!";
  } else if (text.includes('vibe') || text.includes('check')) {
    responseText = "Current vibe check: Minimalist Luxury & Timeless Comfort. Elevated neutrals, soft knits, and clean silhouettes!";
  } else if (text.includes('offer') || text.includes('discount') || text.includes('student')) {
    responseText = "Students get 10% off with instant verification! Also, enjoy FREE shipping on all orders over $75.";
  } else if (text.includes('store') || text.includes('near')) {
    responseText = "We have C-STYLE flagships in major cities! Check out 'STORES NEAR YOU' in our location finder to visit us in person.";
  }

  res.json({
    success: true,
    reply: responseText,
    recommendedProducts: newArrivalsProducts.slice(0, 3)
  });
});

export default router;
