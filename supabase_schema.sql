
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE (Hero, About, Social Links)
create table public.profiles (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  title text,
  bio text,
  avatar_url text,
  resume_url text,
  email text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  gemini_api_key text,
  registration_enabled boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SKILLS TABLE
create table public.skills (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null, -- 'frontend', 'backend', 'tools', etc.
  proficiency integer default 0, -- 0 to 100
  icon_name text, -- Lucide icon name or image URL
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROJECTS TABLE
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  image_url text,
  demo_url text,
  github_url text,
  tags text[], -- Array of strings
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- EXPERIENCE TABLE
create table public.experience (
  id uuid default uuid_generate_v4() primary key,
  company text not null,
  position text not null,
  start_date date,
  end_date date,
  current boolean default false,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CERTIFICATIONS TABLE
create table public.certifications (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  issuer text not null,
  issue_date date,
  credential_url text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- AI KNOWLEDGE TABLE (Specific to your portfolio)
create table public.ai_knowledge (
  id uuid default uuid_generate_v4() primary key,
  topic text not null,
  description text,
  proficiency integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MESSAGES TABLE (Contact Form)
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Row Level Security)
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.experience enable row level security;
alter table public.certifications enable row level security;
alter table public.ai_knowledge enable row level security;
alter table public.messages enable row level security;

-- Create policies (Allow Public Read, Authenticated Write)
-- Note: For simplicity in this portfolio context, we'll allow public read.
-- Writing is restricted to authenticated users (the admin).

-- Profiles
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.role() = 'authenticated');
create policy "Users can update their own profile." on public.profiles for update using (auth.role() = 'authenticated');

-- Skills
create policy "Public skills are viewable by everyone." on public.skills for select using (true);
create policy "Authenticated users can insert skills." on public.skills for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update skills." on public.skills for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete skills." on public.skills for delete using (auth.role() = 'authenticated');

-- Projects
create policy "Public projects are viewable by everyone." on public.projects for select using (true);
create policy "Authenticated users can insert projects." on public.projects for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update projects." on public.projects for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete projects." on public.projects for delete using (auth.role() = 'authenticated');

-- Experience
create policy "Public experience are viewable by everyone." on public.experience for select using (true);
create policy "Authenticated users can insert experience." on public.experience for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update experience." on public.experience for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete experience." on public.experience for delete using (auth.role() = 'authenticated');

-- Certifications
create policy "Public certifications are viewable by everyone." on public.certifications for select using (true);
create policy "Authenticated users can insert certifications." on public.certifications for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update certifications." on public.certifications for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete certifications." on public.certifications for delete using (auth.role() = 'authenticated');

-- AI Knowledge
create policy "Public ai_knowledge are viewable by everyone." on public.ai_knowledge for select using (true);
create policy "Authenticated users can insert ai_knowledge." on public.ai_knowledge for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update ai_knowledge." on public.ai_knowledge for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete ai_knowledge." on public.ai_knowledge for delete using (auth.role() = 'authenticated');

-- Messages
-- Only authenticated users (admin) can read messages
create policy "Authenticated users can view messages." on public.messages for select using (auth.role() = 'authenticated');
-- Anyone can insert a message (Contact form)
create policy "Anyone can insert messages." on public.messages for insert with check (true);
