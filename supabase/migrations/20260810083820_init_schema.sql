-- Core content schema for the admin-managed site: agents, off-plan
-- projects, and blog posts, plus storage buckets for uploads.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- agents
-- ---------------------------------------------------------------------
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  title text not null default '',
  location text not null default '',
  nationality text not null default '',
  rating numeric(2,1) not null default 5.0,
  reviews integer not null default 0,
  photo text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  bio text not null default '',
  languages text[] not null default '{}',
  specialties text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger agents_set_updated_at
  before update on public.agents
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- off_plan_projects
-- ---------------------------------------------------------------------
create table public.off_plan_projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  developer text not null default '',
  status text not null check (status in ('Pre-Launch', 'Off-Plan', 'Under Construction', 'Nearing Completion')),
  area text not null default '',
  city text not null default '',
  handover text not null default '',
  starting_price numeric not null default 0,
  unit_types text[] not null default '{}',
  min_size numeric not null default 0,
  max_size numeric not null default 0,
  payment_plan text not null default '',
  description text not null default '',
  amenities text[] not null default '{}',
  images text[] not null default '{}',
  featured boolean not null default false,
  reference text unique not null,
  agent_id uuid references public.agents(id) on delete set null,
  lat numeric,
  lng numeric,
  brochure_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index off_plan_projects_agent_id_idx on public.off_plan_projects(agent_id);

create trigger off_plan_projects_set_updated_at
  before update on public.off_plan_projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- blog_posts
-- ---------------------------------------------------------------------
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image text not null default '',
  author text not null default '',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
--
-- Public (anon) may read published/public content. Any authenticated
-- user may write — this project uses a single admin account, so there
-- is no separate roles table.
-- ---------------------------------------------------------------------
alter table public.agents enable row level security;
alter table public.off_plan_projects enable row level security;
alter table public.blog_posts enable row level security;

create policy "agents_public_read" on public.agents
  for select to anon, authenticated using (true);
create policy "agents_admin_write" on public.agents
  for all to authenticated using (true) with check (true);

create policy "off_plan_projects_public_read" on public.off_plan_projects
  for select to anon, authenticated using (true);
create policy "off_plan_projects_admin_write" on public.off_plan_projects
  for all to authenticated using (true) with check (true);

create policy "blog_posts_public_read" on public.blog_posts
  for select to anon using (published = true);
create policy "blog_posts_admin_read" on public.blog_posts
  for select to authenticated using (true);
create policy "blog_posts_admin_write" on public.blog_posts
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------
-- Storage buckets for admin-uploaded assets
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('brochures', 'brochures', true)
on conflict (id) do nothing;

create policy "images_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'images');
create policy "images_admin_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'images');
create policy "images_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'images');
create policy "images_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'images');

create policy "brochures_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'brochures');
create policy "brochures_admin_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'brochures');
create policy "brochures_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'brochures');
create policy "brochures_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'brochures');
