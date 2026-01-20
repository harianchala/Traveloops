"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"

export interface HotelDetails {
  id: string
  name: string
  location: string
  pricePerNight: number
  rating: number
  amenities: string[]
  imageUrl?: string
}

export interface TransportationDetails {
  type: "flight" | "train" | "bus"
  cost: number
  duration?: string
  provider?: string
}

export interface DestinationInfo {
  id: string
  name: string
  country: string
  description?: string
  imageUrl?: string
  rating?: number
  highlights?: string[]
}

export interface TripDetails {
  id: string
  userId: string
  destination: DestinationInfo
  hotel: HotelDetails
  startDate: Date
  endDate: Date
  numberOfPeople: number
  transportation: TransportationDetails
  interests: string[]
  travelStyle: string
  specialRequests?: string
  totalCost: number
  numberOfNights: number
  status: "planning" | "confirmed" | "ongoing" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
  itinerary?: ItineraryDay[]
}

export interface ItineraryDay {
  day: number
  date: Date
  activities: Activity[]
  meals?: Meal[]
  notes?: string
}

export interface Activity {
  id: string
  title: string
  description?: string
  time: string
  location?: string
  duration?: string
  cost?: number
  category: "sightseeing" | "adventure" | "culture" | "food" | "relaxation" | "shopping"
}

export interface Meal {
  id: string
  type: "breakfast" | "lunch" | "dinner"
  restaurant: string
  cuisine: string
  estimatedCost?: number
}

interface TripContextType {
  trips: TripDetails[]
  currentTrip: TripDetails | null
  isLoading: boolean
  addTrip: (trip: Omit<TripDetails, "id" | "createdAt" | "updatedAt">) => Promise<TripDetails>
  updateTrip: (id: string, updates: Partial<TripDetails>) => Promise<TripDetails | null>
  deleteTrip: (id: string) => Promise<boolean>
  setCurrentTrip: (trip: TripDetails | null) => void
  getTrip: (id: string) => TripDetails | undefined
  calculateTotalCost: (
    numberOfNights: number,
    hotelPrice: number,
    transportCost: number,
    numberOfPeople: number,
  ) => number
  getTripsByStatus: (status: TripDetails["status"]) => TripDetails[]
  generateItinerary: (trip: TripDetails) => ItineraryDay[]
}

const TripContext = createContext<TripContextType | undefined>(undefined)

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<TripDetails[]>([])
  const [currentTrip, setCurrentTrip] = useState<TripDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadTripsFromStorage()
    }
  }, [user])

  const loadTripsFromStorage = () => {
    try {
      if (typeof window !== "undefined") {
        const storedTrips = localStorage.getItem(`trips_${user?.id}`)
        if (storedTrips) {
          const parsedTrips = JSON.parse(storedTrips).map((trip: any) => ({
            ...trip,
            startDate: new Date(trip.startDate),
            endDate: new Date(trip.endDate),
            createdAt: new Date(trip.createdAt),
            updatedAt: new Date(trip.updatedAt),
            itinerary: trip.itinerary?.map((day: any) => ({
              ...day,
              date: new Date(day.date),
            })),
          }))
          setTrips(parsedTrips)
        }
      }
    } catch (error) {
      console.error("Error loading trips from storage:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveTripsToStorage = (tripsToSave: TripDetails[]) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(`trips_${user?.id}`, JSON.stringify(tripsToSave))
      }
    } catch (error) {
      console.error("Error saving trips to storage:", error)
    }
  }

  const calculateTotalCost = useCallback(
    (numberOfNights: number, hotelPrice: number, transportCost: number, numberOfPeople: number) => {
      return numberOfNights * hotelPrice * numberOfPeople + transportCost * numberOfPeople
    },
    [],
  )

  const addTrip = useCallback(
    async (tripData: Omit<TripDetails, "id" | "createdAt" | "updatedAt">) => {
      const newTrip: TripDetails = {
        ...tripData,
        id: `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const updatedTrips = [...trips, newTrip]
      setTrips(updatedTrips)
      saveTripsToStorage(updatedTrips)

      return newTrip
    },
    [trips],
  )

  const updateTrip = useCallback(
    async (id: string, updates: Partial<TripDetails>) => {
      const updatedTrips = trips.map((trip) =>
        trip.id === id
          ? {
              ...trip,
              ...updates,
              updatedAt: new Date(),
            }
          : trip,
      )

      const updatedTrip = updatedTrips.find((t) => t.id === id)
      if (updatedTrip) {
        setTrips(updatedTrips)
        saveTripsToStorage(updatedTrips)
        if (currentTrip?.id === id) {
          setCurrentTrip(updatedTrip)
        }
        return updatedTrip
      }

      return null
    },
    [trips, currentTrip],
  )

  const deleteTrip = useCallback(
    async (id: string) => {
      const updatedTrips = trips.filter((trip) => trip.id !== id)
      setTrips(updatedTrips)
      saveTripsToStorage(updatedTrips)

      if (currentTrip?.id === id) {
        setCurrentTrip(null)
      }

      return true
    },
    [trips, currentTrip],
  )

  const getTrip = useCallback(
    (id: string) => {
      return trips.find((t) => t.id === id)
    },
    [trips],
  )

  const getTripsByStatus = useCallback(
    (status: TripDetails["status"]) => {
      return trips.filter((t) => t.status === status)
    },
    [trips],
  )

  const generateItinerary = useCallback((trip: TripDetails): ItineraryDay[] => {
    const days: ItineraryDay[] = []
    const currentDate = new Date(trip.startDate)

    for (let i = 0; i < trip.numberOfNights; i++) {
      days.push({
        day: i + 1,
        date: new Date(currentDate),
        activities: [
          {
            id: `activity_${i}_1`,
            title: `Explore ${trip.destination.name}`,
            description: "Discover local attractions and landmarks",
            time: "09:00 AM",
            category: "sightseeing",
          },
          {
            id: `activity_${i}_2`,
            title: "Local Restaurant Experience",
            description: "Enjoy authentic local cuisine",
            time: "12:00 PM",
            category: "food",
          },
          {
            id: `activity_${i}_3`,
            title: "Evening Activities",
            description:
              trip.interests.length > 0 ? `Based on your interest in ${trip.interests[0]}` : "Relax and unwind",
            time: "06:00 PM",
            category: "relaxation",
          },
        ],
        meals: [
          { id: `meal_${i}_1`, type: "breakfast", restaurant: "Hotel Restaurant", cuisine: "Multi-cuisine" },
          { id: `meal_${i}_2`, type: "lunch", restaurant: "Local Eatery", cuisine: "Regional" },
          { id: `meal_${i}_3`, type: "dinner", restaurant: "Fine Dining", cuisine: "International" },
        ],
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
  }, [])

  return (
    <TripContext.Provider
      value={{
        trips,
        currentTrip,
        isLoading,
        addTrip,
        updateTrip,
        deleteTrip,
        setCurrentTrip,
        getTrip,
        calculateTotalCost,
        getTripsByStatus,
        generateItinerary,
      }}
    >
      {children}
    </TripContext.Provider>
  )
}

export function useTrip() {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error("useTrip must be used within a TripProvider")
  }
  return context
}
