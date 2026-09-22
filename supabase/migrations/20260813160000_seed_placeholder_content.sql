-- Placeholder launch content for Signature Estates so the site isn't empty
-- on first run. Everything here — agents, projects, pricing, copy — is
-- fictional demo data for a template. Replace/remove via /admin before
-- this goes live; do not treat any of it as real inventory or staff.

insert into public.agents
  (slug, name, title, location, nationality, rating, reviews, photo, phone, whatsapp, email, bio, languages, specialties, featured, sort_order)
values
(
  'layla-al-mansoori',
  'Layla Al Mansoori',
  'Senior Property Advisor',
  'Dubai, UAE',
  'Emirati',
  4.9,
  62,
  '',
  '+971000000001',
  '971000000001',
  'layla@signatureestates.ae',
  'Layla specializes in branded residences and waterfront developments across Palm Jumeirah and Dubai Marina, guiding investors through off-plan acquisitions from reservation to handover.',
  ARRAY['English', 'Arabic'],
  ARRAY['Branded Residences', 'Waterfront Developments', 'Off-Plan Investment'],
  true,
  0
),
(
  'james-whitfield',
  'James Whitfield',
  'Director of Sales',
  'Dubai, UAE',
  'British',
  4.8,
  47,
  '',
  '+971000000002',
  '971000000002',
  'james@signatureestates.ae',
  'James leads new-development sales for Signature Estates, with a decade of experience placing international investors into Downtown Dubai and Business Bay launches.',
  ARRAY['English'],
  ARRAY['New Developments', 'International Investment', 'Portfolio Acquisition'],
  false,
  1
);

insert into public.off_plan_projects
  (slug, name, developer, status, area, city, handover, starting_price,
   unit_types, min_size, max_size, payment_plan, description, amenities,
   images, featured, reference, agent_id, lat, lng)
values
(
  'palm-horizon-residences',
  'Palm Horizon Residences',
  'Meridian Developments',
  'Off-Plan',
  'Palm Jumeirah',
  'Dubai',
  'Q4 2027',
  8500000,
  ARRAY['3-Bedroom Apartment', '4-Bedroom Sky Villa', '5-Bedroom Penthouse'],
  220, 640,
  '20% down payment, 50% during construction, 30% on handover.',
  'Palm Horizon Residences is a beachfront collection of branded apartments and sky villas on the Palm Jumeirah crescent, pairing private beach access with resort-style amenities and panoramic Arabian Gulf views.

Interiors feature floor-to-ceiling glazing, natural stone finishes and fully fitted kitchens, with select residences offering private plunge pools.',
  ARRAY['Private beach club', 'Infinity pool', 'Spa & wellness centre', 'Concierge & valet', 'Kids'' club', '24/7 security'],
  '{}',
  true,
  'SE-1001',
  (select id from public.agents where slug = 'layla-al-mansoori'),
  25.1124, 55.1390
),
(
  'aurora-residences-downtown',
  'Aurora Residences Downtown',
  'Meridian Developments',
  'Pre-Launch',
  'Downtown Dubai',
  'Dubai',
  'Q2 2028',
  3200000,
  ARRAY['1-Bedroom Apartment', '2-Bedroom Apartment', '3-Bedroom Apartment'],
  75, 210,
  '10% on reservation, 40% during construction, 50% on handover.',
  'Aurora Residences Downtown rises within walking distance of the Burj Khalifa and Dubai Mall, offering skyline-view apartments finished to a hotel-residence standard for buyers who want to be in the centre of the city.',
  ARRAY['Rooftop infinity pool', 'Sky lounge', 'Fully equipped gym', 'Cinema room', 'Valet parking'],
  '{}',
  true,
  'SE-1002',
  (select id from public.agents where slug = 'james-whitfield'),
  25.1972, 55.2744
),
(
  'marina-bay-residences',
  'Marina Bay Residences',
  'Meridian Developments',
  'Nearing Completion',
  'Dubai Marina',
  'Dubai',
  'Q1 2027',
  2100000,
  ARRAY['Studio', '1-Bedroom Apartment', '2-Bedroom Apartment'],
  45, 140,
  '5% down payment, direct purchase on handover-ready units.',
  'Marina Bay Residences sits directly on the Dubai Marina walk, offering move-in-ready waterfront apartments with full marina and skyline views, steps from dining, retail and the tram line.',
  ARRAY['Marina-view pool deck', 'Fully equipped gym', 'Direct marina walk access', 'Retail podium', '24/7 security'],
  '{}',
  false,
  'SE-1003',
  (select id from public.agents where slug = 'layla-al-mansoori'),
  25.0805, 55.1403
);
