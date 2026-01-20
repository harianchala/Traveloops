-- Create a demo user for testing
-- Note: This is for development/testing only
-- In production, users should register through the app

-- First, you need to create the user in Supabase Auth dashboard or through the app
-- Then run this to create the profile:

INSERT INTO profiles (id, name, email, role, preferences, interests, created_at, updated_at)
VALUES (
  'demo-user-id', -- Replace with actual user ID from Supabase Auth
  'Demo User',
  'demo@traveloop.com',
  'user',
  '{"theme": "light", "notifications": true}',
  '["adventure", "culture", "nature"]',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Alternative: Create demo data without specific user ID
-- This creates sample data that can be used for testing
INSERT INTO profiles (id, name, email, role, preferences, interests, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Demo User',
  'demo@example.com',
  'user',
  '{"theme": "light", "notifications": true}',
  '["adventure", "culture", "nature"]',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;
