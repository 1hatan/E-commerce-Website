/*
# E-Commerce Platform Schema

1. Overview
Creates the complete database schema for a full-stack e-commerce platform: product catalog, reviews, cart, wishlist, orders, shipping addresses, and user profiles. Uses Supabase Auth for authentication. Admin role is stored in `raw_app_meta_data` (user-immutable) and checked via a helper function.

2. New Tables
- `categories` — product categories (name, slug, image, parent)
- `products` — catalog items (name, slug, description, price, discount_price, stock, sku, brand, category, images, colors, sizes, specs, featured flag, rating fields)
- `reviews` — product reviews (user, product, rating, comment)
- `carts` — per-user cart header
- `cart_items` — cart line items (cart, product, variant, qty)
- `wishlists` — per-user wishlist header
- `wishlist_items` — wishlist line items
- `addresses` — user shipping addresses
- `orders` — order header (user, totals, statuses, shipping address snapshot, payment id)
- `order_items` — order line items (order, product snapshot, qty, price, variant)
- `profiles` — public user profile (full name, phone) keyed to auth.users

3. Security
- RLS enabled on every table.
- Products/categories: public read (anon + authenticated), admin-only writes.
- Reviews: public read; authenticated insert (must own); delete own or admin.
- Carts/wishlists/addresses/orders: owner-scoped CRUD for authenticated users.
- Admin actions gated by `is_admin()` helper checking `raw_app_meta_data.role = 'admin'`.
- `is_admin()` is a SECURITY DEFINER function so it can read auth.users metadata.

4. Indexes
- products: category_id, slug, featured, is_active, brand, rating
- reviews: product_id, user_id
- carts/wishlists/orders: user_id
- order_items: order_id
- addresses: user_id

5. Notes
- `profiles.id` references `auth.users.id` so each auth user has exactly one profile row.
- A trigger auto-creates a profile row on new auth user signup.
- Owner columns default to `auth.uid()` so client inserts omitting the owner still pass RLS.
- Order item snapshots store product name/price/image at purchase time so order history survives product edits.
*/

-- Helper: is_admin() checks the requesting user's app metadata role.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- ============ CATEGORIES ============
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,
  parent_id uuid references public.categories(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "public_read_categories" on public.categories;
create policy "public_read_categories" on public.categories
  for select to anon, authenticated using (true);

drop policy if exists "admin_insert_categories" on public.categories;
create policy "admin_insert_categories" on public.categories
  for insert to authenticated with check (public.is_admin());

drop policy if exists "admin_update_categories" on public.categories;
create policy "admin_update_categories" on public.categories
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_delete_categories" on public.categories;
create policy "admin_delete_categories" on public.categories
  for delete to authenticated using (public.is_admin());

-- ============ PRODUCTS ============
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null,
  discount_price numeric(10,2),
  stock integer not null default 0,
  sku text,
  brand text,
  category_id uuid references public.categories(id) on delete set null,
  images text[] not null default '{}',
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  specifications jsonb not null default '{}'::jsonb,
  featured boolean not null default false,
  is_active boolean not null default true,
  rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "public_read_products" on public.products;
create policy "public_read_products" on public.products
  for select to anon, authenticated using (true);

drop policy if exists "admin_insert_products" on public.products;
create policy "admin_insert_products" on public.products
  for insert to authenticated with check (public.is_admin());

drop policy if exists "admin_update_products" on public.products;
create policy "admin_update_products" on public.products
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_delete_products" on public.products;
create policy "admin_delete_products" on public.products
  for delete to authenticated using (public.is_admin());

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_featured on public.products(featured);
create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_products_brand on public.products(brand);
create index if not exists idx_products_rating on public.products(rating);

-- ============ REVIEWS ============
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "public_read_reviews" on public.reviews;
create policy "public_read_reviews" on public.reviews
  for select to anon, authenticated using (true);

drop policy if exists "user_insert_reviews" on public.reviews;
create policy "user_insert_reviews" on public.reviews
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "user_delete_reviews" on public.reviews;
create policy "user_delete_reviews" on public.reviews
  for delete to authenticated using (auth.uid() = user_id or public.is_admin());

create index if not exists idx_reviews_product on public.reviews(product_id);
create index if not exists idx_reviews_user on public.reviews(user_id);

-- ============ PROFILES ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "user_read_own_profile" on public.profiles;
create policy "user_read_own_profile" on public.profiles
  for select to authenticated using (auth.uid() = id or public.is_admin());

drop policy if exists "user_update_own_profile" on public.profiles;
create policy "user_update_own_profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "user_insert_own_profile" on public.profiles;
create policy "user_insert_own_profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "admin_read_all_profiles" on public.profiles;
create policy "admin_read_all_profiles" on public.profiles
  for select to authenticated using (public.is_admin());

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ ADDRESSES ============
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.addresses enable row level security;

drop policy if exists "user_select_addresses" on public.addresses;
create policy "user_select_addresses" on public.addresses
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "user_insert_addresses" on public.addresses;
create policy "user_insert_addresses" on public.addresses
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "user_update_addresses" on public.addresses;
create policy "user_update_addresses" on public.addresses
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_delete_addresses" on public.addresses;
create policy "user_delete_addresses" on public.addresses
  for delete to authenticated using (auth.uid() = user_id);

create index if not exists idx_addresses_user on public.addresses(user_id);

-- ============ CARTS ============
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.carts enable row level security;

drop policy if exists "user_select_carts" on public.carts;
create policy "user_select_carts" on public.carts
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "user_insert_carts" on public.carts;
create policy "user_insert_carts" on public.carts
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "user_update_carts" on public.carts;
create policy "user_update_carts" on public.carts
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_delete_carts" on public.carts;
create policy "user_delete_carts" on public.carts
  for delete to authenticated using (auth.uid() = user_id);

create index if not exists idx_carts_user on public.carts(user_id);

-- ============ CART ITEMS ============
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  color text,
  size text,
  created_at timestamptz not null default now()
);

alter table public.cart_items enable row level security;

drop policy if exists "user_select_cart_items" on public.cart_items;
create policy "user_select_cart_items" on public.cart_items
  for select to authenticated using (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
  );

drop policy if exists "user_insert_cart_items" on public.cart_items;
create policy "user_insert_cart_items" on public.cart_items
  for insert to authenticated with check (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
  );

drop policy if exists "user_update_cart_items" on public.cart_items;
create policy "user_update_cart_items" on public.cart_items
  for update to authenticated using (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
  );

drop policy if exists "user_delete_cart_items" on public.cart_items;
create policy "user_delete_cart_items" on public.cart_items
  for delete to authenticated using (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
  );

create index if not exists idx_cart_items_cart on public.cart_items(cart_id);
create index if not exists idx_cart_items_product on public.cart_items(product_id);

-- ============ WISHLISTS ============
create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.wishlists enable row level security;

drop policy if exists "user_select_wishlists" on public.wishlists;
create policy "user_select_wishlists" on public.wishlists
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "user_insert_wishlists" on public.wishlists;
create policy "user_insert_wishlists" on public.wishlists
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "user_update_wishlists" on public.wishlists;
create policy "user_update_wishlists" on public.wishlists
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_delete_wishlists" on public.wishlists;
create policy "user_delete_wishlists" on public.wishlists
  for delete to authenticated using (auth.uid() = user_id);

create index if not exists idx_wishlists_user on public.wishlists(user_id);

-- ============ WISHLIST ITEMS ============
create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references public.wishlists(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.wishlist_items enable row level security;

drop policy if exists "user_select_wishlist_items" on public.wishlist_items;
create policy "user_select_wishlist_items" on public.wishlist_items
  for select to authenticated using (
    exists (select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = auth.uid())
  );

drop policy if exists "user_insert_wishlist_items" on public.wishlist_items;
create policy "user_insert_wishlist_items" on public.wishlist_items
  for insert to authenticated with check (
    exists (select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = auth.uid())
  );

drop policy if exists "user_delete_wishlist_items" on public.wishlist_items;
create policy "user_delete_wishlist_items" on public.wishlist_items
  for delete to authenticated using (
    exists (select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = auth.uid())
  );

create index if not exists idx_wishlist_items_wishlist on public.wishlist_items(wishlist_id);
create index if not exists idx_wishlist_items_product on public.wishlist_items(product_id);

-- ============ ORDERS ============
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  order_number text not null unique,
  status text not null default 'pending' check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  payment_id text,
  payment_method text default 'razorpay',
  subtotal numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  shipping_cost numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  shipping_address jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "user_select_orders" on public.orders;
create policy "user_select_orders" on public.orders
  for select to authenticated using (auth.uid() = user_id or public.is_admin());

drop policy if exists "user_insert_orders" on public.orders;
create policy "user_insert_orders" on public.orders
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "admin_update_orders" on public.orders;
create policy "admin_update_orders" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "user_update_orders" on public.orders;
create policy "user_update_orders" on public.orders
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created on public.orders(created_at);

-- ============ ORDER ITEMS ============
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  price numeric(10,2) not null,
  quantity integer not null check (quantity > 0),
  color text,
  size text
);

alter table public.order_items enable row level security;

drop policy if exists "user_select_order_items" on public.order_items;
create policy "user_select_order_items" on public.order_items
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
  );

drop policy if exists "user_insert_order_items" on public.order_items;
create policy "user_insert_order_items" on public.order_items
  for insert to authenticated with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_order_items_product on public.order_items(product_id);

-- ============ UPDATED_AT TRIGGER ============
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['categories','products','profiles','addresses','carts','orders'] loop
    execute format('drop trigger if exists set_updated_at on public.%I;', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at();', t);
  end loop;
end$$;
