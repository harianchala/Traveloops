"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  MapPin,
  Calendar,
  IndianRupee,
  Users,
  Search,
  Plus,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useTrip } from "@/lib/trip-context"
import type { TripDetails } from "@/lib/trip-context"
import { format } from "date-fns"
import { motion } from "framer-motion"

export default function TripsPage() {
  const { trips, deleteTrip, updateTrip } = useTrip()
  const [filteredTrips, setFilteredTrips] = useState<TripDetails[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const filtered = trips.filter((trip) => {
      const matchesSearch =
        trip.destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.destination.country.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || trip.status === statusFilter
      return matchesSearch && matchesStatus
    })
    setFilteredTrips(filtered)
  }, [trips, searchTerm, statusFilter])

  const getStatusConfig = (status: TripDetails["status"]) => {
    switch (status) {
      case "planning":
        return {
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
          icon: Clock,
          label: "Planning",
          description: "Trip is being planned",
        }
      case "confirmed":
        return {
          color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          icon: CheckCircle,
          label: "Confirmed",
          description: "Trip is confirmed and ready",
        }
      case "ongoing":
        return {
          color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
          icon: AlertCircle,
          label: "Ongoing",
          description: "You are currently on this trip",
        }
      case "completed":
        return {
          color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
          icon: CheckCircle,
          label: "Completed",
          description: "Trip has been completed",
        }
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          icon: AlertCircle,
          label: "Cancelled",
          description: "Trip has been cancelled",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: Clock,
          label: "Unknown",
          description: "Unknown status",
        }
    }
  }

  const handleDeleteTrip = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteTrip(deleteId)
      setDeleteId(null)
    } catch (error) {
      console.error("Error deleting trip:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStatusChange = async (tripId: string, newStatus: TripDetails["status"]) => {
    await updateTrip(tripId, { status: newStatus })
  }

  const stats = {
    total: trips.length,
    completed: trips.filter((t) => t.status === "completed").length,
    planning: trips.filter((t) => t.status === "planning").length,
    confirmed: trips.filter((t) => t.status === "confirmed").length,
    totalSpent: trips.filter((t) => t.status === "completed").reduce((sum, trip) => sum + trip.totalCost, 0),
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                My Trips
              </h1>
              <p className="text-muted-foreground">Manage and track all your travel adventures</p>
            </div>
            <Link href="/dashboard/plan-trip">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Plan New Trip
              </Button>
            </Link>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Trips</p>
                      <p className="text-3xl font-bold">{stats.total}</p>
                    </div>
                    <div className="text-3xl">🌍</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Planning</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.planning}</p>
                    </div>
                    <div className="text-3xl">📋</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Confirmed</p>
                      <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
                    </div>
                    <div className="text-3xl">✅</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-3xl font-bold">{stats.completed}</p>
                    </div>
                    <div className="text-3xl">🎉</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="text-2xl font-bold">₹{stats.totalSpent.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="text-3xl">💰</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by destination or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-transparent"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-56 h-11">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Trips Grid */}
        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip, index) => {
              const statusConfig = getStatusConfig(trip.status)
              const StatusIcon = statusConfig.icon

              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 h-full flex flex-col">
                    <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 overflow-hidden">
                      <img
                        src={trip.destination.imageUrl || "/placeholder.svg"}
                        alt={trip.destination.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/10" />
                      <Badge className={`absolute top-3 right-3 ${statusConfig.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{trip.destination.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {trip.destination.country}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-1">
                      {trip.destination.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{trip.destination.description}</p>
                      )}

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{format(trip.startDate, "MMM d")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <IndianRupee className="h-4 w-4" />
                          <span>₹{trip.totalCost.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>
                            {trip.numberOfPeople} person{trip.numberOfPeople !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{trip.numberOfNights} nights</span>
                        </div>
                      </div>

                      {trip.interests.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold mb-2 text-muted-foreground">INTERESTS</p>
                          <div className="flex flex-wrap gap-1">
                            {trip.interests.slice(0, 2).map((interest) => (
                              <Badge key={interest} variant="secondary" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                            {trip.interests.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{trip.interests.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t">
                        <p className="text-xs font-semibold mb-2 text-muted-foreground">ACCOMMODATION</p>
                        <p className="text-sm font-medium">{trip.hotel.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ₹{trip.hotel.pricePerNight.toLocaleString("en-IN")} per night
                        </p>
                      </div>
                    </CardContent>

                    <div className="border-t p-4 space-y-3">
                      <Select
                        value={trip.status}
                        onValueChange={(value) => handleStatusChange(trip.id, value as TripDetails["status"])}
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex gap-2">
                        <Link href={`/dashboard/trips/${trip.id}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full bg-transparent">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent"
                          onClick={() => setDeleteId(trip.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="text-6xl mb-4">🧳</div>
            <h3 className="text-lg font-semibold mb-2">No trips found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Start planning your first adventure!"}
            </p>
            <Link href="/dashboard/plan-trip">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Plan Your First Trip
              </Button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this trip? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTrip} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
