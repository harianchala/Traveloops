"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { useDatabase } from "@/lib/database-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Edit, Plus, AlertCircle } from "lucide-react"

export default function AdminDestinationsPage() {
  const { user } = useAuth()
  const { destinations, addDestination, updateDestination, deleteDestination } = useDatabase()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    description: "",
    image_url: "",
    rating: 4.5,
    price_per_night: 5000,
    best_time: "",
    highlights: "",
    category: "Adventure",
  })

  // Check if user is admin
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
    if (!formData.name || !formData.country) {
      alert("Please fill in required fields")
      return
    }

    const destination = {
      ...formData,
      highlights: formData.highlights.split(",").map((h) => h.trim()),
      rating: Number(formData.rating),
      price_per_night: Number(formData.price_per_night),
    }

    if (editingId) {
      updateDestination(editingId, destination)
      setEditingId(null)
    } else {
      addDestination(destination)
    }

    setFormData({
      name: "",
      country: "",
      description: "",
      image_url: "",
      rating: 4.5,
      price_per_night: 5000,
      best_time: "",
      highlights: "",
      category: "Adventure",
    })
    setShowForm(false)
  }

  const handleEdit = (dest: any) => {
    setFormData({
      ...dest,
      highlights: dest.highlights?.join(", ") || "",
    })
    setEditingId(dest.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this destination?")) {
      deleteDestination(id)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Destination Management</h1>
            <p className="text-muted-foreground mt-2">Manage destinations and pricing</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Destination
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Destination" : "Add New Destination"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Destination Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Meghalaya"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="e.g., India"
                      required
                    />
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
                      placeholder="Describe the destination"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option>Adventure</option>
                      <option>Beach</option>
                      <option>Culture</option>
                      <option>Mountain</option>
                      <option>Urban</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Best Time to Visit</label>
                    <Input
                      value={formData.best_time}
                      onChange={(e) => setFormData({ ...formData, best_time: e.target.value })}
                      placeholder="e.g., April - October"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Highlights (comma-separated)</label>
                    <Input
                      value={formData.highlights}
                      onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                      placeholder="Beach, Waterfall, Temple"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingId ? "Update" : "Add"} Destination
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                      setFormData({
                        name: "",
                        country: "",
                        description: "",
                        image_url: "",
                        rating: 4.5,
                        price_per_night: 5000,
                        best_time: "",
                        highlights: "",
                        category: "Adventure",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Card key={destination.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{destination.name}</CardTitle>
                    <CardDescription>{destination.country}</CardDescription>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    {destination.rating}/5
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{destination.description}</p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  <p className="text-sm font-semibold text-blue-600">₹{destination.price_per_night}/night</p>
                  <p className="text-xs text-muted-foreground">{destination.category}</p>
                </div>
                {destination.highlights && (
                  <div>
                    <p className="text-xs font-semibold mb-2">Highlights:</p>
                    <div className="flex flex-wrap gap-1">
                      {destination.highlights.map((h, i) => (
                        <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(destination)} className="flex-1 gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(destination.id)}
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
