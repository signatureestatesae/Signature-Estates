-- Job postings managed from admin > Careers and shown on /careers, plus a
-- job_applications table capturing "Apply Now" submissions (name, email,
-- phone, message and a resume) from the public site.

create table public.job_postings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  department text not null default '',
  location text not null default 'Dubai, UAE',
  employment_type text not null default 'Full-time',
  summary text not null default '',
  description text not null default '',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index job_postings_sort_order_idx on public.job_postings(sort_order);

create trigger job_postings_set_updated_at
  before update on public.job_postings
  for each row execute function public.set_updated_at();

alter table public.job_postings enable row level security;

create policy "job_postings_public_read" on public.job_postings
  for select to anon using (published = true);
create policy "job_postings_admin_read" on public.job_postings
  for select to authenticated using (true);
create policy "job_postings_admin_write" on public.job_postings
  for all to authenticated using (true) with check (true);

-- Applications are written server-side only, by the /api/careers/apply
-- route using the service role key (which bypasses RLS) — that's what lets
-- one request atomically upload the resume, insert this row and email the
-- notification. There's deliberately no public-insert policy here the way
-- `leads` has one: the resume upload has to happen through that route
-- anyway, so there's no case where a client writes this row on its own.
create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_posting_id uuid references public.job_postings(id) on delete set null,
  job_title text not null default '',
  name text not null,
  email text not null default '',
  phone text not null default '',
  message text not null default '',
  cv_path text not null,
  cv_filename text not null default '',
  status text not null default 'new' check (status in ('new', 'reviewed', 'shortlisted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index job_applications_created_at_idx on public.job_applications(created_at desc);
create index job_applications_job_posting_id_idx on public.job_applications(job_posting_id);

create trigger job_applications_set_updated_at
  before update on public.job_applications
  for each row execute function public.set_updated_at();

alter table public.job_applications enable row level security;

create policy "job_applications_admin_read" on public.job_applications
  for select to authenticated using (true);
create policy "job_applications_admin_write" on public.job_applications
  for update to authenticated using (true) with check (true);
create policy "job_applications_admin_delete" on public.job_applications
  for delete to authenticated using (true);

-- Private resume storage — deliberately no storage.objects policies at all
-- (not even for `authenticated`). Resumes contain PII, so both the upload
-- (apply route) and the admin download link (signed URL) go through the
-- service role key, which bypasses RLS/storage policies entirely. That
-- means a resume is never reachable by a guessable or public URL.
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;
