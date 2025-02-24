/*
  # Admin Configuration Setup

  1. New Tables
    - `team_submissions`
      - Tracks all team submissions and activities
      - Includes timestamp, level, status, and points
    - `team_penalties`
      - Records penalties applied to teams
      - Includes reason, points deducted, and timestamp
    - `team_profiles`
      - Stores additional team information
      - Includes status (active/disqualified/spam)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
    - Add policies for team access to their own data
*/

-- Team Profiles Table
CREATE TABLE IF NOT EXISTS team_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  team_name text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'disqualified', 'spam')),
  current_level integer DEFAULT 1,
  total_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team Submissions Table
CREATE TABLE IF NOT EXISTS team_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES team_profiles(id),
  level integer NOT NULL,
  submission_type text NOT NULL CHECK (submission_type IN ('code', 'qr_verification')),
  status text NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  points integer DEFAULT 0,
  submission_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Team Penalties Table
CREATE TABLE IF NOT EXISTS team_penalties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES team_profiles(id),
  reason text NOT NULL,
  points_deducted integer NOT NULL,
  applied_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE team_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_penalties ENABLE ROW LEVEL SECURITY;

-- Admin Policies
CREATE POLICY "Admin full access on team_profiles"
  ON team_profiles
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'vivek.aryanvbw@gmail.com');

CREATE POLICY "Admin full access on team_submissions"
  ON team_submissions
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'vivek.aryanvbw@gmail.com');

CREATE POLICY "Admin full access on team_penalties"
  ON team_penalties
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'vivek.aryanvbw@gmail.com');

-- Team Policies
CREATE POLICY "Teams can view their own profile"
  ON team_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Teams can view their own submissions"
  ON team_submissions
  FOR SELECT
  TO authenticated
  USING (team_id = auth.uid());

CREATE POLICY "Teams can view their own penalties"
  ON team_penalties
  FOR SELECT
  TO authenticated
  USING (team_id = auth.uid());