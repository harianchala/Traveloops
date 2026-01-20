"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Hotel, Search, Star, MapPin, Wifi, Car, Coffee, Dumbbell } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useDatabase } from "@/lib/database-context"

export default function Hotels() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const { destinations, hotels, getHotelsByDestination } = useDatabase()
  const { toast } = useToast()

  const categories = [
    { value: "all", label: "All Hotels" },
    { value: "Budget", label: "Budget" },
    { value: "3-Star", label: "3-Star" },
    { value: "4-Star", label: "4-Star" },
    { value: "5-Star", label: "5-Star" },
    { value: "Luxury", label: "Luxury" },
  ]

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "budget", label: "Under ₹2,000" },
    { value: "mid", label: "₹2,000 - ₹10,000" },
    { value: "luxury", label: "₹10,000+" },
  ]

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || hotel.category === selectedCategory
    const matchesPrice = {
      all: true,
      budget: hotel.price_per_night < 2000,
      mid: hotel.price_per_night >= 2000 && hotel.price_per_night <= 10000,
      luxury: hotel.price_per_night > 10000,
    }[priceRange]

    return matchesSearch && matchesCategory && matchesPrice
  })

  const handleBooking = (hotelName: string) => {
    toast({
      title: "Hotel Added to Trip",
      description: `${hotelName} has been added to your trip planning.`,
    })
  }

  const amenityIcons: Record<string, React.ReactNode> = {
    WiFi: <Wifi className="h-4 w-4" />,
    Parking: <Car className="h-4 w-4" />,
    Restaurant: <Coffee className="h-4 w-4" />,
    Gym: <Dumbbell className="h-4 w-4" />,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hotels</h1>
        <p className="text-muted-foreground mt-2">Browse and book hotels at your favorite destinations</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Hotels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hotels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setPriceRange("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotels Grid */}
      {filteredHotels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <Hotel className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{hotel.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {hotel.location}
                      </CardDescription>
                    </div>
                    <Badge className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {hotel.rating}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{hotel.description}</p>

                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">₹{hotel.price_per_night}</p>
                    <p className="text-xs text-muted-foreground">per night</p>
                  </div>

                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-2">Amenities:</p>
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-xs flex items-center gap-1">
                            {amenityIcons[amenity] || null}
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button className="w-full" onClick={() => handleBooking(hotel.name)} disabled={!hotel.availability}>
                    {hotel.availability ? "Book Now" : "Unavailable"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Hotel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No hotels found matching your criteria</p>
        </Card>
      )}
    </div>
  )
}
