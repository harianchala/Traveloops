"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Train, MapPin, Users } from "lucide-react"
import { motion } from "framer-motion"

const mockTrains = [
  {
    id: "train_1",
    name: "Rajdhani Express",
    number: "12301",
    departure: "New Delhi",
    arrival: "Mumbai Central",
    departureTime: "04:00 PM",
    arrivalTime: "08:15 AM +1",
    duration: "16h 15m",
    price: 2500,
    class: "1A",
    seats: 8,
  },
  {
    id: "train_2",
    name: "Shatabdi Express",
    number: "12002",
    departure: "New Delhi",
    arrival: "Agra Cantt",
    departureTime: "06:00 AM",
    arrivalTime: "08:20 AM",
    duration: "2h 20m",
    price: 500,
    class: "Chair Car",
    seats: 15,
  },
  {
    id: "train_3",
    name: "Ghaziabad Express",
    number: "14006",
    departure: "New Delhi",
    arrival: "Lucknow",
    departureTime: "07:30 PM",
    arrivalTime: "05:45 AM +1",
    duration: "10h 15m",
    price: 1200,
    class: "Sleeper",
    seats: 6,
  },
]

export default function TrainsPage() {
  const [trains, setTrains] = useState(mockTrains)
  const [selectedTrains, setSelectedTrains] = useState<string[]>([])
  const [filterClass, setFilterClass] = useState("all")

  const filteredTrains = trains.filter((train) => filterClass === "all" || train.class === filterClass)
  const classes = Array.from(new Set(trains.map((t) => t.class)))

  const handleSelectTrain = (trainId: string) => {
    setSelectedTrains((prev) => (prev.includes(trainId) ? prev.filter((id) => id !== trainId) : [...prev, trainId]))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          <Train className="inline h-8 w-8 mr-2" />
          Book Trains
        </h1>
        <p className="text-muted-foreground">Book comfortable train journeys across India</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 flex gap-4"
      >
        <Select value={filterClass} onValueChange={setFilterClass}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((classType) => (
              <SelectItem key={classType} value={classType}>
                {classType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <div className="space-y-4">
        {filteredTrains.map((train, index) => (
          <motion.div
            key={train.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-0">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="font-semibold text-lg">{train.name}</p>
                    <p className="text-sm text-muted-foreground">Train #{train.number}</p>
                    <Badge variant="outline" className="mt-2">
                      {train.class}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between md:justify-start gap-2">
                    <div>
                      <p className="font-bold text-lg">{train.departureTime}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {train.departure}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{train.duration}</p>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-2"></div>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{train.arrivalTime}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {train.arrival}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{train.seats} seats left</span>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">₹{train.price.toLocaleString("en-IN")}</p>
                      <p className="text-xs text-muted-foreground">per ticket</p>
                    </div>
                    <Button
                      onClick={() => handleSelectTrain(train.id)}
                      className={`${
                        selectedTrains.includes(train.id)
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      }`}
                    >
                      {selectedTrains.includes(train.id) ? "Selected" : "Select"}
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
