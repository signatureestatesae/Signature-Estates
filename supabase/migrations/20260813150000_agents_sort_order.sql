-- Manual drag-and-drop ordering for the admin Agents list / public /agents page.
alter table public.agents
  add column sort_order integer not null default 0;

-- Backfill existing rows with their current effective order (oldest first,
-- matching what getAgents() already returned before this column existed)
-- so the list doesn't jump around the first time this ships.
with ordered as (
  select id, row_number() over (order by created_at asc) - 1 as rn
  from public.agents
)
update public.agents
set sort_order = ordered.rn
from ordered
where public.agents.id = ordered.id;

create index agents_sort_order_idx on public.agents(sort_order);
