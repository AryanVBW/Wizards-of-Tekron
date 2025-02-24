/*
  # Add Demo Users and Teams

  1. New Data
    - 1 Admin user
    - 4 Tester accounts
    - 20 Team accounts
    - Team profiles for each team

  2. Security
    - Passwords are hashed using Supabase Auth
    - Teams start with default settings
*/

-- Create Admin User
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES (
  gen_random_uuid(),
  'vivek.aryanvbw@gmail.com',
  crypt('AryanVBW@2025', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin"}'
) ON CONFLICT (email) DO NOTHING;

-- Create Tester Users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
SELECT 
  gen_random_uuid(),
  'tester' || n || '@tekron.test',
  crypt('Tester@2025', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"tester"}'
FROM generate_series(1, 4) n
ON CONFLICT (email) DO NOTHING;

-- Create Team Users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
SELECT 
  gen_random_uuid(),
  'team' || n || '@tekron.test',
  crypt('Team@2025', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"team"}'
FROM generate_series(1, 20) n
ON CONFLICT (email) DO NOTHING;

-- Create Team Profiles
INSERT INTO team_profiles (id, team_name, status, current_level, total_points)
SELECT 
  id,
  'Team ' || ROW_NUMBER() OVER (ORDER BY created_at),
  'active',
  1,
  0
FROM auth.users
WHERE email LIKE 'team%@tekron.test'
ON CONFLICT (id) DO NOTHING;