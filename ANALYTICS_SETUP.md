# Analytics Setup Instructions

## Overview
This document explains how to set up user visit tracking for your portfolio.

## What Was Implemented

### 1. Database Schema
- Added `analytics` table to track user visits
- Tracks: page path, referrer, device type, browser, OS, session ID
- Privacy-friendly: No personal data stored

### 2. Analytics Hook (`useAnalytics.ts`)
- Automatically tracks page visits
- Detects device type, browser, and OS
- Generates unique session IDs
- Provides functions to query analytics data

### 3. Analytics Dashboard (`Analytics.tsx`)
- Beautiful admin dashboard showing:
  - Total page views
  - Unique visitors
  - Most visited pages
  - Device breakdown
  - Browser statistics
- Time range filters (7, 30, 90 days)

### 4. Integration
- Added Analytics route to admin panel
- Added Analytics link to admin sidebar
- Enabled tracking on Portfolio homepage

## Setup Steps

### Step 1: Update Supabase Database
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the entire content from `supabase_schema.sql`
4. Run the SQL to create the analytics table and policies

**OR** if you already have the database set up, just run this SQL:

\`\`\`sql
-- ANALYTICS TABLE (User Visit Tracking)
create table public.analytics (
  id uuid default uuid_generate_v4() primary key,
  page_path text not null,
  page_title text,
  referrer text,
  user_agent text,
  session_id text,
  country text,
  city text,
  device_type text,
  browser text,
  os text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for faster queries
create index analytics_created_at_idx on public.analytics(created_at desc);
create index analytics_page_path_idx on public.analytics(page_path);
create index analytics_session_id_idx on public.analytics(session_id);

-- Enable RLS
alter table public.analytics enable row level security;

-- RLS Policies
create policy "Authenticated users can view analytics." on public.analytics for select using (auth.role() = 'authenticated');
create policy "Anyone can insert analytics." on public.analytics for insert with check (true);
create policy "Authenticated users can delete analytics." on public.analytics for delete using (auth.role() = 'authenticated');
\`\`\`

### Step 2: Update TypeScript Types
Run this command to regenerate Supabase types:

\`\`\`bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
\`\`\`

Replace `YOUR_PROJECT_ID` with your actual Supabase project ID.

### Step 3: Test the Analytics
1. Visit your portfolio homepage (it will automatically track the visit)
2. Log in to the admin panel
3. Navigate to "Analytics" in the sidebar
4. You should see your visit tracked!

## How It Works

### Automatic Tracking
The `useAnalytics` hook is called in the Portfolio component:
\`\`\`typescript
useAnalytics("/", "Portfolio Home");
\`\`\`

This automatically tracks:
- Page path
- Page title
- Referrer (where the user came from)
- Device type (mobile, tablet, desktop)
- Browser
- Operating system
- Unique session ID

### Privacy-Friendly
- No IP addresses stored
- No personal information collected
- No cookies required
- Session ID is generated client-side and stored in sessionStorage
- Compliant with privacy regulations

### Adding Tracking to Other Pages
To track visits on other pages, simply add the hook:

\`\`\`typescript
import { useAnalytics } from "@/hooks/useAnalytics";

const MyPage = () => {
  useAnalytics("/my-page", "My Page Title");
  // ... rest of component
};
\`\`\`

## Analytics Dashboard Features

### Overview Cards
- **Total Page Views**: Total number of page views in selected time range
- **Unique Visitors**: Number of unique sessions
- **Avg. Views/Visitor**: Engagement metric
- **Top Page**: Most visited page

### Detailed Analytics
- **Page Views Tab**: Shows all pages ranked by views with visual progress bars
- **Devices Tab**: Breakdown by device type (mobile, tablet, desktop)
- **Browsers Tab**: Distribution across different browsers

### Time Range Filters
- 7 Days
- 30 Days
- 90 Days

## Future Enhancements

You can extend this system to track:
- Geographic data (using IP geolocation API)
- Custom events (button clicks, form submissions)
- Conversion funnels
- Real-time visitor count
- Bounce rate
- Average session duration

## Troubleshooting

### Analytics not showing up?
1. Check that the SQL was run successfully in Supabase
2. Verify RLS policies are enabled
3. Check browser console for errors
4. Make sure you're logged in to view analytics

### No data in dashboard?
1. Visit the portfolio homepage first to generate data
2. Wait a few seconds for data to sync
3. Refresh the analytics page

## Notes
- Analytics data is stored indefinitely (you may want to add cleanup logic)
- The session ID resets when the browser session ends
- All queries are optimized with database indexes
