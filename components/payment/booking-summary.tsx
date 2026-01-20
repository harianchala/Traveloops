"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Users, Plane, Hotel, Camera, Utensils } from "lucide-react"

interface BookingItem {
  name: string
  price: number
  quantity: number
  type: "accommodation" | "flight" | "activity" | "transport"
}

interface BookingSummaryProps {
  destination: string
  startDate: string
  endDate: string
  travelers: number
  items: BookingItem[]
  subtotal: number
  taxes: number
  fees: number
  total: number
}

const getItemIcon = (type: string) => {
  switch (type) {
    case "accommodation":
      return Hotel
    case "flight":
      return Plane
    case "activity":
      return Camera
    case "transport":
      return Utensils
    default:
      return MapPin
  }
}

export function BookingSummary({
  destination,
  startDate,
  endDate,
  travelers,
  items,
  subtotal,
  taxes,
  fees,
  total,
}: BookingSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Booking Summary
        </CardTitle>
        <CardDescription>Review your trip details before payment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trip Details */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">{destination}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <div>
                <div className="font-medium">Check-in</div>
                <div>{new Date(startDate).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <div>
                <div className="font-medium">Check-out</div>
                <div>{new Date(endDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>
              {travelers} {travelers === 1 ? "Traveler" : "Travelers"}
            </span>
          </div>
        </div>

        <Separator />

        {/* Booking Items */}
        <div className="space-y-4">
          <h4 className="font-semibold">Included Services</h4>
          {items.map((item, index) => {
            const Icon = getItemIcon(item.type)
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {item.quantity > 1 && <div className="text-sm text-gray-500">Qty: {item.quantity}</div>}
                  </div>
                </div>
                <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            )
          })}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Taxes & Fees</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Service Fee</span>
            <span>${fees.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Policies */}
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Free Cancellation
            </Badge>
            <span>Cancel up to 24 hours before</span>
          </div>
          <div>• Full refund if cancelled within 24 hours</div>
          <div>• 50% refund if cancelled within 7 days</div>
          <div>• No refund for same-day cancellations</div>
        </div>
      </CardContent>
    </Card>
  )
}
