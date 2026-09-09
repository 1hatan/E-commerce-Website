import type { Product } from '@/types';

const API_BASE_URL = 'http://localhost:5000/api';

export interface ColorOption {
  name: string;
  hex: string;
}

export interface CStyleCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  is_sale?: boolean;
}

export interface CStyleCollection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

// Fallback datasets
const FALLBACK_CATEGORIES: CStyleCategory[] = [
  { id: 'cat-1', name: 'Tops', slug: 'tops', image: 'https://images.pexels.com/photos/7703038/pexels-photo-7703038.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
  { id: 'cat-2', name: 'Bottoms', slug: 'bottoms', image: 'https://images.pexels.com/photos/8619007/pexels-photo-8619007.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
  { id: 'cat-3', name: 'Dresses', slug: 'dresses', image: 'https://images.pexels.com/photos/2235071/pexels-photo-2235071.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
  { id: 'cat-4', name: 'Shoes', slug: 'shoes', image: 'https://images.pexels.com/photos/1456733/pexels-photo-1456733.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
  { id: 'cat-5', name: 'Accessories', slug: 'accessories', image: 'https://images.pexels.com/photos/1340641/pexels-photo-1340641.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
  { id: 'cat-6', name: 'Men', slug: 'men', image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
  { id: 'cat-7', name: 'Sale', slug: 'sale', image: '', is_sale: true }
];

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'cstyle-1',
    name: 'Ribbed Knit Top',
    slug: 'ribbed-knit-top',
    brand: 'C-STYLE',
    description: 'Soft ribbed cotton knit top with refined neckline and flattering body-con fit.',
    price: 29.90,
    discount_price: null,
    stock: 50,
    sku: 'CST-001',
    category_id: 'tops',
    featured: true,
    is_active: true,
    rating: 4.9,
    review_count: 84,
    images: ['https://images.pexels.com/photos/7703038/pexels-photo-7703038.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'],
    colors: [
      { name: 'Cream', hex: '#EAE6DF' },
      { name: 'Black', hex: '#1C1917' },
      { name: 'Olive', hex: '#606856' },
      { name: 'Dusty Pink', hex: '#D9B3A7' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    specifications: { Material: 'Cotton Knit', Fit: 'Regular' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cstyle-2',
    name: 'Wide-Leg Jeans',
    slug: 'wide-leg-jeans',
    brand: 'C-STYLE',
    description: 'High-waisted relaxed wide-leg denim jeans crafted from premium organic cotton.',
    price: 49.90,
    discount_price: null,
    stock: 40,
    sku: 'CST-002',
    category_id: 'bottoms',
    featured: true,
    is_active: true,
    rating: 4.8,
    review_count: 112,
    images: ['https://images.pexels.com/photos/8619007/pexels-photo-8619007.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'],
    colors: [
      { name: 'Light Wash', hex: '#8DA9C4' },
      { name: 'Classic Blue', hex: '#4A7A96' },
      { name: 'Dark Indigo', hex: '#2C3E50' }
    ],
    sizes: ['24', '26', '28', '30', '32'],
    specifications: { Material: '100% Organic Denim' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cstyle-3',
    name: 'Linen Blend Shirt',
    slug: 'linen-blend-shirt',
    brand: 'C-STYLE',
    description: 'Breathable relaxed linen button-down shirt designed for everyday sophistication.',
    price: 34.90,
    discount_price: null,
    stock: 35,
    sku: 'CST-003',
    category_id: 'tops',
    featured: true,
    is_active: true,
    rating: 4.7,
    review_count: 67,
    images: ['https://images.pexels.com/photos/2235071/pexels-photo-2235071.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'],
    colors: [
      { name: 'Ivory White', hex: '#F5F5EC' },
      { name: 'Beige Sand', hex: '#D7C4B7' },
      { name: 'Sage Green', hex: '#8A9A86' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    specifications: { Material: '55% Linen, 45% Cotton' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cstyle-4',
    name: 'Oversized Sweater',
    slug: 'oversized-sweater',
    brand: 'C-STYLE',
    description: 'Cozy heavy-knit crewneck sweater with dropped shoulders and subtle rib detailing.',
    price: 39.90,
    discount_price: null,
    stock: 30,
    sku: 'CST-004',
    category_id: 'tops',
    featured: true,
    is_active: true,
    rating: 4.9,
    review_count: 145,
    images: ['https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'],
    colors: [
      { name: 'Charcoal', hex: '#2B2D42' },
      { name: 'Navy Blue', hex: '#1B263B' },
      { name: 'Heather Grey', hex: '#8D99AE' }
    ],
    sizes: ['S', 'M', 'L'],
    specifications: { Material: 'Wool Blend' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cstyle-5',
    name: 'Classic Sneakers',
    slug: 'classic-sneakers',
    brand: 'C-STYLE',
    description: 'Clean minimalist low-top leather sneakers with cushioned insoles for all-day comfort.',
    price: 59.90,
    discount_price: null,
    stock: 50,
    sku: 'CST-005',
    category_id: 'shoes',
    featured: true,
    is_active: true,
    rating: 4.9,
    review_count: 210,
    images: ['https://images.pexels.com/photos/1456733/pexels-photo-1456733.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'],
    colors: [
      { name: 'Off-White', hex: '#EAE8E1' },
      { name: 'Midnight Black', hex: '#1A1A1A' },
      { name: 'Warm Taupe', hex: '#9A8C98' }
    ],
    sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10'],
    specifications: { Material: 'Genuine Leather' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cstyle-6',
    name: 'Shoulder Bag',
    slug: 'shoulder-bag',
    brand: 'C-STYLE',
    description: 'Structured vegan leather handbag with magnetic flap closure and gold-tone hardware.',
    price: 24.90,
    discount_price: null,
    stock: 60,
    sku: 'CST-006',
    category_id: 'accessories',
    featured: true,
    is_active: true,
    rating: 4.8,
    review_count: 98,
    images: ['https://images.pexels.com/photos/1340641/pexels-photo-1340641.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'],
    colors: [
      { name: 'Tan Brown', hex: '#B5838D' },
      { name: 'Deep Espresso', hex: '#4A3E3D' },
      { name: 'Onyx Black', hex: '#1A1A1A' }
    ],
    sizes: ['One Size'],
    specifications: { Material: 'Vegan Leather' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cstyle-7',
    name: 'Floral Midi Wrap Dress',
    slug: 'floral-midi-wrap-dress',
    brand: 'C-STYLE',
    description: 'Elegantly tailored floral wrap dress with asymmetrical hemline and short puffy sleeves.',
    price: 59.90,
    discount_price: 39.90,
    stock: 25,
    sku: 'CST-007',
    category_id: 'dresses',
    featured: true,
    is_active: true,
    rating: 4.9,
    review_count: 76,
    images: ['https://images.pexels.com/photos/2235071/pexels-photo-2235071.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'],
    colors: [
      { name: 'Rose Red', hex: '#C14953' },
      { name: 'Emerald', hex: '#2D6A4F' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    specifications: { Material: 'Viscose Blend' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cstyle-8',
    name: 'Tailored Men Blazer',
    slug: 'tailored-men-blazer',
    brand: 'C-STYLE',
    description: 'Sharp modern suit jacket crafted from breathable structured cotton linen for executive style.',
    price: 89.90,
    discount_price: 69.90,
    stock: 18,
    sku: 'CST-008',
    category_id: 'men',
    featured: true,
    is_active: true,
    rating: 4.9,
    review_count: 53,
    images: ['https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&h=800&w=600'],
    colors: [
      { name: 'Charcoal', hex: '#2B2D42' },
      { name: 'Sand Beige', hex: '#D7C4B7' }
    ],
    sizes: ['38R', '40R', '42R', '44R'],
    specifications: { Material: 'Cotton Linen' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const FALLBACK_COLLECTIONS: CStyleCollection[] = [
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

export async function fetchCategories(): Promise<CStyleCategory[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('API failed');
    const json = await res.json();
    return json.data || FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function fetchProducts(params?: { category?: string; search?: string; new_arrivals?: boolean }): Promise<Product[]> {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.new_arrivals) query.append('new_arrivals', 'true');

    const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
    if (!res.ok) throw new Error('API failed');
    const json = await res.json();
    return json.data || FALLBACK_PRODUCTS;
  } catch {
    let result = [...FALLBACK_PRODUCTS];
    if (params?.category) {
      const cat = params.category.toLowerCase();
      if (cat === 'sale') {
        result = result.filter(p => p.discount_price !== null && p.discount_price < p.price);
      } else if (cat === 'new-in') {
        result = result.filter(p => p.featured);
      } else if (cat === 'women') {
        result = result.filter(p => p.category_id !== 'men');
      } else {
        result = result.filter(p => p.category_id?.toLowerCase() === cat);
      }
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
    }
    return result;
  }
}

export async function fetchCollections(): Promise<CStyleCollection[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/collections`);
    if (!res.ok) throw new Error('API failed');
    const json = await res.json();
    return json.data || FALLBACK_COLLECTIONS;
  } catch {
    return FALLBACK_COLLECTIONS;
  }
}

export async function sendAIAssistantMessage(prompt: string): Promise<{ reply: string; recommendedProducts?: Product[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/ai-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error('AI API failed');
    const json = await res.json();
    return { reply: json.reply, recommendedProducts: json.recommendedProducts };
  } catch {
    const query = prompt.toLowerCase();
    let reply = "I'm C BETA, your C-STYLE shopping buddy! Try asking about our Wide-Leg Jeans, Ribbed Tops, or current discount codes like CSTYLE10.";
    let recs = FALLBACK_PRODUCTS.slice(0, 2);

    if (query.includes('discount') || query.includes('offer') || query.includes('coupon') || query.includes('sale')) {
      reply = "Awesome news! You can use code CSTYLE10 at checkout for 10% OFF on all items, or check out our Sale section for items up to 40% off!";
      recs = FALLBACK_PRODUCTS.filter(p => p.discount_price !== null);
    } else if (query.includes('jean') || query.includes('bottom') || query.includes('pant')) {
      reply = "Check out our organic denim Wide-Leg Jeans! High-waisted, relaxed fit, and super flattering.";
      recs = FALLBACK_PRODUCTS.filter(p => p.category_id === 'bottoms');
    } else if (query.includes('top') || query.includes('shirt') || query.includes('sweater')) {
      reply = "Our Ribbed Knit Tops and Linen Blend Shirts are bestsellers right now!";
      recs = FALLBACK_PRODUCTS.filter(p => p.category_id === 'tops');
    } else if (query.includes('shoe') || query.includes('sneaker')) {
      reply = "Step up your look with our Classic Leather Sneakers – minimalist design with memory foam insoles!";
      recs = FALLBACK_PRODUCTS.filter(p => p.category_id === 'shoes');
    } else if (query.includes('dress')) {
      reply = "Our Floral Midi Wrap Dress is perfect for summer days or date nights!";
      recs = FALLBACK_PRODUCTS.filter(p => p.category_id === 'dresses');
    }

    return { reply, recommendedProducts: recs };
  }
}

