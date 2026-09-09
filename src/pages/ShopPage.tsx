import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Home } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import QuickViewModal from '@/components/product/QuickViewModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'bestselling', label: 'Best Selling' },
];

const PRICE_RANGES = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: 'Above $100', min: 100, max: 9999 },
];

const MOCK_SHOP_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Velocity Runner 3',
    slug: 'velocity-runner-3',
    brand: 'KINETIX',
    description: 'High performance running sneakers engineered for speed and comfort.',
    price: 12999,
    discount_price: 9999,
    stock: 25,
    rating: 4.8,
    review_count: 642,
    images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    category_id: 'shoes',
    featured: true,
    is_active: true,
    colors: ['Red', 'Black'],
    sizes: ['UK 8', 'UK 9'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Hydra Glow Vitamin C Serum',
    slug: 'hydra-glow-vitamin-c-serum',
    brand: 'LUMIÈRE',
    description: 'Nourishing antioxidant serum for radiant, hydrated skin.',
    price: 4499,
    discount_price: 3299,
    stock: 50,
    rating: 4.6,
    review_count: 524,
    images: ['https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    category_id: 'beauty',
    featured: true,
    is_active: true,
    colors: [],
    sizes: ['30ml'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Pulse Pro Wireless Earbuds',
    slug: 'pulse-pro-wireless-earbuds',
    brand: 'SONORA',
    description: 'Active noise cancelling wireless earbuds with spatial audio.',
    price: 12999,
    discount_price: 8999,
    stock: 30,
    rating: 4.5,
    review_count: 502,
    images: ['https://images.pexels.com/photos/3780104/pexels-photo-3780104.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    category_id: 'electronics',
    featured: true,
    is_active: true,
    colors: ['White', 'Black'],
    sizes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Aurora ANC Wireless Headphones',
    slug: 'aurora-anc-wireless-headphones',
    brand: 'SONORA',
    description: 'Premium over-ear headphones with 40-hour battery life.',
    price: 24999,
    discount_price: 18999,
    stock: 15,
    rating: 4.7,
    review_count: 318,
    images: ['https://images.pexels.com/photos/7772548/pexels-photo-7772548.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    category_id: 'electronics',
    featured: true,
    is_active: true,
    colors: ['Black'],
    sizes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Atlas Merino Crew Sweater',
    slug: 'atlas-merino-crew-sweater',
    brand: 'ATLAS & CO',
    description: 'Ultrafine merino wool crewneck sweater for timeless style.',
    price: 7999,
    discount_price: 5999,
    stock: 20,
    rating: 4.6,
    review_count: 231,
    images: ['https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    category_id: 'mens-fashion',
    featured: false,
    is_active: true,
    colors: ['Beige'],
    sizes: ['M', 'L'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Meridian Smartwatch Series 6',
    slug: 'meridian-smartwatch-series-6',
    brand: 'MERIDIAN',
    description: 'Precision health tracking smartwatch with sapphire glass display.',
    price: 31999,
    discount_price: 26999,
    stock: 10,
    rating: 4.6,
    review_count: 214,
    images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    category_id: 'accessories',
    featured: false,
    is_active: true,
    colors: ['Silver'],
    sizes: ['42mm'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Ridgeline Selvedge Denim',
    slug: 'ridgeline-selvedge-denim',
    brand: 'RIDGELINE',
    description: '14oz Japanese selvedge denim jeans crafted for endurance.',
    price: 9999,
    discount_price: 7499,
    stock: 18,
    rating: 4.5,
    review_count: 176,
    images: ['https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    category_id: 'mens-fashion',
    featured: false,
    is_active: true,
    colors: ['Dark Indigo'],
    sizes: ['32'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Mira Silk Slip Dress',
    slug: 'mira-silk-slip-dress',
    brand: 'MIRA STUDIO',
    description: '100% Mulberry silk slip dress with bias cut drape.',
    price: 15999,
    discount_price: 11999,
    stock: 12,
    rating: 4.7,
    review_count: 164,
    images: ['https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    category_id: 'womens-fashion',
    featured: false,
    is_active: true,
    colors: ['Red'],
    sizes: ['S'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const PAGE_SIZE = 12;

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);

  const query = searchParams.get('q') ?? '';
  const categorySlug = searchParams.get('category') ?? '';
  const sortBy = searchParams.get('sort') ?? 'featured';

  const selectedPriceRanges = useMemo(() => searchParams.getAll('price'), [searchParams]);
  const selectedBrands = useMemo(() => searchParams.getAll('brand'), [searchParams]);
  const selectedRating = searchParams.get('rating') ?? '';
  const selectedColors = useMemo(() => searchParams.getAll('color'), [searchParams]);
  const selectedSizes = useMemo(() => searchParams.getAll('size'), [searchParams]);

  const [allBrands, setAllBrands] = useState<string[]>(['C-STYLE', 'KINETIX', 'LUMIÈRE', 'SONORA']);
  const [allColors, setAllColors] = useState<string[]>(['Cream', 'Black', 'Olive', 'Light Wash', 'Rose Red']);
  const [allSizes, setAllSizes] = useState<string[]>(['XS', 'S', 'M', 'L', 'XL']);

  useEffect(() => {
    supabase.from('categories').select('*').eq('is_active', true).is('parent_id', null).order('name')
      .then(({ data }) => {
        if (data && data.length > 0) setCategories(data as Category[]);
        else {
          setCategories([
            { id: 'beauty', name: 'Beauty', slug: 'beauty', is_active: true, created_at: '' },
            { id: 'electronics', name: 'Electronics', slug: 'electronics', is_active: true, created_at: '' },
            { id: 'fashion', name: 'Fashion', slug: 'fashion', is_active: true, created_at: '' },
            { id: 'shoes', name: 'Shoes', slug: 'shoes', is_active: true, created_at: '' },
            { id: 'accessories', name: 'Accessories', slug: 'accessories', is_active: true, created_at: '' },
          ]);
        }
      });
  }, []);

  useEffect(() => {
    supabase.from('products').select('brand, colors, sizes').eq('is_active', true).then(({ data }) => {
      if (data && data.length > 0) {
        const brands = new Set<string>();
        const colors = new Set<string>();
        const sizes = new Set<string>();
        data.forEach((p) => {
          if (p.brand) brands.add(p.brand);
          p.colors?.forEach((c: string) => colors.add(c));
          p.sizes?.forEach((s: string) => sizes.add(s));
        });
        if (brands.size) setAllBrands(Array.from(brands).sort());
        if (colors.size) setAllColors(Array.from(colors).sort());
        if (sizes.size) setAllSizes(Array.from(sizes).sort());
      }
    });
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      // 1-second timeout wrapper to prevent hanging spinners
      const fetchPromise = (async () => {
        let dbQuery = supabase.from('products').select('*, category:categories(*)').eq('is_active', true);

        if (query) {
          dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`);
        }

        if (categorySlug) {
          const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).maybeSingle();
          if (cat) {
            const { data: subcats } = await supabase.from('categories').select('id').eq('parent_id', cat.id);
            const categoryIds = [cat.id, ...(subcats?.map((s) => s.id) ?? [])];
            dbQuery = dbQuery.in('category_id', categoryIds);
          }
        }

        if (selectedBrands.length > 0) {
          dbQuery = dbQuery.in('brand', selectedBrands);
        }

        if (selectedColors.length > 0) {
          dbQuery = dbQuery.overlaps('colors', selectedColors);
        }

        if (selectedSizes.length > 0) {
          dbQuery = dbQuery.overlaps('sizes', selectedSizes);
        }

        if (selectedRating) {
          dbQuery = dbQuery.gte('rating', parseInt(selectedRating));
        }

        if (selectedPriceRanges.length > 0) {
          const ranges = PRICE_RANGES.filter((r) => selectedPriceRanges.includes(r.label));
          if (ranges.length === 1) {
            dbQuery = dbQuery.gte('price', ranges[0].min).lte('price', ranges[0].max);
          } else if (ranges.length > 1) {
            const min = Math.min(...ranges.map((r) => r.min));
            const max = Math.max(...ranges.map((r) => r.max));
            dbQuery = dbQuery.gte('price', min).lte('price', max);
          }
        }

        switch (sortBy) {
          case 'newest': dbQuery = dbQuery.order('created_at', { ascending: false }); break;
          case 'price_asc': dbQuery = dbQuery.order('price', { ascending: true }); break;
          case 'price_desc': dbQuery = dbQuery.order('price', { ascending: false }); break;
          case 'rating': dbQuery = dbQuery.order('rating', { ascending: false }); break;
          case 'bestselling': dbQuery = dbQuery.order('review_count', { ascending: false }); break;
          default: dbQuery = dbQuery.order('featured', { ascending: false }).order('rating', { ascending: false });
        }

        const { data } = await dbQuery.range(0, PAGE_SIZE * 3 - 1);
        return data as Product[];
      })();

      const timeoutPromise = new Promise<Product[]>((_, reject) =>
        setTimeout(() => reject(new Error('Fetch timeout')), 1000)
      );

      const data = await Promise.race([fetchPromise, timeoutPromise]);

      if (data && data.length > 0) {
        setProducts(data);
      } else {
        // Fallback filter locally
        let list = [...MOCK_SHOP_PRODUCTS];
        if (categorySlug) {
          list = list.filter((p) => p.category_id === categorySlug || (p.category_id && p.category_id.includes(categorySlug)));
        }
        if (query) {
          list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
        }
        setProducts(list.length > 0 ? list : MOCK_SHOP_PRODUCTS);
      }
    } catch {
      // Fallback filter locally on error or timeout
      let list = [...MOCK_SHOP_PRODUCTS];
      if (categorySlug) {
        list = list.filter((p) => p.category_id === categorySlug || (p.category_id && p.category_id.includes(categorySlug)));
      }
      if (query) {
        list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
      }
      setProducts(list.length > 0 ? list : MOCK_SHOP_PRODUCTS);
    } finally {
      setLoading(false);
      setPage(1);
    }
  }, [query, categorySlug, sortBy, selectedBrands, selectedColors, selectedSizes, selectedRating, selectedPriceRanges]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key: string, value: string, action: 'add' | 'remove' | 'set' = 'set') => {
    const params = new URLSearchParams(searchParams);
    if (action === 'set') {
      if (value) params.set(key, value);
      else params.delete(key);
    } else if (action === 'add') {
      params.append(key, value);
    } else if (action === 'remove') {
      const values = params.getAll(key).filter((v) => v !== value);
      params.delete(key);
      values.forEach((v) => params.append(key, v));
    }
    setSearchParams(params);
  };

  const toggleArrayParam = (key: string, value: string) => {
    const current = searchParams.getAll(key);
    if (current.includes(value)) {
      updateParam(key, value, 'remove');
    } else {
      updateParam(key, value, 'add');
    }
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const activeFilterCount = useMemo(() => {
    return selectedPriceRanges.length + selectedBrands.length + selectedColors.length + selectedSizes.length + (selectedRating ? 1 : 0) + (categorySlug ? 1 : 0);
  }, [selectedPriceRanges, selectedBrands, selectedColors, selectedSizes, selectedRating, categorySlug]);

  const currentCategory = categories.find((c) => c.slug === categorySlug);
  const visibleProducts = products.slice(0, page * PAGE_SIZE);
  const hasMore = products.length > page * PAGE_SIZE;

  return (
    <div className="container-page py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#8a8479] mb-6">
        <Link to="/" className="hover:text-[#1c1917] flex items-center gap-1"><Home className="w-3.5 h-3.5" /> Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#1c1917]">Shop</Link>
        {currentCategory && (
          <>
            <span>/</span>
            <span className="text-[#1c1917] font-semibold">{currentCategory.name}</span>
          </>
        )}
      </nav>

      {/* Title */}
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-[#1c1917]">
            {query ? `Results for "${query}"` : currentCategory ? currentCategory.name : 'All Products'}
          </h1>
          <p className="text-[#8a8479] text-sm mt-1">{products.length} products found</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="relative">
            <button onClick={() => setSortOpen(!sortOpen)} className="btn border border-[#e2dfd5] bg-white text-[#1c1917] py-2.5 px-4 text-xs font-semibold rounded-full flex items-center gap-2 shadow-sm">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort: {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#e8e6df] p-2 z-20">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { updateParam('sort', opt.value); setSortOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      sortBy === opt.value ? 'bg-[#9e5a38]/10 text-[#9e5a38]' : 'hover:bg-[#f7f5f0] text-[#1c1917]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile filter toggle */}
          <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn border border-[#e2dfd5] bg-white py-2.5 px-4 text-xs font-semibold rounded-full flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            {activeFilterCount > 0 && <span className="badge bg-[#9e5a38] text-white ml-1">{activeFilterCount}</span>}
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black/50 lg:bg-transparent lg:static lg:z-auto' : 'hidden lg:block'} lg:w-64 flex-shrink-0`}>
          <div className={`${showFilters ? 'absolute right-0 top-0 bottom-0 w-80 max-w-full overflow-y-auto bg-white p-6 lg:static lg:w-auto lg:p-0' : ''} space-y-6`}>
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h3 className="font-bold text-lg text-[#1c1917]">Filters</h3>
              <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
            </div>

            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-[#9e5a38] font-bold hover:underline">
                Clear all filters ({activeFilterCount})
              </button>
            )}

            {/* Categories */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-[#1c1917] mb-3">Categories</h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`block w-full text-left text-xs font-medium py-1 transition-colors ${
                    !categorySlug ? 'text-[#9e5a38] font-bold' : 'text-[#524d46] hover:text-[#1c1917]'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParam('category', cat.slug)}
                    className={`block w-full text-left text-xs font-medium py-1 transition-colors ${
                      categorySlug === cat.slug ? 'text-[#9e5a38] font-bold' : 'text-[#524d46] hover:text-[#1c1917]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Ranges */}
            <div className="pt-4 border-t border-[#e8e6df]">
              <h4 className="font-bold text-xs uppercase tracking-widest text-[#1c1917] mb-3">Price Range</h4>
              <div className="space-y-2">
                {PRICE_RANGES.map((range) => {
                  const checked = selectedPriceRanges.includes(range.label);
                  return (
                    <label key={range.label} className="flex items-center gap-2.5 text-xs text-[#524d46] cursor-pointer hover:text-[#1c1917]">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleArrayParam('price', range.label)}
                        className="rounded border-[#e2dfd5] text-[#9e5a38] focus:ring-[#9e5a38]"
                      />
                      <span>{range.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Brands */}
            {allBrands.length > 0 && (
              <div className="pt-4 border-t border-[#e8e6df]">
                <h4 className="font-bold text-xs uppercase tracking-widest text-[#1c1917] mb-3">Brand</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                  {allBrands.map((brand) => {
                    const checked = selectedBrands.includes(brand);
                    return (
                      <label key={brand} className="flex items-center gap-2.5 text-xs text-[#524d46] cursor-pointer hover:text-[#1c1917]">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleArrayParam('brand', brand)}
                          className="rounded border-[#e2dfd5] text-[#9e5a38] focus:ring-[#9e5a38]"
                        />
                        <span>{brand}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Colors */}
            {allColors.length > 0 && (
              <div className="pt-4 border-t border-[#e8e6df]">
                <h4 className="font-bold text-xs uppercase tracking-widest text-[#1c1917] mb-3">Color</h4>
                <div className="space-y-2 max-h-36 overflow-y-auto scrollbar-hide">
                  {allColors.map((color) => {
                    const checked = selectedColors.includes(color);
                    return (
                      <label key={color} className="flex items-center gap-2.5 text-xs text-[#524d46] cursor-pointer hover:text-[#1c1917]">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleArrayParam('color', color)}
                          className="rounded border-[#e2dfd5] text-[#9e5a38] focus:ring-[#9e5a38]"
                        />
                        <span>{color}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {allSizes.length > 0 && (
              <div className="pt-4 border-t border-[#e8e6df]">
                <h4 className="font-bold text-xs uppercase tracking-widest text-[#1c1917] mb-3">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => {
                    const checked = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => toggleArrayParam('size', size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          checked
                            ? 'bg-[#1c1917] text-white border-[#1c1917]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <LoadingSpinner label="Loading products..." />
            </div>
          ) : visibleProducts.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or search query to find what you're looking for."
              action={<button onClick={clearFilters} className="btn bg-[#9e5a38] text-white px-6 py-2.5 text-xs font-bold rounded-full">Clear Filters</button>}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {visibleProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} index={i} />
                ))}
              </div>
              {hasMore && (
                <div className="text-center mt-12">
                  <button onClick={() => setPage(page + 1)} className="btn border border-[#1c1917] text-[#1c1917] hover:bg-[#1c1917] hover:text-white px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-full">
                    Load More Products
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
