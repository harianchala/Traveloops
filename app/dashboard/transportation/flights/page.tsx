"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plane, MapPin, Users } from "lucide-react"
import { motion } from "framer-motion"

const mockFlights = [
  {
    id: "flight_1",
    airline: "IndiGo",
    departure: "Delhi (DEL)",
    arrival: "Bombay (BOM)",
    departureTime: "08:00 AM",
    arrivalTime: "10:30 AM",
    duration: "2h 30m",
    price: 3500,
    stops: "Non-stop",
    seats: 5,
  },
  {
    id: "flight_2",
    airline: "SpiceJet",
    departure: "Delhi (DEL)",
    arrival: "Bombay (BOM)",
    departureTime: "02:00 PM",
    arrivalTime: "04:15 PM",
    duration: "2h 15m",
    price: 2800,
    stops: "Non-stop",
    seats: 12,
  },
  {
    id: "flight_3",
    airline: "Air India",
    departure: "Delhi (DEL)",
    arrival: "Bombay (BOM)",
    departureTime: "06:00 PM",
    arrivalTime: "08:45 PM",
    duration: "2h 45m",
    price: 4200,
    stops: "Non-stop",
    seats: 3,
  },
]

export default function FlightsPage() {
  const [flights, setFlights] = useState(mockFlights)
  const [selectedFlights, setSelectedFlights] = useState<string[]>([])
  const [filterAirline, setFilterAirline] = useState("all")

  const filteredFlights = flights.filter((flight) => filterAirline === "all" || flight.airline === filterAirline)

  const airlines = Array.from(new Set(flights.map((f) => f.airline)))

  const handleSelectFlight = (flightId: string) => {
    setSelectedFlights((prev) => (prev.includes(flightId) ? prev.filter((id) => id !== flightId) : [...prev, flightId]))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          <Plane className="inline h-8 w-8 mr-2" />
          Book Flights
        </h1>
        <p className="text-muted-foreground">Find and book the best flights for your trip</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 flex gap-4"
      >
        <Select value={filterAirline} onValueChange={setFilterAirline}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Airlines</SelectItem>
            {airlines.map((airline) => (
              <SelectItem key={airline} value={airline}>
                {airline}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Flights List */}
      <div className="space-y-4">
        {filteredFlights.map((flight, index) => (
          <motion.div
            key={flight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-0">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="font-semibold text-lg">{flight.airline}</p>
                    <p className="text-sm text-muted-foreground">{flight.stops}</p>
                  </div>

                  <div className="flex items-center justify-between md:justify-start gap-2">
                    <div>
                      <p className="font-bold text-lg">{flight.departureTime}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {flight.departure}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{flight.duration}</p>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-2"></div>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{flight.arrivalTime}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {flight.arrival}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {flight.seats} seat{flight.seats !== 1 ? "s" : ""} left
                    </span>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">₹{flight.price.toLocaleString("en-IN")}</p>
                      <p className="text-xs text-muted-foreground">per person</p>
                    </div>
                    <Button
                      onClick={() => handleSelectFlight(flight.id)}
                      className={`${
                        selectedFlights.includes(flight.id)
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      }`}
                    >
                      {selectedFlights.includes(flight.id) ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
