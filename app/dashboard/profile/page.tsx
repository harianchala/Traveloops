"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, MapPin, Globe, Mail, Phone, Edit, Save, Star, Plane } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/profile/image-upload"
import { ShareButton } from "@/components/social/share-button"

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Passionate traveler exploring the world one destination at a time. Love discovering hidden gems, trying local cuisines, and meeting new people along the way.",
    location: "San Francisco, CA",
    website: "www.johndoe-travels.com",
    profileImage: "/placeholder.svg?height=200&width=200",
  })

  const [stats] = useState({
    tripsCompleted: 12,
    countriesVisited: 8,
    citiesExplored: 24,
    averageRating: 4.9,
    totalReviews: 47,
    friendsConnected: 156,
  })

  const [recentTrips] = useState([
    {
      id: 1,
      destination: "Tokyo, Japan",
      date: "March 2024",
      image: "/placeholder.svg?height=100&width=150",
      rating: 5,
    },
    {
      id: 2,
      destination: "Paris, France",
      date: "January 2024",
      image: "/placeholder.svg?height=100&width=150",
      rating: 4,
    },
    {
      id: 3,
      destination: "Bali, Indonesia",
      date: "November 2023",
      image: "/placeholder.svg?height=100&width=150",
      rating: 5,
    },
  ])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (imageUrl: string) => {
    setProfileData((prev) => ({ ...prev, profileImage: imageUrl }))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="flex gap-2">
          <ShareButton
            title={`${profileData.name}'s Travel Profile`}
            description={profileData.bio}
            hashtags={["travel", "wanderlust", "traveloop"]}
          />
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isLoading}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                {isEditing ? (
                  <ImageUpload currentImage={profileData.profileImage} onImageChange={handleImageChange} size="lg" />
                ) : (
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profileData.profileImage || "/placeholder.svg"} alt={profileData.name} />
                    <AvatarFallback>
                      <User className="w-16 h-16" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="text-center space-y-2">
                  {isEditing ? (
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="text-center font-semibold text-xl"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold">{profileData.name}</h2>
                  )}

                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {isEditing ? (
                      <Input
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="text-center"
                      />
                    ) : (
                      <span>{profileData.location}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{stats.averageRating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Plane className="w-4 h-4" />
                      <span>{stats.tripsCompleted} trips</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Travel Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.tripsCompleted}</div>
                  <div className="text-sm text-muted-foreground">Trips</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.countriesVisited}</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.citiesExplored}</div>
                  <div className="text-sm text-muted-foreground">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalReviews}</div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="about" className="space-y-6">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="trips">Recent Trips</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">{profileData.bio}</p>
                  )}

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        />
                      ) : (
                        <span>{profileData.email}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                      ) : (
                        <span>{profileData.phone}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          value={profileData.website}
                          onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        />
                      ) : (
                        <a
                          href={`https://${profileData.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {profileData.website}
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trips" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Trips</CardTitle>
                  <CardDescription>My latest travel adventures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentTrips.map((trip) => (
                      <div key={trip.id} className="border rounded-lg p-4 space-y-3">
                        <img
                          src={trip.image || "/placeholder.svg"}
                          alt={trip.destination}
                          className="w-full h-24 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-semibold">{trip.destination}</h4>
                          <p className="text-sm text-muted-foreground">{trip.date}</p>
                          <div className="flex items-center gap-1 mt-2">
                            {Array.from({ length: trip.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reviews & Ratings</CardTitle>
                  <CardDescription>What other travelers say about me</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">{stats.averageRating}</span>
                        <span className="text-muted-foreground">({stats.totalReviews} reviews)</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      {[
                        {
                          reviewer: "Sarah Johnson",
                          rating: 5,
                          comment:
                            "Amazing travel companion! Very knowledgeable about local culture and always helpful.",
                          date: "2 weeks ago",
                        },
                        {
                          reviewer: "Mike Chen",
                          rating: 5,
                          comment:
                            "Great recommendations for hidden gems in Tokyo. Would definitely travel with again!",
                          date: "1 month ago",
                        },
                        {
                          reviewer: "Emma Wilson",
                          rating: 4,
                          comment: "Friendly and organized. Made our group trip to Paris unforgettable.",
                          date: "2 months ago",
                        },
                      ].map((review, index) => (
                        <div key={index} className="border-l-2 border-primary/20 pl-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{review.reviewer}</span>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
