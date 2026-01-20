"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, MapPin, Calendar, Clock, Users, Star, ExternalLink } from "lucide-react"
import { getEventsData, getCategoryIcon, type Event } from "@/lib/events"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [searchCity, setSearchCity] = useState("")
  const [currentCity, setCurrentCity] = useState("Tokyo")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    handleSearch("Tokyo")
  }, [])

  const handleSearch = async (city?: string) => {
    const cityToSearch = city || searchCity
    if (!cityToSearch.trim()) return

    setLoading(true)
    try {
      const data = await getEventsData(cityToSearch)
      setEvents(data)
      setCurrentCity(cityToSearch)
      if (!city) setSearchCity("")
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const popularCities = ["Tokyo", "Paris", "New York", "London", "Dubai", "Sydney", "Rome", "Bangkok"]
  const categories = ["all", "Culture", "Food", "Music", "Art", "Festival", "Sport"]

  const filteredEvents = events.filter((event) => selectedCategory === "all" || event.category === selectedCategory)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Local Events</h1>
        <p className="text-muted-foreground">Discover exciting events and activities in your destination</p>

        <div className="flex gap-2 max-w-md">
          <Input
            placeholder="Search for a city..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={() => handleSearch()} disabled={loading}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {popularCities.map((city) => (
            <Button
              key={city}
              variant={currentCity === city ? "default" : "outline"}
              size="sm"
              onClick={() => handleSearch(city)}
              disabled={loading}
            >
              {city}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === "all" ? "All Categories" : `${getCategoryIcon(category)} ${category}`}
            </Button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {!loading && filteredEvents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No events found for {currentCity}</p>
            <p className="text-sm text-muted-foreground mt-2">Try searching for a different city</p>
          </CardContent>
        </Card>
      )}

      {!loading && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(event.category)}</span>
                    <Badge variant="secondary">{event.category}</Badge>
                  </div>
                  {event.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{event.rating}</span>
                    </div>
                  )}
                </div>
                <CardTitle className="line-clamp-2">{event.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                    {event.time && (
                      <>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>{event.time}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>

                  {event.attendees && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees.toLocaleString()} attendees</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="font-semibold text-lg">{event.price}</div>
                  {event.url && (
                    <Button size="sm" asChild>
                      <a href={event.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </a>
                    </Button>
                  )}
                </div>

                {event.venue && (
                  <div className="text-xs text-muted-foreground">
                    <strong>Venue:</strong> {event.venue}
                  </div>
                )}

                {event.organizer && (
                  <div className="text-xs text-muted-foreground">
                    <strong>Organizer:</strong> {event.organizer}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
