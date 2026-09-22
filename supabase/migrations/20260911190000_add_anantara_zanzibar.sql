-- First real client project. Removes the 3 fictional placeholder off-plan
-- projects seeded earlier (Palm Horizon / Aurora / Marina Bay — demo data,
-- never real inventory) and replaces them with Anantara Zanzibar Resort
-- and Residences, sourced from https://anantarazanzibar.com/. Pricing
-- wasn't disclosed publicly, so starting_price is left at 0 ("Price on
-- Request" in the UI); lat/lng are left at the (0,0) "not geocoded"
-- sentinel until a precise site coordinate is confirmed.

delete from public.off_plan_projects
where reference in ('SE-1001', 'SE-1002', 'SE-1003');

insert into public.off_plan_projects
  (slug, name, developer, status, area, city, handover, starting_price,
   unit_types, min_size, max_size, payment_plan, description, amenities,
   images, featured, reference, agent_id, lat, lng)
values
(
  'anantara-zanzibar-resort-residences',
  'Anantara Zanzibar Resort and Residences',
  'INFINITY Developments',
  'Under Construction',
  'Zanzibar Island',
  'Tanzania',
  '2027',
  0,
  ARRAY['Lagoon Suite (62 sqm)', 'One Bedroom Villa (240 sqm)', 'Two Bedroom Villa (360 sqm)', 'Three Bedroom Residence', 'Hotel Suite', 'Royal Suite', 'Penthouse'],
  62, 360,
  '',
  'Anantara Zanzibar Resort and Residences brings a branded beachfront address to one of the Indian Ocean''s fastest-growing luxury destinations, with a gross development value exceeding $150 million. Set for completion in 2027, the resort pairs private villa residences with full Anantara hotel services, on an island that has seen international arrivals grow 282% since 2020.

Residences range from compact lagoon-facing suites to expansive multi-bedroom villas, each finished to full branded-residence standard with access to the resort''s beach club, spa and dining. Zanzibar''s pristine beaches, coral reefs and UNESCO-listed Stone Town sit within easy reach.',
  ARRAY['Private beach club', 'Spa & wellness centre', 'Specialty restaurants', 'All-day dining', 'Rooftop bar', 'Fully equipped fitness centre', 'Kids'' & teens'' clubs', 'Water sports facilities'],
  '{}',
  true,
  'SE-2001',
  (select id from public.agents where slug = 'james-whitfield'),
  0, 0
);
