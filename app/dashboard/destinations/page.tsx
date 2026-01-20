"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star, Calendar, Search, Thermometer, Droplets, Wind, Ticket } from "lucide-react"
import { getDestinations, type Destination } from "@/lib/supabase"
import { getWeatherData, getWeatherIcon, type WeatherData } from "@/lib/weather"
import { getEventsData, getCategoryIcon, type Event } from "@/lib/events"

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [eventsData, setEventsData] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [eventsLoading, setEventsLoading] = useState(false)

  useEffect(() => {
    loadDestinations()
  }, [])

  useEffect(() => {
    if (selectedDestination) {
      loadWeatherAndEvents(selectedDestination.name)
    }
  }, [selectedDestination])

  const loadDestinations = async () => {
    try {
      const data = await getDestinations()
      setDestinations(data)
      if (data.length > 0) {
        setSelectedDestination(data[0])
      }
    } catch (error) {
      console.error("Error loading destinations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadWeatherAndEvents = async (destinationName: string) => {
    setWeatherLoading(true)
    setEventsLoading(true)

    try {
      console.log("Loading weather and events for:", destinationName)

      const [weather, events] = await Promise.all([getWeatherData(destinationName), getEventsData(destinationName)])

      console.log("Weather data:", weather)
      console.log("Events data:", events)

      setWeatherData(weather)
      setEventsData(events)
    } catch (error) {
      console.error("Error loading weather and events:", error)
    } finally {
      setWeatherLoading(false)
      setEventsLoading(false)
    }
  }

  const filteredDestinations = destinations.filter(
    (destination) =>
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.country.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Destinations</h1>
        <p className="text-muted-foreground mb-4">
          Discover amazing places around the world with real-time weather and local events
        </p>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Destinations List */}
        <div className="lg:col-span-1 space-y-4">
          {filteredDestinations.map((destination) => (
            <Card
              key={destination.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedDestination?.id === destination.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedDestination(destination)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{destination.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {destination.country}
                    </CardDescription>
                  </div>
                  {destination.rating && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {destination.rating}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{destination.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="outline">{destination.category}</Badge>
                  <span className="text-sm font-medium">{destination.price_range}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Destination Details */}
        <div className="lg:col-span-2">
          {selectedDestination ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedDestination.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-base">
                      <MapPin className="h-4 w-4" />
                      {selectedDestination.country}
                    </CardDescription>
                  </div>
                  {selectedDestination.rating && (
                    <Badge className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current" />
                      {selectedDestination.rating}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="weather">Weather</TabsTrigger>
                    <TabsTrigger value="events">Events</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <img
                        src={selectedDestination.image_url || "/placeholder.svg?height=300&width=500"}
                        alt={selectedDestination.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <p className="text-muted-foreground">{selectedDestination.description}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Best Time to Visit</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {selectedDestination.best_time}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Price Range</h4>
                        <p className="text-sm text-muted-foreground">{selectedDestination.price_range}</p>
                      </div>
                    </div>

                    {selectedDestination.highlights && selectedDestination.highlights.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Highlights</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedDestination.highlights.map((highlight, index) => (
                            <Badge key={index} variant="outline">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button className="w-full">Plan Trip to {selectedDestination.name}</Button>
                  </TabsContent>

                  <TabsContent value="weather" className="space-y-4">
                    {weatherLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading weather data...</p>
                      </div>
                    ) : weatherData ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <span className="text-2xl">{getWeatherIcon(weatherData.condition)}</span>
                                Current Weather
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold mb-2">{weatherData.temperature}°C</div>
                              <p className="text-muted-foreground mb-4">{weatherData.condition}</p>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-2">
                                    <Droplets className="h-4 w-4" />
                                    Humidity
                                  </span>
                                  <span>{weatherData.humidity}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-2">
                                    <Wind className="h-4 w-4" />
                                    Wind Speed
                                  </span>
                                  <span>{weatherData.windSpeed} km/h</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">5-Day Forecast</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {weatherData.forecast &&
                                  weatherData.forecast.map((day, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">{getWeatherIcon(day.condition)}</span>
                                        <span className="font-medium">{day.day}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">{day.low}°</span>
                                        <span className="font-medium">{day.high}°</span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Thermometer className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Weather data not available</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="events" className="space-y-4">
                    {eventsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading events...</p>
                      </div>
                    ) : eventsData.length > 0 ? (
                      <div className="grid gap-4">
                        {eventsData.map((event) => (
                          <Card key={event.id}>
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <span className="text-xl">{getCategoryIcon(event.category)}</span>
                                    {event.name}
                                  </CardTitle>
                                  <CardDescription className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {event.location}
                                  </CardDescription>
                                </div>
                                <Badge variant="outline">{event.category}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <span className="text-sm flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {event.date}
                                  </span>
                                  {event.price && (
                                    <span className="text-sm flex items-center gap-1">
                                      <Ticket className="h-3 w-3" />
                                      {event.price}
                                    </span>
                                  )}
                                </div>
                                <Button size="sm" variant="outline">
                                  Learn More
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No events available for this destination</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Try selecting a different destination to see local events
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Select a destination to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
