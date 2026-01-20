"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Shield, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface BookingDetails {
  tripId: string
  destination: string
  travelers: number
  startDate: string
  endDate: string
  type: "full_package" | "accommodation" | "flights" | "activities"
  items: Array<{
    name: string
    price: number
    quantity: number
  }>
}

interface CheckoutFormProps {
  bookingDetails: BookingDetails
  totalAmount: number
  onSuccess: (bookingId: string) => void
  onError: (error: string) => void
}

function CheckoutFormInner({ bookingDetails, totalAmount, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalAmount,
        tripId: bookingDetails.tripId,
        bookingDetails,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          onError("Failed to initialize payment")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        onError("Failed to initialize payment")
      })
  }, [totalAmount, bookingDetails, onError])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsLoading(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    })

    if (error) {
      onError(error.message || "Payment failed")
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred during payment",
        variant: "destructive",
      })
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Confirm the booking
      try {
        const response = await fetch("/api/confirm-booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            bookingDetails,
          }),
        })

        const result = await response.json()

        if (result.success) {
          onSuccess(result.booking.id)
          toast({
            title: "Payment Successful!",
            description: "Your booking has been confirmed.",
          })
        } else {
          onError("Booking confirmation failed")
        }
      } catch (error) {
        onError("Failed to confirm booking")
      }
    }

    setIsLoading(false)
  }

  const paymentElementOptions = {
    layout: "tabs" as const,
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>Secured by Stripe • PCI DSS Compliant</span>
        </div>

        {clientSecret && <PaymentElement id="payment-element" options={paymentElementOptions} />}
      </div>

      <Button type="submit" disabled={isLoading || !stripe || !elements || !clientSecret} className="w-full" size="lg">
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          <div className="flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            Pay ${totalAmount.toFixed(2)}
          </div>
        )}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        Your payment information is encrypted and secure. We never store your card details.
      </div>
    </form>
  )
}

export function CheckoutForm(props: CheckoutFormProps) {
  const options = {
    clientSecret: "",
    appearance: {
      theme: "stripe" as const,
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutFormInner {...props} />
    </Elements>
  )
}
