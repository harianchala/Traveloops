"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Droplets, Wind, Eye, Sun, Gauge } from "lucide-react"
import { getWeatherData, getWeatherIcon, type WeatherData } from "@/lib/weather"

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchCity, setSearchCity] = useState("")
  const [currentCity, setCurrentCity] = useState("Tokyo")

  useEffect(() => {
    handleSearch("Tokyo")
  }, [])

  const handleSearch = async (city?: string) => {
    const cityToSearch = city || searchCity
    if (!cityToSearch.trim()) return

    setLoading(true)
    try {
      const data = await getWeatherData(cityToSearch)
      setWeatherData(data)
      setCurrentCity(cityToSearch)
      if (!city) setSearchCity("")
    } catch (error) {
      console.error("Error fetching weather:", error)
    } finally {
      setLoading(false)
    }
  }

  const popularCities = ["Tokyo", "Paris", "New York", "London", "Dubai", "Sydney", "Rome", "Bangkok"]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Weather</h1>
        <p className="text-muted-foreground">Check current weather conditions and forecasts for your destinations</p>

        <div className="flex gap-2 max-w-md">
          <Input
            placeholder="Search for a city..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={() => handleSearch()} disabled={loading}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {popularCities.map((city) => (
            <Button
              key={city}
              variant={currentCity === city ? "default" : "outline"}
              size="sm"
              onClick={() => handleSearch(city)}
              disabled={loading}
            >
              {city}
            </Button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {weatherData && !loading && (
        <div className="space-y-6">
          {/* Current Weather */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {currentCity}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{getWeatherIcon(weatherData.condition)}</div>
                    <div>
                      <div className="text-4xl font-bold">{weatherData.temperature}°C</div>
                      <div className="text-lg text-muted-foreground capitalize">{weatherData.condition}</div>
                      {weatherData.feelsLike && (
                        <div className="text-sm text-muted-foreground">Feels like {weatherData.feelsLike}°C</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Humidity</div>
                      <div className="font-semibold">{weatherData.humidity}%</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Wind Speed</div>
                      <div className="font-semibold">{weatherData.windSpeed} km/h</div>
                    </div>
                  </div>

                  {weatherData.pressure && (
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">Pressure</div>
                        <div className="font-semibold">{weatherData.pressure} hPa</div>
                      </div>
                    </div>
                  )}

                  {weatherData.visibility && (
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">Visibility</div>
                        <div className="font-semibold">{weatherData.visibility} km</div>
                      </div>
                    </div>
                  )}

                  {weatherData.uvIndex && (
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">UV Index</div>
                        <div className="font-semibold">{weatherData.uvIndex}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5-Day Forecast */}
          {weatherData.forecast && weatherData.forecast.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>5-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="text-center space-y-2 p-4 rounded-lg border">
                      <div className="font-semibold">{day.day}</div>
                      <div className="text-2xl">{getWeatherIcon(day.condition)}</div>
                      <div className="text-sm capitalize text-muted-foreground">{day.condition}</div>
                      <div className="space-y-1">
                        <div className="font-semibold">{day.high}°</div>
                        <div className="text-sm text-muted-foreground">{day.low}°</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
