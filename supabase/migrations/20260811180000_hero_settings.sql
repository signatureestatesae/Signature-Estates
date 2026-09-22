-- Admin-editable homepage hero background: either a static image or a
-- looping background video (uploaded file or an externally hosted URL).
-- Public read so the homepage (anon client) can render it; write is
-- admin-only, matching the pattern used for other content tables.

create table public.hero_settings (
  id text primary key default 'default',
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  image_url text not null default '',
  video_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hero_settings_singleton check (id = 'default')
);

create trigger hero_settings_set_updated_at
  before update on public.hero_settings
  for each row execute function public.set_updated_at();

insert into public.hero_settings (id, image_url) values (
  'default',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80'
);

alter table public.hero_settings enable row level security;

create policy "hero_settings_public_read" on public.hero_settings
  for select to anon, authenticated using (true);
create policy "hero_settings_admin_write" on public.hero_settings
  for all to authenticated using (true) with check (true);

-- Background video uploads (mp4/webm). Kept as its own bucket so storage
-- and access can be managed independently of the images bucket.
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

create policy "videos_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'videos');
create policy "videos_admin_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'videos');
create policy "videos_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'videos');
create policy "videos_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'videos');
