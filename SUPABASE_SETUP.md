# Recall Backend Setup Guide

This project uses **Supabase** for anonymous analytics and waitlist management, and **Google Gemini API** for AI analysis. Follow these steps to get everything running.

---

## 1. Supabase Project Setup

1.  Create a free account at [supabase.com](https://supabase.com).
2.  Create a new project named "Recall".
3.  Once the project is ready, go to the **SQL Editor** in the left sidebar.
4.  Paste and run the following script to create the necessary tables and security policies:

```sql
-- 1. Create Analytics Events Table
create table analytics_events (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  event_name text not null,
  metadata jsonb,
  device_id text,
  timestamp timestamp with time zone
);

-- 2. Create Waitlist Table
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null,
  feature text,
  device_id text
);

-- 3. Enable Row Level Security (RLS)
alter table analytics_events enable row level security;
alter table waitlist enable row level security;

-- 4. Create Policies to allow anonymous inserts from the app
create policy "Allow anonymous inserts to analytics" 
on analytics_events for insert 
with check (true);

create policy "Allow anonymous inserts to waitlist" 
on waitlist for insert 
with check (true);
```

---

## 2. Environment Variables

You need to configure your environment variables for the app to communicate with the services. 

### API Key Locations
- **Gemini API Key:** Get it from [ai.google.dev](https://ai.google.dev/).
- **Supabase URL & Anon Key:** Found in your Supabase Dashboard under **Project Settings > API**.

### Configuration
Ensure the following variables are available in your execution environment:

| Variable | Description |
| :--- | :--- |
| `API_KEY` | Your Google Gemini API Key |
| `SUPABASE_URL` | Your project's API URL (e.g., https://xyz.supabase.co) |
| `SUPABASE_ANON_KEY` | Your project's public "anon" key |

---

## 3. Verifying the Connection

1.  Open the app and click on a "Coming Soon" feature (like Analyze or Report).
2.  Enter an email in the Waitlist modal and click "Join".
3.  Check your Supabase Dashboard under **Table Editor > waitlist**. You should see the entry appearing instantly.

## 4. Security Notes

The current setup uses **Public Insert Policies**. This is safe for collecting waitlist emails and anonymous usage data, but for a production-scale app with private user logs, you would typically use Supabase Auth to protect specific rows. Since this app uses **LocalStorage** for logs, your personal data never actually reaches the database.
