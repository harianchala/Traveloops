"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Calendar, Users, Clock, Camera, Plus, TrendingUp, Globe, Star, Hotel } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth/auth-provider"
import { useTrip } from "@/lib/trip-context"

export default function Dashboard() {
  const { user } = useAuth()
  const { trips } = useTrip()

  const upcomingTrips = trips.slice(0, 2).map((trip) => ({
    id: trip.id,
    destination: trip.destination.name,
    dates: `${trip.startDate.toLocaleDateString()} - ${trip.endDate.toLocaleDateString()}`,
    status: trip.status === "confirmed" ? "Confirmed" : "Planning",
    progress: trip.status === "confirmed" ? 85 : 45,
    image: trip.destination.imageUrl || "/placeholder.svg?height=200&width=300&text=Destination",
    travelers: trip.numberOfPeople,
    budget: `₹${trip.totalCost.toLocaleString("en-IN")}`,
  }))

  const stats = [
    {
      label: "Trips Planned",
      value: trips.length.toString(),
      icon: MapPin,
      change: `+${Math.max(0, trips.filter((t) => t.status === "planning").length)} planning`,
    },
    {
      label: "Countries Visited",
      value: new Set(trips.map((t) => t.destination.country)).size.toString(),
      icon: Globe,
      change: `${new Set(trips.map((t) => t.destination.country)).size} unique countries`,
    },
    {
      label: "Total Spent",
      value: `₹${trips
        .filter((t) => t.status === "completed")
        .reduce((sum, trip) => sum + trip.totalCost, 0)
        .toLocaleString("en-IN")}`,
      icon: TrendingUp,
      change: "across completed trips",
    },
    {
      label: "Avg Rating",
      value: "4.8",
      icon: Star,
      change: "trip satisfaction",
    },
  ]

  const recentActivity = [
    { action: "Trip planned: " + (trips[0]?.destination.name || "Destination"), time: "Just now", type: "booking" },
    { action: "Hotel recommendations updated", time: "1 hour ago", type: "booking" },
    { action: "Destination guide created", time: "2 hours ago", type: "event" },
    { action: "Trip planning started", time: "1 day ago", type: "weather" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-1">Ready for your next adventure?</p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Link href="/dashboard/plan-trip">
            <Plus className="w-4 h-4 mr-2" />
            Plan New Trip
          </Link>
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Trips */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Trips
                </CardTitle>
                <CardDescription>Your planned adventures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingTrips.length > 0 ? (
                  <>
                    {upcomingTrips.map((trip) => (
                      <motion.div
                        key={trip.id}
                        whileHover={{ scale: 1.02 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{trip.destination}</h3>
                            <p className="text-muted-foreground text-sm flex items-center mt-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              {trip.dates}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {trip.travelers} travelers
                              </span>
                              <span>{trip.budget}</span>
                            </div>
                          </div>
                          <Badge variant={trip.status === "Confirmed" ? "default" : "secondary"}>{trip.status}</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Planning Progress</span>
                            <span>{trip.progress}%</span>
                          </div>
                          <Progress value={trip.progress} className="h-2" />
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/dashboard/trips/${trip.id}`}>View Details</Link>
                          </Button>
                          <Button size="sm" variant="outline">
                            <Camera className="w-4 h-4 mr-1" />
                            Gallery
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href="/dashboard/trips">View All Trips</Link>
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No trips planned yet</p>
                    <Button asChild>
                      <Link href="/dashboard/plan-trip">Plan Your First Trip</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "weather"
                            ? "bg-blue-500"
                            : activity.type === "event"
                              ? "bg-green-500"
                              : activity.type === "booking"
                                ? "bg-purple-500"
                                : "bg-orange-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/dashboard/destinations">
                    <Globe className="w-4 h-4 mr-2" />
                    Explore Destinations
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/dashboard/hotels">
                    <Hotel className="w-4 h-4 mr-2" />
                    Find Hotels
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/dashboard/profile">
                    <Users className="w-4 h-4 mr-2" />
                    Update Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
