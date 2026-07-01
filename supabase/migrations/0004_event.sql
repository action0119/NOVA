create table public.event (
  event_id uuid primary key default gen_random_uuid(),
  event_title text not null,
  event_image text,
  event_description text,
  discount_rate numeric(4,2),
  start_date date,
  end_date date
);
