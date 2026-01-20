"use client"
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { CalendarIcon, Sparkles, ArrowRight, Loader2, Search, Check } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useDatabase } from "@/lib/database-context"
import { useTrip } from "@/lib/trip-context"

const transportationOptions = [
  { id: "flight", label: "Flight", basePrice: 5000 },
  { id: "train", label: "Train", basePrice: 2000 },
  { id: "bus", label: "Bus", basePrice: 1000 },
]

const interests = [
  "Adventure",
  "Culture",
  "Food",
  "History",
  "Nature",
  "Nightlife",
  "Photography",
  "Relaxation",
  "Shopping",
  "Sports",
  "Art",
  "Music",
]

export default function PlanTrip() {
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchDestination, setSearchDestination] = useState("")
  const [searchHotel, setSearchHotel] = useState("")
  const [openDestinationPopover, setOpenDestinationPopover] = useState(false)
  const [openHotelPopover, setOpenHotelPopover] = useState(false)

  const { destinations, hotels, getHotelsByDestination } = useDatabase()
  const { addTrip } = useTrip()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    destination: null as (typeof destinations)[0] | null,
    hotel: null as (typeof hotels)[0] | null,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    numberOfPeople: 1,
    budget: 50000,
    interests: [] as string[],
    travelStyle: "",
    transportation: "",
    specialRequests: "",
  })

  const filteredDestinations = destinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(searchDestination.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchDestination.toLowerCase()),
  )

  const filteredHotels = formData.destination
    ? getHotelsByDestination(formData.destination.id).filter((hotel) =>
        hotel.name.toLowerCase().includes(searchHotel.toLowerCase()),
      )
    : []

  const numberOfNights = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 0
    return Math.max(1, differenceInDays(formData.endDate, formData.startDate))
  }, [formData.startDate, formData.endDate])

  const transportationCost = useMemo(() => {
    if (!formData.transportation) return 0
    const option = transportationOptions.find((t) => t.id === formData.transportation)
    return (option?.basePrice || 0) * formData.numberOfPeople
  }, [formData.transportation, formData.numberOfPeople])

  const hotelCost = useMemo(() => {
    if (!formData.hotel || numberOfNights === 0) return 0
    return formData.hotel.price_per_night * numberOfNights * formData.numberOfPeople
  }, [formData.hotel, numberOfNights, formData.numberOfPeople])

  const totalCost = hotelCost + transportationCost

  const handleAddInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleProceed = async () => {
    if (step === 1) {
      if (!formData.destination || !formData.hotel) {
        toast({
          title: "Error",
          description: "Please select a destination and hotel",
          variant: "destructive",
        })
        return
      }
      if (!formData.startDate || !formData.endDate) {
        toast({
          title: "Error",
          description: "Please select start and end dates",
          variant: "destructive",
        })
        return
      }
      if (!formData.transportation) {
        toast({
          title: "Error",
          description: "Please select transportation",
          variant: "destructive",
        })
        return
      }
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else if (step === 3) {
      setIsGenerating(true)
      try {
        if (!formData.destination || !formData.hotel || !formData.startDate || !formData.endDate) {
          throw new Error("Missing required trip data")
        }

        const tripData = {
          destination: formData.destination.name,
          hotel: formData.hotel.name,
          startDate: formData.startDate.toISOString(),
          endDate: formData.endDate.toISOString(),
          numberOfPeople: formData.numberOfPeople,
          transportation: formData.transportation,
          interests: formData.interests,
          totalCost: totalCost,
          status: "confirmed",
        }

        addTrip(tripData)

        toast({
          title: "Trip Planned Successfully!",
          description: `Your ${formData.destination.name} trip has been added to your itinerary.`,
        })

        router.push("/dashboard/trips")
      } catch (error) {
        console.error("Error planning trip:", error)
        toast({
          title: "Error",
          description: "Failed to plan trip. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsGenerating(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              Plan Your Trip
            </h1>
            <p className="text-muted-foreground mt-2">
              Step {step} of 3: {step === 1 ? "Basics" : step === 2 ? "Preferences" : "Review"}
            </p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
                  step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600",
                )}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Step 1: Basics */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Destination & Hotel</CardTitle>
              <CardDescription>Choose where you want to go and where you'll stay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Destination Selection */}
              <div className="space-y-2">
                <Label>Destination</Label>
                <Popover open={openDestinationPopover} onOpenChange={setOpenDestinationPopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-transparent"
                      role="combobox"
                      aria-expanded={openDestinationPopover}
                    >
                      {formData.destination ? (
                        <span>
                          {formData.destination.name}, {formData.destination.country}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Search destinations...</span>
                      )}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search destinations..."
                        value={searchDestination}
                        onValueChange={setSearchDestination}
                      />
                      <CommandList>
                        <CommandEmpty>No destination found.</CommandEmpty>
                        <CommandGroup>
                          {filteredDestinations.map((dest) => (
                            <CommandItem
                              key={dest.id}
                              value={dest.id}
                              onSelect={() => {
                                setFormData({ ...formData, destination: dest, hotel: null })
                                setOpenDestinationPopover(false)
                                setSearchDestination("")
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.destination?.id === dest.id ? "opacity-100" : "opacity-0",
                                )}
                              />
                              <div>
                                <p className="font-medium">{dest.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  ₹{dest.price_per_night}/night • {dest.rating}/5
                                </p>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Hotel Selection */}
              {formData.destination && (
                <div className="space-y-2">
                  <Label>Hotel</Label>
                  <Popover open={openHotelPopover} onOpenChange={setOpenHotelPopover}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-transparent"
                        role="combobox"
                        aria-expanded={openHotelPopover}
                      >
                        {formData.hotel ? (
                          <span>{formData.hotel.name}</span>
                        ) : (
                          <span className="text-muted-foreground">Select a hotel...</span>
                        )}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search hotels..."
                          value={searchHotel}
                          onValueChange={setSearchHotel}
                        />
                        <CommandList>
                          <CommandEmpty>No hotel found.</CommandEmpty>
                          <CommandGroup>
                            {filteredHotels.map((hotel) => (
                              <CommandItem
                                key={hotel.id}
                                value={hotel.id}
                                onSelect={() => {
                                  setFormData({ ...formData, hotel })
                                  setOpenHotelPopover(false)
                                  setSearchHotel("")
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.hotel?.id === hotel.id ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                <div>
                                  <p className="font-medium">{hotel.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    ₹{hotel.price_per_night}/night • {hotel.rating}/5 • {hotel.location}
                                  </p>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "MMM dd, yyyy") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "MMM dd, yyyy") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData({ ...formData, endDate: date })}
                        disabled={(date) => date <= (formData.startDate || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Number of People */}
              <div className="space-y-2">
                <Label>Number of People</Label>
                <Select
                  value={String(formData.numberOfPeople)}
                  onValueChange={(val) => setFormData({ ...formData, numberOfPeople: Number.parseInt(val) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num} {num === 1 ? "Person" : "People"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Transportation */}
              <div className="space-y-2">
                <Label>Transportation</Label>
                <Select
                  value={formData.transportation}
                  onValueChange={(val) => setFormData({ ...formData, transportation: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transportation..." />
                  </SelectTrigger>
                  <SelectContent>
                    {transportationOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label} - ₹{(option.basePrice * formData.numberOfPeople).toLocaleString("en-IN")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Preferences */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Preferences</CardTitle>
              <CardDescription>Tell us what you enjoy most</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-4 block">Interests</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interests.map((interest) => (
                    <div key={interest} className="flex items-center gap-2">
                      <Checkbox
                        id={interest}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={() => handleAddInterest(interest)}
                      />
                      <Label htmlFor={interest} className="font-normal cursor-pointer">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Travel Style</Label>
                <Select
                  value={formData.travelStyle}
                  onValueChange={(val) => setFormData({ ...formData, travelStyle: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your style..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luxury">Luxury & Comfort</SelectItem>
                    <SelectItem value="budget">Budget-Friendly</SelectItem>
                    <SelectItem value="adventure">Adventure Seeker</SelectItem>
                    <SelectItem value="relaxation">Relaxation & Wellness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Special Requests</Label>
                <Textarea
                  placeholder="Any special requirements or preferences?"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="min-h-24"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Your Trip</CardTitle>
              <CardDescription>Confirm all details before booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Destination</p>
                    <p className="text-lg font-semibold">
                      {formData.destination?.name}, {formData.destination?.country}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hotel</p>
                    <p className="text-lg font-semibold">{formData.hotel?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dates</p>
                    <p className="text-lg font-semibold">
                      {formData.startDate &&
                        formData.endDate &&
                        `${format(formData.startDate, "MMM dd")} - ${format(formData.endDate, "MMM dd, yyyy")} (${numberOfNights} nights)`}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Travelers</p>
                    <p className="text-lg font-semibold">
                      {formData.numberOfPeople} {formData.numberOfPeople === 1 ? "Person" : "People"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transportation</p>
                    <p className="text-lg font-semibold">
                      {transportationOptions.find((t) => t.id === formData.transportation)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Interests</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.interests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>
                        Hotel ({numberOfNights} nights × {formData.numberOfPeople} people)
                      </span>
                      <span className="font-semibold">₹{hotelCost.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transportation ({formData.numberOfPeople} people)</span>
                      <span className="font-semibold">₹{transportationCost.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg">
                      <span className="font-bold">Total Cost</span>
                      <span className="font-bold text-blue-600">₹{totalCost.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-end">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Previous
          </Button>
        )}
        <Button onClick={handleProceed} disabled={isGenerating} className="gap-2">
          {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
          {step === 3 ? "Confirm Trip" : "Continue"}
          {step < 3 && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
