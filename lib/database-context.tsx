"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Destination {
  id: string
  name: string
  country: string
  description?: string
  image_url?: string
  rating?: number
  price_per_night?: number
  best_time?: string
  highlights?: string[]
  category?: string
}

export interface Hotel {
  id: string
  destination_id: string
  name: string
  location: string
  description?: string
  image_url?: string
  rating?: number
  price_per_night?: number
  category?: string
  amenities?: string[]
  features?: string[]
  availability?: boolean
}

interface DatabaseContextType {
  destinations: Destination[]
  hotels: Hotel[]
  addDestination: (destination: Omit<Destination, "id">) => void
  updateDestination: (id: string, destination: Partial<Destination>) => void
  deleteDestination: (id: string) => void
  addHotel: (hotel: Omit<Hotel, "id">) => void
  updateHotel: (id: string, hotel: Partial<Hotel>) => void
  deleteHotel: (id: string) => void
  getHotelsByDestination: (destinationId: string) => Hotel[]
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined)

const initialDestinations: Destination[] = []
const initialHotels: Hotel[] = []

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])

  useEffect(() => {
    const savedDestinations = localStorage.getItem("destinations")
    const savedHotels = localStorage.getItem("hotels")

    if (savedDestinations) {
      setDestinations(JSON.parse(savedDestinations))
    } else {
      setDestinations(initialDestinations)
      localStorage.setItem("destinations", JSON.stringify(initialDestinations))
    }

    if (savedHotels) {
      setHotels(JSON.parse(savedHotels))
    } else {
      setHotels(initialHotels)
      localStorage.setItem("hotels", JSON.stringify(initialHotels))
    }
  }, [])

  const addDestination = (destination: Omit<Destination, "id">) => {
    const newDestination: Destination = {
      ...destination,
      id: `dest_${Date.now()}`,
    }
    const updated = [...destinations, newDestination]
    setDestinations(updated)
    localStorage.setItem("destinations", JSON.stringify(updated))
  }

  const updateDestination = (id: string, updates: Partial<Destination>) => {
    const updated = destinations.map((dest) => (dest.id === id ? { ...dest, ...updates } : dest))
    setDestinations(updated)
    localStorage.setItem("destinations", JSON.stringify(updated))
  }

  const deleteDestination = (id: string) => {
    const updated = destinations.filter((dest) => dest.id !== id)
    setDestinations(updated)
    localStorage.setItem("destinations", JSON.stringify(updated))
  }

  const addHotel = (hotel: Omit<Hotel, "id">) => {
    const newHotel: Hotel = {
      ...hotel,
      id: `hotel_${Date.now()}`,
    }
    const updated = [...hotels, newHotel]
    setHotels(updated)
    localStorage.setItem("hotels", JSON.stringify(updated))
  }

  const updateHotel = (id: string, updates: Partial<Hotel>) => {
    const updated = hotels.map((hotel) => (hotel.id === id ? { ...hotel, ...updates } : hotel))
    setHotels(updated)
    localStorage.setItem("hotels", JSON.stringify(updated))
  }

  const deleteHotel = (id: string) => {
    const updated = hotels.filter((hotel) => hotel.id !== id)
    setHotels(updated)
    localStorage.setItem("hotels", JSON.stringify(updated))
  }

  const getHotelsByDestination = (destinationId: string) => {
    return hotels.filter((hotel) => hotel.destination_id === destinationId)
  }

  return (
    <DatabaseContext.Provider
      value={{
        destinations,
        hotels,
        addDestination,
        updateDestination,
        deleteDestination,
        addHotel,
        updateHotel,
        deleteHotel,
        getHotelsByDestination,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  )
}

export function useDatabase() {
  const context = useContext(DatabaseContext)
  if (!context) {
    throw new Error("useDatabase must be used within DatabaseProvider")
  }
  return context
}
