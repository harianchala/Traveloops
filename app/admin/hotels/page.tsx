"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { useDatabase } from "@/lib/database-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Edit, Plus, AlertCircle } from "lucide-react"

export default function AdminHotelsPage() {
  const { user } = useAuth()
  const { destinations, hotels, addHotel, updateHotel, deleteHotel, getHotelsByDestination } = useDatabase()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedDestination, setSelectedDestination] = useState<string>("")
  const [formData, setFormData] = useState({
    destination_id: "",
    name: "",
    location: "",
    description: "",
    image_url: "",
    rating: 4.5,
    price_per_night: 5000,
    category: "3-Star",
    amenities: "",
    features: "",
    availability: true,
  })

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background p-8">
        <Alert className="border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">Access denied. Admin only.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.destination_id || !formData.name || !formData.location) {
      alert("Please fill in required fields")
      return
    }

    const hotel = {
      ...formData,
      destination_id: formData.destination_id,
      rating: Number(formData.rating),
      price_per_night: Number(formData.price_per_night),
      amenities: formData.amenities.split(",").map((a) => a.trim()),
      features: formData.features.split(",").map((f) => f.trim()),
    }

    if (editingId) {
      updateHotel(editingId, hotel)
      setEditingId(null)
    } else {
      addHotel(hotel)
    }

    setFormData({
      destination_id: "",
      name: "",
      location: "",
      description: "",
      image_url: "",
      rating: 4.5,
      price_per_night: 5000,
      category: "3-Star",
      amenities: "",
      features: "",
      availability: true,
    })
    setShowForm(false)
  }

  const handleEdit = (hotel: any) => {
    setFormData({
      ...hotel,
      amenities: hotel.amenities?.join(", ") || "",
      features: hotel.features?.join(", ") || "",
    })
    setSelectedDestination(hotel.destination_id)
    setEditingId(hotel.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      deleteHotel(id)
    }
  }

  const filteredHotels = selectedDestination ? getHotelsByDestination(selectedDestination) : hotels

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Hotel Management</h1>
            <p className="text-muted-foreground mt-2">Manage hotels and pricing across destinations</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Hotel
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Hotel" : "Add New Hotel"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Destination</label>
                    <select
                      value={formData.destination_id}
                      onChange={(e) => setFormData({ ...formData, destination_id: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      required
                    >
                      <option value="">Select a destination</option>
                      {destinations.map((dest) => (
                        <option key={dest.id} value={dest.id}>
                          {dest.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hotel Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Grand Hotel"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City or area"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option>Budget</option>
                      <option>3-Star</option>
                      <option>4-Star</option>
                      <option>5-Star</option>
                      <option>Luxury</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price Per Night (₹)</label>
                    <Input
                      type="number"
                      value={formData.price_per_night}
                      onChange={(e) => setFormData({ ...formData, price_per_night: Number(e.target.value) })}
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                      placeholder="4.5"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the hotel"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Amenities (comma-separated)</label>
                    <Input
                      value={formData.amenities}
                      onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                      placeholder="WiFi, Pool, Gym, Restaurant"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Features (comma-separated)</label>
                    <Input
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      placeholder="AC, Parking, Hot Water"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingId ? "Update" : "Add"} Hotel
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                      setFormData({
                        destination_id: "",
                        name: "",
                        location: "",
                        description: "",
                        image_url: "",
                        rating: 4.5,
                        price_per_night: 5000,
                        category: "3-Star",
                        amenities: "",
                        features: "",
                        availability: true,
                      })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter by Destination</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="">All Destinations</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <Card key={hotel.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{hotel.name}</CardTitle>
                    <CardDescription>{hotel.location}</CardDescription>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">{hotel.rating}/5</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{hotel.description}</p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  <p className="text-sm font-semibold text-blue-600">₹{hotel.price_per_night}/night</p>
                  <p className="text-xs text-muted-foreground">{hotel.category}</p>
                </div>
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {hotel.amenities.map((a, i) => (
                        <span key={i} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(hotel)} className="flex-1 gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(hotel.id)}
                    className="flex-1 gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
