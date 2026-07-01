-- Supabase Auth is email-based, but the spec's login form accepts a
-- username ("아이디") or email. This resolves username -> email so the
-- client can call signInWithPassword with an email either way.
create or replace function public.get_email_by_login_id(p_login_id text)
returns text
language sql
security definer
set search_path = public
as $$
  select email from public.users where user_login_id = p_login_id limit 1;
$$;

grant execute on function public.get_email_by_login_id(text) to anon, authenticated;
