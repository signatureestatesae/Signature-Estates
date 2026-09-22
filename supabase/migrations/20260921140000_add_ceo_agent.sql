-- The CEO bio page (/about/ceo) previously hardcoded Fiza Shah's photo/name/title
-- directly in the page component, so there was no way to change her photo from
-- the admin Agents page. Giving her a real agents row lets /about/ceo read the
-- photo (and name/title) from the same place every other advisor's photo comes
-- from, so uploading a headshot in admin > Agents now updates the CEO page too.
--
-- Phone/WhatsApp/email below are placeholders, matching the TODO convention used
-- elsewhere in this repo — replace with her real contact details via /admin.
-- Rating/reviews are left at schema defaults rather than invented numbers.
insert into public.agents
  (slug, name, title, location, bio, specialties, featured, sort_order, phone, whatsapp, email)
values
(
  'fiza-shah',
  'Fiza Shah',
  'Chief Executive Officer',
  'Dubai, UAE',
  'Fiza leads Signature Estates'' vision to build a truly international real estate platform, connecting clients with carefully selected luxury and investment opportunities across the GCC and worldwide.',
  ARRAY['Luxury Real Estate', 'International Investment', 'Portfolio Advisory'],
  true,
  -1,
  '+971000000000',
  '971000000000',
  'fiza@signatureestates.ae'
);

-- The placeholder "leader" spotlighted on /agents before a real CEO record
-- existed — the actual CEO should be the one spotlighted now.
update public.agents set featured = false where slug = 'layla-al-mansoori';
