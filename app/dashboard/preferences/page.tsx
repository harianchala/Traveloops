"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Heart, Plane } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"
import { supabase } from "@/lib/supabase"

interface UserPreferences {
  // Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string

  // Travel Preferences
  defaultBudget: number[]
  preferredCurrency: string
  travelStyle: string
  accommodationType: string
  interests: string[]

  // Notifications
  emailNotifications: boolean
  pushNotifications: boolean
  priceAlerts: boolean
  weatherAlerts: boolean

  // Privacy
  shareData: boolean
  publicProfile: boolean

  // Accessibility
  mobilityAssistance: boolean
  dietaryRestrictions: string
  languagePreference: string
}

export default function Preferences() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [preferences, setPreferences] = useState<UserPreferences>({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Travel Preferences
    defaultBudget: [2500],
    preferredCurrency: "USD",
    travelStyle: "comfort",
    accommodationType: "hotel",
    interests: [],

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    priceAlerts: true,
    weatherAlerts: true,

    // Privacy
    shareData: false,
    publicProfile: false,

    // Accessibility
    mobilityAssistance: false,
    dietaryRestrictions: "",
    languagePreference: "en",
  })

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

  useEffect(() => {
    if (user) {
      loadUserPreferences()
    }
  }, [user])

  const loadUserPreferences = async () => {
    if (!user) return

    try {
      const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (profile) {
        const nameParts = profile.name?.split(" ") || ["", ""]
        setPreferences((prev) => ({
          ...prev,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: profile.email || user.email || "",
          interests: profile.interests || [],
          ...profile.preferences,
        }))
      } else {
        // Set default values from user
        setPreferences((prev) => ({
          ...prev,
          email: user.email || "",
          firstName: user.name?.split(" ")[0] || "",
          lastName: user.name?.split(" ").slice(1).join(" ") || "",
        }))
      }
    } catch (error) {
      console.error("Error loading preferences:", error)
      toast({
        title: "Error",
        description: "Failed to load preferences",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInterestToggle = (interest: string) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const fullName = `${preferences.firstName} ${preferences.lastName}`.trim()

      const profileData = {
        id: user.id,
        name: fullName,
        email: preferences.email,
        interests: preferences.interests,
        preferences: {
          defaultBudget: preferences.defaultBudget,
          preferredCurrency: preferences.preferredCurrency,
          travelStyle: preferences.travelStyle,
          accommodationType: preferences.accommodationType,
          emailNotifications: preferences.emailNotifications,
          pushNotifications: preferences.pushNotifications,
          priceAlerts: preferences.priceAlerts,
          weatherAlerts: preferences.weatherAlerts,
          shareData: preferences.shareData,
          publicProfile: preferences.publicProfile,
          mobilityAssistance: preferences.mobilityAssistance,
          dietaryRestrictions: preferences.dietaryRestrictions,
          languagePreference: preferences.languagePreference,
          phone: preferences.phone,
        },
      }

      const { error } = await supabase.from("profiles").upsert(profileData)

      if (error) throw error

      toast({
        title: "Success",
        description: "Your preferences have been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Preferences</h1>
        <p className="text-gray-600">Customize your travel planning experience</p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your personal details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={preferences.firstName}
                onChange={(e) => setPreferences((prev) => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={preferences.lastName}
                onChange={(e) => setPreferences((prev) => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={preferences.email}
              onChange={(e) => setPreferences((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={preferences.phone}
              onChange={(e) => setPreferences((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </CardContent>
      </Card>

      {/* Travel Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plane className="w-5 h-5 mr-2" />
            Travel Preferences
          </CardTitle>
          <CardDescription>Set your default travel preferences for better recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Default Budget Range</Label>
            <div className="mt-4 space-y-3">
              <Slider
                value={preferences.defaultBudget}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, defaultBudget: value }))}
                max={100000}
                min={5000}
                step={5000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹5,000</span>
                <span className="font-medium">₹{preferences.defaultBudget[0].toLocaleString("en-IN")}</span>
                <span>₹1,00,000+</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Preferred Currency</Label>
              <Select
                value={preferences.preferredCurrency}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, preferredCurrency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Travel Style</Label>
              <Select
                value={preferences.travelStyle}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, travelStyle: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="comfort">Comfort</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="backpacker">Backpacker</SelectItem>
                  <SelectItem value="family">Family-friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Preferred Accommodation</Label>
            <Select
              value={preferences.accommodationType}
              onValueChange={(value) => setPreferences((prev) => ({ ...prev, accommodationType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="resort">Resort</SelectItem>
                <SelectItem value="airbnb">Airbnb/Vacation Rental</SelectItem>
                <SelectItem value="hostel">Hostel</SelectItem>
                <SelectItem value="boutique">Boutique Hotel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Interests</Label>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {interests.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={preferences.interests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                  />
                  <Label htmlFor={interest} className="text-sm">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </CardTitle>
          <CardDescription>Choose how you want to receive updates and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive trip updates and recommendations via email</p>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, emailNotifications: checked }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-sm text-gray-600">Get real-time alerts on your device</p>
            </div>
            <Switch
              checked={preferences.pushNotifications}
              onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, pushNotifications: checked }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Price Alerts</Label>
              <p className="text-sm text-gray-600">Notify when flight or hotel prices drop</p>
            </div>
            <Switch
              checked={preferences.priceAlerts}
              onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, priceAlerts: checked }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Weather Alerts</Label>
              <p className="text-sm text-gray-600">Get weather updates for your destinations</p>
            </div>
            <Switch
              checked={preferences.weatherAlerts}
              onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, weatherAlerts: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Privacy & Security
          </CardTitle>
          <CardDescription>Control your data sharing and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Share Data for Better Recommendations</Label>
              <p className="text-sm text-gray-600">Allow us to use your travel data to improve AI recommendations</p>
            </div>
            <Switch
              checked={preferences.shareData}
              onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, shareData: checked }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Public Profile</Label>
              <p className="text-sm text-gray-600">Make your travel profile visible to other users</p>
            </div>
            <Switch
              checked={preferences.publicProfile}
              onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, publicProfile: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Accessibility & Special Needs
          </CardTitle>
          <CardDescription>Help us provide better recommendations for your specific needs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Mobility Assistance Required</Label>
              <p className="text-sm text-gray-600">Include accessibility information in recommendations</p>
            </div>
            <Switch
              checked={preferences.mobilityAssistance}
              onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, mobilityAssistance: checked }))}
            />
          </div>

          <div>
            <Label htmlFor="dietary">Dietary Restrictions</Label>
            <Textarea
              id="dietary"
              placeholder="e.g., Vegetarian, Gluten-free, Allergies..."
              value={preferences.dietaryRestrictions}
              onChange={(e) => setPreferences((prev) => ({ ...prev, dietaryRestrictions: e.target.value }))}
            />
          </div>

          <div>
            <Label>Language Preference</Label>
            <Select
              value={preferences.languagePreference}
              onValueChange={(value) => setPreferences((prev) => ({ ...prev, languagePreference: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="px-8">
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  )
}
