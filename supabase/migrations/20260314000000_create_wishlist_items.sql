-- wishlist_items table
create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  price integer not null check (price > 0),
  image_url text,
  product_url text,
  sort_order integer not null default 0,
  purchased_at timestamptz,
  created_at timestamptz not null default now()
);

-- RLS for wishlist_items
alter table public.wishlist_items enable row level security;

create policy "Users can view their own wishlist items"
  on public.wishlist_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own wishlist items"
  on public.wishlist_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own wishlist items"
  on public.wishlist_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own wishlist items"
  on public.wishlist_items for delete
  using (auth.uid() = user_id);

-- indexes for wishlist_items
create index wishlist_items_user_id_sort_order_idx on public.wishlist_items (user_id, sort_order);
