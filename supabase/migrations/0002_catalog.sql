create table public.brand (
  brand_id uuid primary key default gen_random_uuid(),
  brand_name text not null,
  brand_description text,
  brand_image text,
  brand_mood text,
  featured_product_id uuid,
  brand_logo text
);

create table public.category (
  category_id uuid primary key default gen_random_uuid(),
  category_name text not null,
  parent_category_id uuid references public.category(category_id)
);

create table public.product (
  product_id uuid primary key default gen_random_uuid(),
  product_name text not null,
  product_price integer not null,
  brand_id uuid references public.brand(brand_id),
  category_id uuid references public.category(category_id),
  product_description text,
  product_image text,
  mood text check (mood in ('Minimal','Street','Vintage','Casual','Office')),
  color text[] not null default '{}',
  size text[] not null default '{}',
  stock integer not null default 0,
  product_tag text check (product_tag in ('NEW','BEST','AI PICK','SALE','SOLD OUT')),
  discount_rate numeric(4,2) not null default 0,
  created_at timestamptz not null default now()
);

-- circular FK to product, added after product exists
alter table public.brand
  add constraint brand_featured_product_fk
  foreign key (featured_product_id) references public.product(product_id);

create index product_brand_idx on public.product(brand_id);
create index product_category_idx on public.product(category_id);
create index product_mood_idx on public.product(mood);
create index product_tag_idx on public.product(product_tag);
