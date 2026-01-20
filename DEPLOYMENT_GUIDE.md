# Traveloop Travel Planning Platform - Deployment Guide

## Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account (optional - currently using localStorage)
- Vercel account for deployment

## Environment Variables
Create a `.env.local` file with:

\`\`\`env
# Admin Credentials (Hardcoded - Hidden from UI)
NEXT_PUBLIC_ADMIN_EMAIL=harikailash2004@gmail.com
NEXT_PUBLIC_ADMIN_PASSWORD=adminahk2004

# Optional: Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## Installation & Setup

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/harianchala/v0-travel-planning-platform.git
   cd v0-travel-planning-platform
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   pnpm install
   \`\`\`

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Add admin credentials
   - Add Supabase keys (if using real database)

4. **Run development server**
   \`\`\`bash
   pnpm dev
   \`\`\`
   Open http://localhost:3000

5. **Build for production**
   \`\`\`bash
   pnpm build
   pnpm start
   \`\`\`

## Deployment to Vercel

### Step 1: Push to GitHub
\`\`\`bash
git push origin main
\`\`\`

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the v0-travel-planning-platform repository

### Step 3: Set Environment Variables
In Vercel project settings → Environment Variables:
- `NEXT_PUBLIC_ADMIN_EMAIL` = `harikailash2004@gmail.com`
- `NEXT_PUBLIC_ADMIN_PASSWORD` = `adminahk2004`
- (Optional) Supabase configuration keys

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build completion
3. Your app will be live at `https://your-project.vercel.app`

## Testing Checklist

### User Authentication
- [ ] Regular user can sign up with any email/password
- [ ] Regular user can log in and see dashboard
- [ ] Admin credentials (harikailash2004@gmail.com / adminahk2004) grants admin access
- [ ] Session persists across page navigation
- [ ] Logout clears user session

### User Features
- [ ] Can view destinations with pricing in INR
- [ ] Can view hotels with amenities
- [ ] Can plan trips (destination → hotel → people → transportation)
- [ ] Trip cost calculated correctly (hotel nights × price + transport)
- [ ] Can view My Trips with status
- [ ] Can view detailed itinerary with day-by-day activities

### Admin Features (Only visible when logged in as admin)
- [ ] Can access /admin dashboard
- [ ] Can add/edit/delete destinations
- [ ] Can add/edit/delete hotels
- [ ] Emergency Control accessible
- [ ] Can lock/unlock system
- [ ] Can delete all database data
- [ ] Admin section only visible in sidebar when logged in as admin

### Security
- [ ] Regular users cannot access /admin routes
- [ ] Admin credentials not visible in source code
- [ ] System lock prevents regular user access
- [ ] All pricing displays in INR (₹)
- [ ] No hardcoding visible in UI

## Database Setup (Optional - for Supabase)

Run these SQL queries in Supabase SQL Editor:

### 1. Create Tables
See `scripts/supabase/01-create-tables.sql`

### 2. Create RLS Policies
See `scripts/supabase/02-create-rls-policies.sql`

### 3. Seed Initial Data
See `scripts/supabase/03-seed-initial-data.sql`

## Support
For issues or questions, open an issue on GitHub or contact the development team.
\`\`\`

Now let me create the SQL scripts for Supabase:
