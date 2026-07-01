-- Profile table keyed 1:1 to auth.users. No password column: auth.users already
-- stores the hashed credential, so a parallel public.users password field would
-- be a duplicate source of truth and a security anti-pattern.
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  user_name text not null,
  user_login_id text not null unique,
  phone_number text,
  address text,
  email text not null,
  join_date timestamptz not null default now(),
  marketing_agree boolean not null default false,
  auto_login boolean not null default false
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, user_name, user_login_id, phone_number, address, email, marketing_agree)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_name', ''),
    coalesce(new.raw_user_meta_data->>'user_login_id', new.id::text),
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'address',
    new.email,
    coalesce((new.raw_user_meta_data->>'marketing_agree')::boolean, false)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
