-- Adds a country column so the off-plan explorer can filter across the
-- GCC markets Signature Estates operates in (UAE, Qatar, Saudi Arabia,
-- Bahrain, Oman), independent of the free-text city/area fields.

alter table public.off_plan_projects
  add column country text not null default '';

update public.off_plan_projects
  set country = 'United Arab Emirates'
  where city = 'Dubai';

update public.off_plan_projects
  set country = 'Tanzania'
  where city = 'Tanzania';
