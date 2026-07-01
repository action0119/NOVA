-- handle_new_user is only meant to run as a trigger (SECURITY DEFINER context),
-- not to be callable directly via PostgREST RPC by anon/authenticated.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Tighten search_keyword insert: guests may log with user_id null, but a signed-in
-- user must log under their own id (no spoofing another user's id).
drop policy "anyone insert search_keyword" on public.search_keyword;
create policy "guest or owner insert search_keyword" on public.search_keyword
  for insert with check (user_id is null or user_id = (select auth.uid()));

-- Wrap auth.uid() in a scalar subselect so Postgres caches it once per query
-- instead of re-evaluating per row (auth_rls_initplan perf advisory).
drop policy "users select own" on public.users;
create policy "users select own" on public.users for select using ((select auth.uid()) = id);
drop policy "users update own" on public.users;
create policy "users update own" on public.users for update using ((select auth.uid()) = id);

drop policy "owner insert review" on public.review;
create policy "owner insert review" on public.review for insert with check ((select auth.uid()) = user_id);
drop policy "owner update review" on public.review;
create policy "owner update review" on public.review for update using ((select auth.uid()) = user_id);
drop policy "owner delete review" on public.review;
create policy "owner delete review" on public.review for delete using ((select auth.uid()) = user_id);

drop policy "owner all cart" on public.cart;
create policy "owner all cart" on public.cart for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy "owner all wishlist" on public.wishlist;
create policy "owner all wishlist" on public.wishlist for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy "owner all orders" on public.orders;
create policy "owner all orders" on public.orders for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy "owner all order_details" on public.order_details;
create policy "owner all order_details" on public.order_details for all
  using (exists (select 1 from public.orders o where o.order_id = order_details.order_id and o.user_id = (select auth.uid())))
  with check (exists (select 1 from public.orders o where o.order_id = order_details.order_id and o.user_id = (select auth.uid())));

drop policy "owner all recent_view" on public.recent_view;
create policy "owner all recent_view" on public.recent_view for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy "owner all ai_styling" on public.ai_styling;
create policy "owner all ai_styling" on public.ai_styling for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy "owner all coupon" on public.coupon;
create policy "owner all coupon" on public.coupon for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Missing covering indexes on foreign keys flagged by the performance advisor
create index brand_featured_product_idx on public.brand(featured_product_id);
create index category_parent_idx on public.category(parent_category_id);
create index cart_product_idx on public.cart(product_id);
create index order_details_product_idx on public.order_details(product_id);
create index recent_view_product_idx on public.recent_view(product_id);
create index review_user_idx on public.review(user_id);
create index search_keyword_user_idx on public.search_keyword(user_id);
create index wishlist_product_idx on public.wishlist(product_id);
create index ai_styling_product_idx on public.ai_styling(product_id);
