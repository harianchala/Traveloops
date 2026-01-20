-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Destinations table policies
CREATE POLICY "Anyone can view destinations" ON public.destinations
  FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can insert destinations" ON public.destinations
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Only admins can update destinations" ON public.destinations
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Only admins can delete destinations" ON public.destinations
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Hotels table policies
CREATE POLICY "Anyone can view hotels" ON public.hotels
  FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can insert hotels" ON public.hotels
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Only admins can update hotels" ON public.hotels
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Only admins can delete hotels" ON public.hotels
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Trips table policies
CREATE POLICY "Users can view their own trips" ON public.trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all trips" ON public.trips
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Users can create their own trips" ON public.trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips" ON public.trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips" ON public.trips
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any trip" ON public.trips
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can delete any trip" ON public.trips
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Itineraries table policies
CREATE POLICY "Users can view their trip itineraries" ON public.itineraries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can view all itineraries" ON public.itineraries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Users can manage their trip itineraries" ON public.itineraries
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update their trip itineraries" ON public.itineraries
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete their trip itineraries" ON public.itineraries
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
  );

-- Activities table policies
CREATE POLICY "Users can view activities in their itineraries" ON public.activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE id = itinerary_id
      AND EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage activities in their itineraries" ON public.activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE id = itinerary_id
      AND EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
    )
  );

CREATE POLICY "Users can update activities in their itineraries" ON public.activities
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE id = itinerary_id
      AND EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
    )
  );

CREATE POLICY "Users can delete activities in their itineraries" ON public.activities
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE id = itinerary_id
      AND EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
    )
  );

-- Meals table policies (same as activities)
CREATE POLICY "Users can view meals in their itineraries" ON public.meals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE id = itinerary_id
      AND EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage meals in their itineraries" ON public.meals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE id = itinerary_id
      AND EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
    )
  );

CREATE POLICY "Users can update meals in their itineraries" ON public.meals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE id = itinerary_id
      AND EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
    )
  );

CREATE POLICY "Users can delete meals in their itineraries" ON public.meals
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE id = itinerary_id
      AND EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
    )
  );

-- System settings policies (admin only)
CREATE POLICY "Admins can view system settings" ON public.system_settings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can update system settings" ON public.system_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can insert system settings" ON public.system_settings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Audit logs policies (admins can view, system can insert)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (TRUE);
