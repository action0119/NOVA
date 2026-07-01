-- Lets the signup form check id-duplicate availability while logged out,
-- without a public-read policy on public.users that would leak name/phone/address/email.
create or replace function public.check_login_id_available(p_login_id text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select not exists (select 1 from public.users where user_login_id = p_login_id);
$$;

grant execute on function public.check_login_id_available(text) to anon, authenticated;
