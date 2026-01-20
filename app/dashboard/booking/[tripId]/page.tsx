"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckoutForm } from "@/components/payment/checkout-form"
import { BookingSummary } from "@/components/payment/booking-summary"
import { ArrowLeft, Shield, CreditCard } from "lucide-react"
import Link from "next/link"

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = params.tripId as string

  const [step, setStep] = useState<"summary" | "payment" | "confirmation">("summary")
  const [bookingId, setBookingId] = useState<string>("")

  // Mock trip data - in a real app, this would come from your database
  const tripData = {
    id: tripId,
    destination: "Tokyo, Japan",
    startDate: "2024-12-15",
    endDate: "2024-12-22",
    travelers: 2,
    items: [
      { name: "Hotel Accommodation (7 nights)", price: 150, quantity: 7, type: "accommodation" as const },
      { name: "Round-trip Flights", price: 800, quantity: 2, type: "flight" as const },
      { name: "Tokyo City Tour", price: 120, quantity: 2, type: "activity" as const },
      { name: "Airport Transfers", price: 60, quantity: 2, type: "transport" as const },
    ],
  }

  const subtotal = tripData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxes = subtotal * 0.08 // 8% tax
  const fees = 25 // Service fee
  const total = subtotal + taxes + fees

  const bookingDetails = {
    tripId,
    destination: tripData.destination,
    travelers: tripData.travelers,
    startDate: tripData.startDate,
    endDate: tripData.endDate,
    type: "full_package" as const,
    items: tripData.items,
  }

  const handlePaymentSuccess = (newBookingId: string) => {
    setBookingId(newBookingId)
    setStep("confirmation")
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
    // Handle error (show toast, etc.)
  }

  if (step === "confirmation") {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your trip to {tripData.destination} has been successfully booked.</p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Booking ID:</span>
                <span className="font-mono">{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span>Destination:</span>
                <span>{tripData.destination}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Paid:</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              A confirmation email has been sent to your registered email address.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/dashboard/trips/${tripId}`}>View Trip Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/dashboard/trips/${tripId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Trip
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
        <p className="text-gray-600">Secure payment powered by Stripe</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "summary" ? "bg-blue-600 text-white" : "bg-green-600 text-white"
              }`}
            >
              1
            </div>
            <span className="ml-2 text-sm">Review</span>
          </div>
          <div className="w-16 h-1 bg-gray-200">
            <div className={`h-full bg-blue-600 transition-all ${step !== "summary" ? "w-full" : "w-0"}`} />
          </div>
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "payment"
                  ? "bg-blue-600 text-white"
                  : step === "confirmation"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <span className="ml-2 text-sm">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Booking Summary */}
        <div>
          <BookingSummary
            destination={tripData.destination}
            startDate={tripData.startDate}
            endDate={tripData.endDate}
            travelers={tripData.travelers}
            items={tripData.items}
            subtotal={subtotal}
            taxes={taxes}
            fees={fees}
            total={total}
          />
        </div>

        {/* Right Column - Payment or Summary Actions */}
        <div>
          {step === "summary" ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Ready to Book?
                </CardTitle>
                <CardDescription>Review your trip details and proceed to secure payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Secure payment with Stripe</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm">PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm">256-bit SSL encryption</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <strong>Cancellation Policy:</strong>
                    <ul className="mt-1 space-y-1">
                      <li>• Free cancellation up to 24 hours before</li>
                      <li>• 50% refund if cancelled within 7 days</li>
                      <li>• No refund for same-day cancellations</li>
                    </ul>
                  </div>
                </div>

                <Button onClick={() => setStep("payment")} className="w-full" size="lg">
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Details
                </CardTitle>
                <CardDescription>Enter your payment information to complete the booking</CardDescription>
              </CardHeader>
              <CardContent>
                <CheckoutForm
                  bookingDetails={bookingDetails}
                  totalAmount={total}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
