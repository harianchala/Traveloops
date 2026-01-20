-- Insert admin user (NOTE: You need to create the auth user first in Supabase)
-- This assumes the admin user exists in auth.users with email harikailash2004@gmail.com
INSERT INTO public.users (id, email, full_name, is_admin)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', 'Admin User'),
  TRUE
FROM auth.users
WHERE email = 'harikailash2004@gmail.com'
ON CONFLICT (id) DO UPDATE SET is_admin = TRUE;

-- Insert sample destinations (in INR)
INSERT INTO public.destinations (name, country, description, image_url, rating, price_per_night, best_time, category, highlights)
VALUES
  (
    'Meghalaya',
    'India',
    'A lush, hilly state known for its living root bridges, waterfalls, and rolling green landscapes.',
    '/meghalaya.jpg',
    4.8,
    4500,
    'April - October',
    'Adventure',
    ARRAY['Living Root Bridges', 'Cherrapunji Waterfalls', 'Shillong Peak', 'Nohkalikai Falls']
  ),
  (
    'Tokyo',
    'Japan',
    'A vibrant capital city blending traditional culture with modern technology.',
    '/tokyo-cityscape.png',
    4.7,
    15000,
    'March - May',
    'Culture',
    ARRAY['Senso-ji Temple', 'Shibuya Crossing', 'Tsukiji Market', 'Meiji Shrine']
  ),
  (
    'Ladakh',
    'India',
    'A high-altitude region with dramatic mountain landscapes and unique Buddhist culture.',
    '/ladakh.jpg',
    4.9,
    5000,
    'June - September',
    'Adventure',
    ARRAY['Pangong Lake', 'Khardung La Pass', 'Hemis Monastery', 'Tso Moriri Lake']
  ),
  (
    'Santorini',
    'Greece',
    'A picturesque island famous for its white-washed buildings and sunset views.',
    '/santorini-clifftop-village.png',
    4.9,
    20000,
    'April - October',
    'Beach',
    ARRAY['Caldera Views', 'Oia Sunset', 'Black Sand Beach', 'Wine Tasting']
  ),
  (
    'Kerala',
    'India',
    'A tropical paradise with backwaters, beaches, and lush plantations.',
    '/kerala.jpg',
    4.8,
    6000,
    'September - May',
    'Beach',
    ARRAY['Backwaters', 'Houseboat Cruises', 'Tea Plantations', 'Beaches']
  );

-- Insert sample hotels
INSERT INTO public.hotels (destination_id, name, location, description, image_url, rating, price_per_night, category, amenities, features, rooms_available)
SELECT 
  d.id,
  'Meghalaya Paradise Resort',
  'Shillong',
  'A luxury resort nestled in the hills with modern amenities.',
  '/resort.jpg',
  4.5,
  4500,
  '5-Star',
  ARRAY['WiFi', 'Pool', 'Restaurant', 'Spa', 'Gym'],
  ARRAY['Mountain View', 'AC', 'Hot Water', 'Room Service'],
  8
FROM public.destinations d WHERE d.name = 'Meghalaya'
ON CONFLICT DO NOTHING;

INSERT INTO public.hotels (destination_id, name, location, description, image_url, rating, price_per_night, category, amenities, features, rooms_available)
SELECT 
  d.id,
  'Budget Stay Meghalaya',
  'Cherrapunji',
  'An affordable and cozy lodge for budget travelers.',
  '/budget.jpg',
  4.0,
  1500,
  'Budget',
  ARRAY['WiFi', 'Restaurant'],
  ARRAY['Shared Kitchen', 'Garden', 'Common Area'],
  12
FROM public.destinations d WHERE d.name = 'Meghalaya'
ON CONFLICT DO NOTHING;

INSERT INTO public.hotels (destination_id, name, location, description, image_url, rating, price_per_night, category, amenities, features, rooms_available)
SELECT 
  d.id,
  'Tokyo Luxury Inn',
  'Shibuya',
  'A premium hotel in the heart of Tokyo with world-class service.',
  '/luxury.jpg',
  4.8,
  15000,
  '5-Star',
  ARRAY['WiFi', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Business Center'],
  ARRAY['City View', 'AC', 'Minibar', 'Safe'],
  6
FROM public.destinations d WHERE d.name = 'Tokyo'
ON CONFLICT DO NOTHING;

INSERT INTO public.hotels (destination_id, name, location, description, image_url, rating, price_per_night, category, amenities, features, rooms_available)
SELECT 
  d.id,
  'Ladakh Mountain Lodge',
  'Leh',
  'A traditional lodge offering authentic Ladakhi hospitality.',
  '/majestic-mountain.png',
  4.6,
  4000,
  '3-Star',
  ARRAY['WiFi', 'Restaurant', 'Garden'],
  ARRAY['Mountain View', 'Traditional Decor', 'Heater'],
  10
FROM public.destinations d WHERE d.name = 'Ladakh'
ON CONFLICT DO NOTHING;

INSERT INTO public.hotels (destination_id, name, location, description, image_url, rating, price_per_night, category, amenities, features, rooms_available)
SELECT 
  d.id,
  'Santorini Clifftop Villa',
  'Oia',
  'An exclusive villa with breathtaking caldera views.',
  '/villa.jpg',
  4.9,
  20000,
  'Luxury',
  ARRAY['WiFi', 'Pool', 'Restaurant', 'Private Terrace'],
  ARRAY['Sea View', 'AC', 'Hot Tub', 'Private Beach Access'],
  4
FROM public.destinations d WHERE d.name = 'Santorini'
ON CONFLICT DO NOTHING;

-- Initialize system settings
INSERT INTO public.system_settings (key, value)
VALUES
  ('system_locked', 'false'),
  ('last_backup', NOW()::TEXT),
  ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;
