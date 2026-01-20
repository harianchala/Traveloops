"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Search, Star, MapPin, Calendar, DollarSign, TrendingUp, Heart, Filter } from "lucide-react"

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const destinations = [
    {
      id: 1,
      name: "Tokyo, Japan",
      description: "A perfect blend of traditional culture and modern innovation",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.8,
      price: "$$$",
      bestTime: "Mar-May, Sep-Nov",
      highlights: ["Sushi", "Temples", "Technology", "Cherry Blossoms"],
      category: "culture",
    },
    {
      id: 2,
      name: "Santorini, Greece",
      description: "Stunning sunsets and white-washed buildings overlooking the Aegean Sea",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.9,
      price: "$$",
      bestTime: "Apr-Oct",
      highlights: ["Sunsets", "Wine", "Beaches", "Architecture"],
      category: "relaxation",
    },
    {
      id: 3,
      name: "Patagonia, Chile",
      description: "Breathtaking landscapes and world-class hiking adventures",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.7,
      price: "$$",
      bestTime: "Dec-Mar",
      highlights: ["Hiking", "Glaciers", "Wildlife", "Photography"],
      category: "adventure",
    },
    {
      id: 4,
      name: "Paris, France",
      description: "The city of love, art, and incredible cuisine",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.6,
      price: "$$$",
      bestTime: "Apr-Jun, Sep-Oct",
      highlights: ["Museums", "Cuisine", "Romance", "Architecture"],
      category: "culture",
    },
    {
      id: 5,
      name: "Bali, Indonesia",
      description: "Tropical paradise with rich culture and stunning beaches",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.5,
      price: "$",
      bestTime: "Apr-Oct",
      highlights: ["Beaches", "Temples", "Yoga", "Rice Terraces"],
      category: "relaxation",
    },
    {
      id: 6,
      name: "Iceland",
      description: "Land of fire and ice with incredible natural phenomena",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.8,
      price: "$$$",
      bestTime: "Jun-Aug, Sep-Mar",
      highlights: ["Northern Lights", "Waterfalls", "Hot Springs", "Glaciers"],
      category: "nature",
    },
  ]

  const categories = [
    { value: "all", label: "All Destinations" },
    { value: "culture", label: "Culture & History" },
    { value: "adventure", label: "Adventure" },
    { value: "relaxation", label: "Relaxation" },
    { value: "nature", label: "Nature" },
    { value: "food", label: "Food & Cuisine" },
  ]

  const trendingDestinations = [
    { name: "Portugal", growth: "+45%" },
    { name: "Vietnam", growth: "+38%" },
    { name: "Morocco", growth: "+32%" },
    { name: "Colombia", growth: "+28%" },
  ]

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || dest.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Destinations</h1>
        <p className="text-gray-600">Discover amazing places powered by AI recommendations</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90">
                      {destination.price}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{destination.name}</CardTitle>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{destination.rating}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription>{destination.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Best time: {destination.bestTime}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {destination.highlights.map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1">
                        Plan Trip
                      </Button>
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Destinations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="w-5 h-5 mr-2" />
                Trending Now
              </CardTitle>
              <CardDescription>Popular destinations this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trendingDestinations.map((dest, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{dest.name}</span>
                    <Badge variant="secondary" className="text-green-700 bg-green-100">
                      {dest.growth}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Globe className="w-5 h-5 mr-2" />
                AI Picks for You
              </CardTitle>
              <CardDescription>Based on your preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Kyoto, Japan</h4>
                  <p className="text-sm text-gray-600 mt-1">Perfect for culture lovers</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600 ml-1">4.9 • $$$</span>
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Costa Rica</h4>
                  <p className="text-sm text-gray-600 mt-1">Adventure and nature combined</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600 ml-1">4.7 • $$</span>
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Tuscany, Italy</h4>
                  <p className="text-sm text-gray-600 mt-1">Food and scenic landscapes</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600 ml-1">4.8 • $$$</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <MapPin className="w-4 h-4 mr-2" />
                Surprise Me
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <DollarSign className="w-4 h-4 mr-2" />
                Budget Destinations
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="w-4 h-4 mr-2" />
                Last Minute Deals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
