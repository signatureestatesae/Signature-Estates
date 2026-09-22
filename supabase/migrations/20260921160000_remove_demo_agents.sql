-- Removes the two fictional placeholder agents from the template seed data
-- (see 20260813160000_seed_placeholder_content.sql) so /agents only shows
-- real advisors. Fiza Shah (the real CEO, added separately) is untouched.
-- Any off-plan project that pointed at one of these just loses that agent
-- link (agent_id references agents(id) on delete set null) rather than
-- being deleted itself.

delete from public.agents where slug in ('layla-al-mansoori', 'james-whitfield');
