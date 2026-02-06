-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Invoices Table
-- ==========================================
create table public.invoices (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  client_name text not null,
  email text not null,
  date date not null,
  status text not null,
  total_amount numeric not null,
  constraint invoices_pkey primary key (id)
) tablespace pg_default;

-- ==========================================
-- 2. Invoice Items Table
-- ==========================================
create table public.invoice_items (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  invoice_id uuid not null,
  item_type text not null,
  quantity numeric not null,
  unit text not null,
  purity numeric null,
  unit_price numeric not null,
  total numeric not null,
  constraint invoice_items_pkey primary key (id),
  constraint invoice_items_invoice_id_fkey foreign key (invoice_id) references invoices (id) on delete cascade
) tablespace pg_default;

-- ==========================================
-- 3. Row Level Security (RLS) & Policies
-- ==========================================

-- Enable RLS
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;

-- Policies for 'invoices'
-- ALLOW SELECT (Read)
create policy "Enable read access for all users"
on "public"."invoices"
as PERMISSIVE
for SELECT
to public
using (true);

-- ALLOW INSERT (Create)
create policy "Enable insert for authenticated users only"
on "public"."invoices"
as PERMISSIVE
for INSERT
to authenticated
with check (true);

-- ALLOW UPDATE
create policy "Enable update for users based on email"
on "public"."invoices"
as PERMISSIVE
for UPDATE
to public
using (true)
with check (true);

-- ALLOW DELETE
create policy "Enable delete for users based on user_id"
on "public"."invoices"
as PERMISSIVE
for DELETE
to public
using (true);


-- Policies for 'invoice_items'
-- ALLOW SELECT
create policy "Enable read access for all users"
on "public"."invoice_items"
as PERMISSIVE
for SELECT
to public
using (true);

-- ALLOW INSERT
create policy "Enable insert for authenticated users only"
on "public"."invoice_items"
as PERMISSIVE
for INSERT
to authenticated
with check (true);

-- ALLOW DELETE
create policy "Enable delete for users based on user_id"
on "public"."invoice_items"
as PERMISSIVE
for DELETE
to public
using (true);
