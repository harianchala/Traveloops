"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  IndianRupee,
  Plane,
  Hotel,
  Camera,
  UtensilsCrossed,
  Download,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Home,
  Navigation,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useTrip } from "@/lib/trip-context"
import { format } from "date-fns"

export default function TripDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = params.tripId as string
  const { getTrip, generateItinerary } = useTrip()

  const trip = getTrip(tripId)
  const itinerary = trip ? generateItinerary(trip) : []

  if (!trip) {
    return (
      <div className="p-6 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold mb-2">Trip Not Found</h2>
        <p className="text-muted-foreground mb-6">The trip you're looking for doesn't exist.</p>
        <Link href="/dashboard/trips">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Back to Trips</Button>
        </Link>
      </div>
    )
  }

  const budgetSpent = trip.totalCost * 0.7
  const remaining = trip.totalCost - budgetSpent
  const progress = (budgetSpent / trip.totalCost) * 100

  const getActivityIcon = (category: string) => {
    switch (category) {
      case "sightseeing":
        return Camera
      case "food":
        return UtensilsCrossed
      case "adventure":
        return Plane
      case "relaxation":
        return Home
      default:
        return MapPin
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "confirmed":
        return { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle }
      case "planning":
        return { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: AlertCircle }
      case "ongoing":
        return { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", icon: Navigation }
      case "completed":
        return { color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400", icon: CheckCircle }
      default:
        return { color: "bg-gray-100 text-gray-800", icon: AlertCircle }
    }
  }

  const statusConfig = getStatusConfig(trip.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full bg-transparent">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Trip Details
          </h1>
        </motion.div>

        {/* Trip Header Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-400 relative overflow-hidden">
              <img
                src={trip.destination.imageUrl || "/placeholder.svg"}
                alt={trip.destination.name}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{trip.destination.name}</h2>
                  <p className="text-muted-foreground flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4" />
                    {trip.destination.country}
                  </p>
                </div>
                <Badge className={`${statusConfig.color} text-base px-3 py-1`}>
                  <StatusIcon className="h-4 w-4 mr-2" />
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <p className="font-semibold">{format(trip.startDate, "MMM d, yyyy")}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <p className="font-semibold">{format(trip.endDate, "MMM d, yyyy")}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <p className="font-semibold">{trip.numberOfNights} nights</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Travelers</p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <p className="font-semibold">{trip.numberOfPeople} people</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Budget Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Budget</p>
                <div className="flex items-baseline gap-2">
                  <IndianRupee className="h-5 w-5 text-blue-600" />
                  <p className="text-3xl font-bold">₹{trip.totalCost.toLocaleString("en-IN")}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Hotel Cost</p>
                <div className="flex items-baseline gap-2">
                  <Hotel className="h-5 w-5 text-green-600" />
                  <p className="text-3xl font-bold">
                    ₹{(trip.hotel.pricePerNight * trip.numberOfNights).toLocaleString("en-IN")}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ₹{trip.hotel.pricePerNight.toLocaleString("en-IN")} × {trip.numberOfNights} nights
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Transport Cost</p>
                <div className="flex items-baseline gap-2">
                  <Plane className="h-5 w-5 text-purple-600" />
                  <p className="text-3xl font-bold">₹{trip.transportation.cost.toLocaleString("en-IN")}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{trip.transportation.type}</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Tabs defaultValue="itinerary" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur border-0">
              <TabsTrigger value="itinerary">Day-by-Day Itinerary</TabsTrigger>
              <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            {/* Itinerary Tab */}
            <TabsContent value="itinerary" className="space-y-6">
              {itinerary.map((day, dayIndex) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: dayIndex * 0.1 }}
                >
                  <Card className="border-0 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl">Day {day.day}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-2">
                            <Calendar className="h-4 w-4" />
                            {format(day.date, "EEEE, MMMM d, yyyy")}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="px-3 py-1">
                          {day.activities.length} activities
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {day.activities.map((activity, actIndex) => {
                          const ActivityIcon = getActivityIcon(activity.category)
                          return (
                            <motion.div
                              key={activity.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: actIndex * 0.05 }}
                              className="flex gap-4"
                            >
                              <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white mb-2">
                                  <ActivityIcon className="h-5 w-5" />
                                </div>
                                {actIndex < day.activities.length - 1 && (
                                  <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
                                )}
                              </div>
                              <div className="flex-1 pt-1 pb-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-semibold text-lg">{activity.title}</h4>
                                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                                  </div>
                                  <Badge variant="secondary" className="whitespace-nowrap">
                                    {activity.time}
                                  </Badge>
                                </div>
                                {activity.duration && (
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {activity.duration}
                                  </p>
                                )}
                                {activity.cost && (
                                  <p className="text-sm font-medium text-blue-600 flex items-center gap-1 mt-2">
                                    <IndianRupee className="h-3 w-3" />₹{activity.cost.toLocaleString("en-IN")}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            {/* Accommodation Tab */}
            <TabsContent value="accommodation" className="space-y-6">
              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                  <CardTitle className="flex items-center gap-2">
                    <Hotel className="h-5 w-5" />
                    {trip.hotel.name}
                  </CardTitle>
                  <CardDescription>{trip.hotel.location}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Rating</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={i < Math.floor(trip.hotel.rating) ? "text-yellow-400" : "text-gray-300"}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="font-semibold">{trip.hotel.rating}/5</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-2">
                          {trip.hotel.amenities.map((amenity) => (
                            <Badge key={amenity} variant="secondary">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Price per Night</p>
                        <p className="text-3xl font-bold flex items-baseline gap-1">
                          <IndianRupee className="h-6 w-6" />
                          {trip.hotel.pricePerNight.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Total Stay Cost</p>
                        <p className="text-3xl font-bold flex items-baseline gap-1">
                          <IndianRupee className="h-6 w-6" />
                          {(trip.hotel.pricePerNight * trip.numberOfNights).toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {trip.numberOfNights} nights × {trip.numberOfPeople} person
                          {trip.numberOfPeople !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Summary Tab */}
            <TabsContent value="summary" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Trip Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Destination</span>
                        <span className="font-semibold">{trip.destination.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Travel Style</span>
                        <span className="font-semibold capitalize">{trip.travelStyle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Travelers</span>
                        <span className="font-semibold">{trip.numberOfPeople}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-semibold">{trip.numberOfNights} nights</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Interests & Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {trip.interests.map((interest) => (
                          <Badge key={interest} className="bg-blue-600">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {trip.specialRequests && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Special Requests</p>
                        <p className="text-sm bg-muted p-3 rounded">{trip.specialRequests}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-md bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Trip Ready
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your itinerary is complete and ready for your adventure. Download a copy for your records.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download Itinerary PDF
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
