import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // REQUIRED for email confirmation & magic links
  },
})

// Database types
export interface Profile {
  id: string
  role: "user" | "admin"
  name?: string
  email?: string
  preferences?: Record<string, any>
  interests?: string[]
  created_at: string
  updated_at: string
}

export interface Destination {
  id: string
  name: string
  country: string
  description?: string
  image_url?: string
  rating?: number
  price_range?: string
  best_time?: string
  highlights?: string[]
  category?: string
  created_at: string
  updated_at: string
}

export interface Trip {
  id: string
  user_id: string
  destination_id?: string
  start_date?: string
  end_date?: string
  budget?: number
  status?: "planned" | "ongoing" | "completed" | "cancelled"
  preferences?: Record<string, any>
  created_at: string
  updated_at: string
  destination?: Destination
}

export interface Booking {
  id: string
  trip_id: string
  booking_type: "hotel" | "flight" | "activity"
  details: Record<string, any>
  status: "confirmed" | "pending" | "cancelled"
  created_at: string
  updated_at: string
}

export interface Hotel {
  id: string
  name: string
  location: string
  description?: string
  image_url?: string
  rating?: number
  price?: number
  original_price?: number
  category?: string
  amenities?: string[]
  features?: string[]
  availability?: boolean
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  content: string
  read: boolean
  created_at: string
}

const mockDestinations: Destination[] = []
const mockHotels: Hotel[] = []

// Data operations with fallback to empty arrays
export const getDestinations = async (): Promise<Destination[]> => {
  try {
    const { data, error } = await supabase.from("destinations").select("*").order("created_at", { ascending: false })

    if (error) {
      console.warn("Error fetching destinations from Supabase, using empty fallback:", error)
      return mockDestinations
    }

    return data && data.length > 0 ? data : mockDestinations
  } catch (error) {
    console.warn("Error connecting to Supabase, using empty fallback:", error)
    return mockDestinations
  }
}

export const getHotels = async (): Promise<Hotel[]> => {
  try {
    const { data, error } = await supabase.from("hotels").select("*").order("rating", { ascending: false })

    if (error) {
      console.warn("Error fetching hotels from Supabase, using empty fallback:", error)
      return mockHotels
    }

    return data && data.length > 0 ? data : mockHotels
  } catch (error) {
    console.warn("Error connecting to Supabase, using empty fallback:", error)
    return mockHotels
  }
}

export const getUserTrips = async (userId: string): Promise<Trip[]> => {
  try {
    const { data, error } = await supabase
      .from("trips")
      .select(`
        *,
        destination:destinations(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("Error fetching user trips from Supabase:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.warn("Error connecting to Supabase:", error)
    return []
  }
}

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("Error fetching notifications from Supabase:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.warn("Error connecting to Supabase:", error)
    return []
  }
}

export const createTrip = async (trip: Omit<Trip, "id" | "created_at" | "updated_at">): Promise<Trip | null> => {
  try {
    const { data, error } = await supabase.from("trips").insert([trip]).select().single()

    if (error) {
      console.error("Error creating trip:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error creating trip:", error)
    return null
  }
}

export const updateTrip = async (id: string, updates: Partial<Trip>): Promise<Trip | null> => {
  try {
    const { data, error } = await supabase.from("trips").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating trip:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error updating trip:", error)
    return null
  }
}

export const createNotification = async (
  notification: Omit<Notification, "id" | "created_at">,
): Promise<Notification | null> => {
  try {
    const { data, error } = await supabase.from("notifications").insert([notification]).select().single()

    if (error) {
      console.error("Error creating notification:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error creating notification:", error)
    return null
  }
}

export const markNotificationAsRead = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id)

    if (error) {
      console.error("Error marking notification as read:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return false
  }
}

export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

export const updateUserProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

    if (error) {
      console.error("Error updating user profile:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error updating user profile:", error)
    return null
  }
}

export const createBooking = async (
  booking: Omit<Booking, "id" | "created_at" | "updated_at">,
): Promise<Booking | null> => {
  try {
    const { data, error } = await supabase.from("bookings").insert([booking]).select().single()

    if (error) {
      console.error("Error creating booking:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error creating booking:", error)
    return null
  }
}

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        trip:trips(*)
      `)
      .eq("trips.user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching user bookings:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching user bookings:", error)
    return []
  }
}
