-- Supabase Database Schema for Job Search App
-- Run these SQL commands in Supabase SQL Editor

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
  image_url LONGTEXT,
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

-- Create indexes for better performance
CREATE INDEX idx_jobs_agent_id ON jobs(agent_id);
CREATE INDEX idx_jobs_hiring ON jobs(hiring);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_job_id ON bookmarks(job_id);
CREATE INDEX idx_skills_user_id ON skills(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Jobs are publicly readable
CREATE POLICY "Jobs are publicly readable" ON jobs
  FOR SELECT USING (true);

-- Agents can create jobs
CREATE POLICY "Agents can create jobs" ON jobs
  FOR INSERT WITH CHECK (auth.uid()::text = agent_id::text);

-- Agents can update their own jobs
CREATE POLICY "Agents can update own jobs" ON jobs
  FOR UPDATE USING (auth.uid()::text = agent_id::text);

-- Agents can delete their own jobs
CREATE POLICY "Agents can delete own jobs" ON jobs
  FOR DELETE USING (auth.uid()::text = agent_id::text);

-- Users can view their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can create bookmarks
CREATE POLICY "Users can create bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Users can view and manage their own skills
CREATE POLICY "Users can view own skills" ON skills
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create skills" ON skills
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own skills" ON skills
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Users can view agents
CREATE POLICY "Agents are publicly readable" ON agents
  FOR SELECT USING (true);

-- Users can update their own agent profile
CREATE POLICY "Users can update own agent" ON agents
  FOR UPDATE USING (auth.uid()::text = user_id::text);
