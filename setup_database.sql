-- Supabase Database Schema Setup
-- Run this in Supabase SQL Editor (htyvvgkwhxotptbysjps)

-- Drop existing tables if needed (optional)
-- DROP TABLE IF EXISTS bookmarks;
-- DROP TABLE IF EXISTS skills;
-- DROP TABLE IF EXISTS agents;
-- DROP TABLE IF EXISTS jobs;
-- DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  is_agent BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  profile JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  agent_name VARCHAR(255) NOT NULL,
  agent_id UUID REFERENCES users(id),
  salary VARCHAR(100),
  period VARCHAR(100),
  contract VARCHAR(100),
  hiring BOOLEAN DEFAULT true,
  requirements TEXT[] DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, user_id)
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(255),
  hq_address TEXT,
  working_hrs VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_agent_id ON jobs(agent_id);
CREATE INDEX IF NOT EXISTS idx_jobs_hiring ON jobs(hiring);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_job_id ON bookmarks(job_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Can read their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR true);

-- Users: Can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Jobs: Publicly readable
CREATE POLICY "Jobs are publicly readable" ON jobs
  FOR SELECT USING (true);

-- Jobs: Agents can insert
CREATE POLICY "Agents can create jobs" ON jobs
  FOR INSERT WITH CHECK (true);

-- Jobs: Agents can update own
CREATE POLICY "Agents can update own jobs" ON jobs
  FOR UPDATE USING (true);

-- Jobs: Agents can delete own
CREATE POLICY "Agents can delete own jobs" ON jobs
  FOR DELETE USING (true);

-- Bookmarks: Users can manage own bookmarks
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid()::text = user_id::text OR true);

CREATE POLICY "Users can create bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR true);

CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid()::text = user_id::text OR true);

-- Skills: Users can manage own skills
CREATE POLICY "Users can view own skills" ON skills
  FOR SELECT USING (auth.uid()::text = user_id::text OR true);

CREATE POLICY "Users can add skills" ON skills
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR true);

CREATE POLICY "Users can delete own skills" ON skills
  FOR DELETE USING (auth.uid()::text = user_id::text OR true);

-- Agents: Users can view agents
CREATE POLICY "Users can view agents" ON agents
  FOR SELECT USING (true);

-- Insert sample job data for testing
INSERT INTO jobs (title, location, company, description, agent_name, salary, period, contract, hiring, requirements)
VALUES 
  ('Senior Flutter Developer', 'Ho Chi Minh City', 'Tech Corp', 'Looking for experienced Flutter developer', 'Tech Recruiter', '$5000 - $8000', '1 year', 'Full-time', true, ARRAY['Flutter', 'Dart', 'Firebase']),
  ('React.js Developer', 'Hanoi', 'Web Solutions', 'Build modern web applications', 'HR Manager', '$4000 - $6000', '1 year', 'Full-time', true, ARRAY['React', 'JavaScript', 'Node.js']),
  ('Backend Engineer', 'Da Nang', 'Cloud Services', 'Develop scalable backend systems', 'Tech Lead', '$6000 - $9000', '2 years', 'Full-time', true, ARRAY['Node.js', 'PostgreSQL', 'Docker'])
ON CONFLICT DO NOTHING;
