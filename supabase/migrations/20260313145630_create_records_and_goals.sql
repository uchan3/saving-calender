-- records table
create table public.records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('saving', 'splurge')),
  category text not null,
  amount integer not null check (amount > 0),
  date date not null,
  note text,
  created_at timestamptz not null default now()
);

-- RLS for records
alter table public.records enable row level security;

create policy "Users can view their own records"
  on public.records for select
  using (auth.uid() = user_id);

create policy "Users can insert their own records"
  on public.records for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own records"
  on public.records for update
  using (auth.uid() = user_id);

create policy "Users can delete their own records"
  on public.records for delete
  using (auth.uid() = user_id);

-- indexes for records
create index records_user_id_date_idx on public.records (user_id, date);

-- goals table
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_amount integer not null check (target_amount > 0),
  period text not null default 'monthly',
  year integer not null,
  month integer not null check (month >= 1 and month <= 12),
  created_at timestamptz not null default now(),
  unique (user_id, year, month)
);

-- RLS for goals
alter table public.goals enable row level security;

create policy "Users can view their own goals"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own goals"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own goals"
  on public.goals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own goals"
  on public.goals for delete
  using (auth.uid() = user_id);

-- index for goals
create index goals_user_id_year_month_idx on public.goals (user_id, year, month);
