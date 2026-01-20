# Traveloop - Supabase Database Setup Guide

This guide will help you set up your Supabase database for the Traveloop travel planning platform.

## Prerequisites

- Supabase account (free tier works fine)
- Access to your Supabase project dashboard
- Admin credentials: `harikailash2004@gmail.com` / `adminahk2004`

## Step-by-Step Setup Instructions

### Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Enter project details:
   - **Project Name:** `traveloop`
   - **Database Password:** Choose a strong password
   - **Region:** Choose closest to your users
5. Click "Create new project" and wait for initialization

### Step 2: Get Your Connection Details

Once the project is created:

1. Go to **Settings → Database**
2. Find **Connection Info** section
3. Copy the following values (you'll need these for environment variables):
   - **Project URL** (under "Connection pooling → Session mode")
   - **Anon Key** (under "API Keys")
   - **Service Role Key** (keep this secret!)

### Step 3: Run SQL Scripts

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy the contents of `scripts/supabase/01-create-tables.sql`
4. Paste into the SQL editor
5. Click **Run**
6. Wait for execution to complete

Repeat steps 2-5 for:
- `scripts/supabase/02-create-rls-policies.sql`
- `scripts/supabase/03-seed-initial-data.sql`

### Step 4: Create Admin User in Supabase Auth

1. Go to **Authentication → Users**
2. Click **Invite**
3. Enter email: `harikailash2004@gmail.com`
4. Click **Send invite**
5. Check email and click the confirmation link
6. Set password to: `adminahk2004`

### Step 5: Configure Environment Variables

In your Next.js project, add these to your `.env.local`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
\`\`\`

Or in Vercel, add them in **Settings → Environment Variables**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Step 6: Update Application Code

Update `lib/supabase.ts` to use real Supabase client:

\`\`\`typescript
import { createBrowserClient } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

export const createServerClient_ = async () => {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
\`\`\`

## Database Schema Overview

### Tables Created:

1. **users** - User profiles with admin flag
2. **destinations** - Travel destinations with pricing and ratings
3. **hotels** - Hotels per destination
4. **trips** - User trip bookings and itineraries
5. **itineraries** - Day-by-day trip plans
6. **activities** - Activities within each itinerary day
7. **meals** - Restaurant recommendations per day
8. **system_settings** - Emergency lock/unlock and settings
9. **audit_logs** - System action audit trail

### Key Features:

- **Row Level Security (RLS):** All tables have RLS policies
- **Admin Access:** Only admin can CRUD destinations and hotels
- **User Privacy:** Users only see their own trips
- **Referential Integrity:** Foreign keys prevent orphaned data
- **Audit Trail:** All admin actions are logged

## Common Operations

### Add New Destination (Admin Only)

\`\`\`sql
INSERT INTO public.destinations (name, country, description, price_per_night, rating, category)
VALUES (
  'Goa',
  'India',
  'Beach paradise with culture and nightlife',
  5000,
  4.7,
  'Beach'
);
\`\`\`

### Add Hotel to Destination

\`\`\`sql
INSERT INTO public.hotels (destination_id, name, location, price_per_night, rating, category)
VALUES (
  (SELECT id FROM public.destinations WHERE name = 'Goa'),
  'Goa Beach Resort',
  'Baga Beach',
  8000,
  4.5,
  '4-Star'
);
\`\`\`

### Lock System (Emergency)

\`\`\`sql
UPDATE public.system_settings
SET value = 'true'
WHERE key = 'system_locked';
\`\`\`

### Reset All Data (Emergency)

\`\`\`sql
DELETE FROM public.trips;
DELETE FROM public.hotels;
DELETE FROM public.destinations;
DELETE FROM public.users WHERE is_admin = FALSE;
\`\`\`

## Troubleshooting

### Issue: "Permission denied for schema public"
**Solution:** Ensure your Supabase role has proper permissions. Go to SQL Editor and run:
\`\`\`sql
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO anon;
\`\`\`

### Issue: "Auth user not found"
**Solution:** Make sure to create the user in Supabase Auth first (Step 4)

### Issue: Policies blocking operations
**Solution:** Check that your user is authenticated. Verify email matches in the users table.

### Issue: Can't see data after insert
**Solution:** Ensure RLS policies allow SELECT. You may need to check the `authenticated` role is enabled.

## Support

For issues with Supabase specifically, visit [supabase.com/docs](https://supabase.com/docs)

For Traveloop-specific questions, check the project documentation.
