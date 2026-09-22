-- Leads captured from public-facing forms (property/off-plan enquiries,
-- the general contact form). Anyone can submit one; only the admin can
-- read, update or delete them.

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null default '',
  email text not null default '',
  message text not null default '',
  source text not null default 'general',
  source_reference text,
  interest text,
  page_url text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_created_at_idx on public.leads(created_at desc);
create index leads_status_idx on public.leads(status);

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

alter table public.leads enable row level security;

create policy "leads_public_insert" on public.leads
  for insert to anon, authenticated with check (true);

create policy "leads_admin_read" on public.leads
  for select to authenticated using (true);

create policy "leads_admin_write" on public.leads
  for update to authenticated using (true) with check (true);

create policy "leads_admin_delete" on public.leads
  for delete to authenticated using (true);
