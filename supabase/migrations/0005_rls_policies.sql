alter table public.users enable row level security;
alter table public.brand enable row level security;
alter table public.category enable row level security;
alter table public.product enable row level security;
alter table public.event enable row level security;
alter table public.cart enable row level security;
alter table public.wishlist enable row level security;
alter table public.orders enable row level security;
alter table public.order_details enable row level security;
alter table public.review enable row level security;
alter table public.search_keyword enable row level security;
alter table public.recent_view enable row level security;
alter table public.ai_styling enable row level security;
alter table public.coupon enable row level security;

-- public catalog: read-only for everyone, writes only via service role (MCP/admin)
create policy "public read brand" on public.brand for select using (true);
create policy "public read category" on public.category for select using (true);
create policy "public read product" on public.product for select using (true);
create policy "public read event" on public.event for select using (true);

-- profile: owner only
create policy "users select own" on public.users for select using (auth.uid() = id);
create policy "users update own" on public.users for update using (auth.uid() = id);

-- reviews: public read, owner write
create policy "public read review" on public.review for select using (true);
create policy "owner insert review" on public.review for insert with check (auth.uid() = user_id);
create policy "owner update review" on public.review for update using (auth.uid() = user_id);
create policy "owner delete review" on public.review for delete using (auth.uid() = user_id);

-- owner-only tables
create policy "owner all cart" on public.cart for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner all wishlist" on public.wishlist for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner all orders" on public.orders for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner all order_details" on public.order_details for all
  using (exists (select 1 from public.orders o where o.order_id = order_details.order_id and o.user_id = auth.uid()))
  with check (exists (select 1 from public.orders o where o.order_id = order_details.order_id and o.user_id = auth.uid()));
create policy "owner all recent_view" on public.recent_view for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner all ai_styling" on public.ai_styling for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner all coupon" on public.coupon for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- search_keyword: anyone (including guests) can log a search; aggregated read is public
create policy "anyone insert search_keyword" on public.search_keyword for insert with check (true);
create policy "public read search_keyword" on public.search_keyword for select using (true);
