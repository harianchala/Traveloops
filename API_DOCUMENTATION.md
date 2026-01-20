# Traveloop API Documentation

## Current Implementation
The application uses localStorage for data persistence (demo mode). Below are the endpoints and integrations available:

## Internal API Routes

### Weather API
**Endpoint:** `GET /api/weather`

**Query Parameters:**
- `city` (string) - City name (e.g., "Meghalaya")

**Response:**
\`\`\`json
{
  "temperature": 28,
  "condition": "Sunny",
  "humidity": 65,
  "windSpeed": 12,
  "feelsLike": 30
}
\`\`\`

**Usage:**
\`\`\`javascript
const response = await fetch(`/api/weather?city=Meghalaya`);
const data = await response.json();
\`\`\`

### Events API
**Endpoint:** `GET /api/events`

**Query Parameters:**
- `destination` (string) - Destination name

**Response:**
\`\`\`json
{
  "events": [
    {
      "id": "1",
      "name": "Festival Name",
      "date": "2024-12-25",
      "category": "Cultural",
      "description": "Event details"
    }
  ]
}
\`\`\`

## External API Integrations (Optional)

### OpenWeather API
- **Purpose:** Real-time weather data
- **Endpoint:** https://api.openweathermap.org/data/2.5/weather
- **API Key:** Store in `OPENWEATHER_API_KEY`
- **Rate Limit:** 1000 calls/day (free tier)

### Ticketmaster Discovery API
- **Purpose:** Local events and attractions
- **Endpoint:** https://app.ticketmaster.com/discovery/v2/events
- **API Key:** Store in `TICKETMASTER_API_KEY`
- **Rate Limit:** 100 requests/day (free tier)

## Authentication

### Demo Mode (Current)
Uses localStorage with email/password:
\`\`\`javascript
// Login
const response = await fetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});

// Admin access
// Email: harikailash2004@gmail.com
// Password: adminahk2004
\`\`\`

### Production Mode (Supabase)
\`\`\`javascript
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
\`\`\`

## Database Schema

### Tables
1. **users** - User accounts and authentication
2. **destinations** - Travel destinations with pricing
3. **hotels** - Hotel listings by destination
4. **trips** - User trip bookings
5. **itinerary_days** - Day-by-day itinerary
6. **activities** - Activities per itinerary day
7. **meals** - Meal information per day
8. **bookings** - Transportation bookings
9. **system_settings** - System configuration

See `scripts/supabase/` for complete schema with relationships.

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden (Admin only) |
| 404 | Not Found |
| 500 | Server Error |

## Rate Limiting
- No rate limiting in demo mode
- Production: 100 requests/minute per user

## CORS Configuration
- Allowed Origins: Your Vercel domain
- Allowed Methods: GET, POST, PUT, DELETE
- Allowed Headers: Content-Type, Authorization

## Error Handling

All API responses follow this format:
\`\`\`json
{
  "success": true/false,
  "data": { /* response data */ },
  "error": { /* error details if any */ }
}
\`\`\`

Example error response:
\`\`\`json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
\`\`\`

## Webhooks
Currently not implemented. Can be added for:
- Booking confirmations
- Payment notifications
- System alerts

## SDKs
Recommended client libraries:
- **JavaScript/TypeScript:** Supabase JS Client
- **React:** React Query + Axios or Fetch
- **Vue:** Vue Query + Axios

## Versioning
Current API Version: 1.0 (Demo)
Production Version: 1.0 (with Supabase)
