"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bus, MapPin, Users, Armchair } from "lucide-react"
import { motion } from "framer-motion"

const mockBuses = [
  {
    id: "bus_1",
    operator: "Volvo Travels",
    departure: "Delhi",
    arrival: "Jaipur",
    departureTime: "06:00 PM",
    arrivalTime: "10:30 PM",
    duration: "4h 30m",
    price: 800,
    type: "AC Sleeper",
    seats: 12,
  },
  {
    id: "bus_2",
    operator: "Shree Ashirwad",
    departure: "Delhi",
    arrival: "Agra",
    departureTime: "07:00 AM",
    arrivalTime: "10:15 AM",
    duration: "3h 15m",
    price: 500,
    type: "AC Seater",
    seats: 8,
  },
  {
    id: "bus_3",
    operator: "Orange Tours",
    departure: "Delhi",
    arrival: "Lucknow",
    departureTime: "08:00 PM",
    arrivalTime: "06:00 AM +1",
    duration: "10h",
    price: 1000,
    type: "AC Sleeper",
    seats: 5,
  },
]

export default function BusesPage() {
  const [buses, setBuses] = useState(mockBuses)
  const [selectedBuses, setSelectedBuses] = useState<string[]>([])
  const [filterType, setFilterType] = useState("all")

  const filteredBuses = buses.filter((bus) => filterType === "all" || bus.type === filterType)
  const types = Array.from(new Set(buses.map((b) => b.type)))

  const handleSelectBus = (busId: string) => {
    setSelectedBuses((prev) => (prev.includes(busId) ? prev.filter((id) => id !== busId) : [...prev, busId]))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          <Bus className="inline h-8 w-8 mr-2" />
          Book Buses
        </h1>
        <p className="text-muted-foreground">Comfortable and affordable bus travel options</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 flex gap-4"
      >
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <div className="space-y-4">
        {filteredBuses.map((bus, index) => (
          <motion.div
            key={bus.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-0">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="font-semibold text-lg">{bus.operator}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Armchair className="h-3 w-3" />
                      {bus.type}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-start gap-2">
                    <div>
                      <p className="font-bold text-lg">{bus.departureTime}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {bus.departure}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{bus.duration}</p>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-2"></div>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{bus.arrivalTime}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {bus.arrival}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{bus.seats} seats left</span>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">₹{bus.price.toLocaleString("en-IN")}</p>
                      <p className="text-xs text-muted-foreground">per ticket</p>
                    </div>
                    <Button
                      onClick={() => handleSelectBus(bus.id)}
                      className={`${
                        selectedBuses.includes(bus.id)
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      }`}
                    >
                      {selectedBuses.includes(bus.id) ? "Selected" : "Select"}
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
