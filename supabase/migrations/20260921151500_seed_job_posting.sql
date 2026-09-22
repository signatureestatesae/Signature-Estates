-- Placeholder job posting so /careers isn't empty on first run and the
-- admin > Careers / Applications flow can be seen working end-to-end.
-- Fictional demo content — edit or delete via /admin before this goes live.

insert into public.job_postings
  (slug, title, department, location, employment_type, summary, description, published, sort_order)
values
(
  'senior-property-advisor',
  'Senior Property Advisor',
  'Sales',
  'Dubai, UAE',
  'Full-time',
  'Lead high-value transactions for a curated portfolio of luxury resorts and branded residences across Dubai.',
  'We are looking for an experienced property advisor to join our boutique brokerage.

**What you will do**

- Manage the full client relationship, from first viewing through to handover.
- Build direct relationships with developers to source off-market opportunities.
- Advise high-net-worth buyers and investors on Dubai''s luxury real estate market.

**What we are looking for**

- A proven track record in luxury or off-plan real estate sales.
- Strong local market knowledge across Palm Jumeirah, Downtown Dubai and Dubai Marina.
- Fluent English; additional languages are a plus.',
  true,
  0
);
