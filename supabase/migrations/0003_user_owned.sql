create table public.cart (
  cart_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.product(product_id) on delete cascade,
  selected_color text,
  selected_size text,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

create table public.wishlist (
  wishlist_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.product(product_id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- "order" is a reserved word in Postgres/PostgREST; use orders/order_details instead
create table public.orders (
  order_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_date timestamptz not null default now(),
  order_status text not null default 'PENDING',
  total_price integer not null,
  shipping_address text,
  payment_method text
);

create table public.order_details (
  order_detail_id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(order_id) on delete cascade,
  product_id uuid not null references public.product(product_id),
  product_price integer not null,
  quantity integer not null,
  selected_color text,
  selected_size text
);

create table public.review (
  review_id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.product(product_id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  review_content text not null,
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

create table public.search_keyword (
  keyword_id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  keyword text not null,
  searched_at timestamptz not null default now()
);

create table public.recent_view (
  recent_view_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.product(product_id) on delete cascade,
  viewed_at timestamptz not null default now()
);

create table public.ai_styling (
  recommendation_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid references public.product(product_id),
  mood text,
  brand_name text,
  price_range text,
  recommended_at timestamptz not null default now()
);

create table public.coupon (
  coupon_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  coupon_name text not null,
  discount_rate numeric(4,2) not null,
  coupon_status text not null default 'ACTIVE',
  issued_at timestamptz not null default now(),
  expired_at timestamptz
);

create index cart_user_idx on public.cart(user_id);
create index wishlist_user_idx on public.wishlist(user_id);
create index orders_user_idx on public.orders(user_id);
create index order_details_order_idx on public.order_details(order_id);
create index review_product_idx on public.review(product_id);
create index recent_view_user_idx on public.recent_view(user_id);
create index ai_styling_user_idx on public.ai_styling(user_id);
create index coupon_user_idx on public.coupon(user_id);
