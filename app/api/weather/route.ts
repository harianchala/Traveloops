import { type NextRequest, NextResponse } from "next/server"

export interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  pressure?: number
  visibility?: number
  uvIndex?: number
  feelsLike?: number
  forecast?: {
    day: string
    high: number
    low: number
    condition: string
    icon: string
  }[]
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get("city")

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      console.warn("OpenWeather API key not found, using mock data")
      return NextResponse.json(getMockWeatherData(city))
    }

    // Get current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
    )

    if (!currentResponse.ok) {
      throw new Error(`Weather API error: ${currentResponse.status}`)
    }

    const currentData = await currentResponse.json()

    // Get 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
    )

    let forecastData = null
    if (forecastResponse.ok) {
      forecastData = await forecastResponse.json()
    }

    // Process forecast data
    const forecast = forecastData?.list ? processForecastData(forecastData.list) : []

    const weatherData: WeatherData = {
      temperature: Math.round(currentData.main.temp),
      condition: currentData.weather[0].description,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6),
      pressure: currentData.main.pressure,
      visibility: currentData.visibility ? Math.round(currentData.visibility / 1000) : undefined,
      uvIndex: currentData.uvi || undefined,
      feelsLike: Math.round(currentData.main.feels_like),
      forecast,
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return NextResponse.json(getMockWeatherData(city))
  }
}

function processForecastData(forecastList: any[]): WeatherData["forecast"] {
  const dailyForecasts = new Map()

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000)
    const dayKey = date.toDateString()

    if (!dailyForecasts.has(dayKey)) {
      dailyForecasts.set(dayKey, {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
        condition: item.weather[0].description,
        icon: item.weather[0].icon,
      })
    } else {
      const existing = dailyForecasts.get(dayKey)
      existing.high = Math.max(existing.high, Math.round(item.main.temp_max))
      existing.low = Math.min(existing.low, Math.round(item.main.temp_min))
    }
  })

  return Array.from(dailyForecasts.values()).slice(0, 5)
}

function getMockWeatherData(city: string): WeatherData {
  // Mock weather data for different cities
  const weatherDatabase: Record<string, WeatherData> = {
    Tokyo: {
      temperature: 22,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12,
      pressure: 1013,
      visibility: 10,
      uvIndex: 6,
      feelsLike: 24,
      forecast: [
        { day: "Today", high: 24, low: 18, condition: "Partly Cloudy", icon: "02d" },
        { day: "Tomorrow", high: 26, low: 20, condition: "Sunny", icon: "01d" },
        { day: "Wed", high: 23, low: 17, condition: "Rainy", icon: "10d" },
        { day: "Thu", high: 25, low: 19, condition: "Sunny", icon: "01d" },
        { day: "Fri", high: 27, low: 21, condition: "Partly Cloudy", icon: "02d" },
      ],
    },
    Paris: {
      temperature: 18,
      condition: "Rainy",
      humidity: 78,
      windSpeed: 15,
      pressure: 1008,
      visibility: 8,
      uvIndex: 3,
      feelsLike: 16,
      forecast: [
        { day: "Today", high: 20, low: 14, condition: "Rainy", icon: "10d" },
        { day: "Tomorrow", high: 22, low: 16, condition: "Cloudy", icon: "03d" },
        { day: "Wed", high: 24, low: 18, condition: "Sunny", icon: "01d" },
        { day: "Thu", high: 21, low: 15, condition: "Partly Cloudy", icon: "02d" },
        { day: "Fri", high: 19, low: 13, condition: "Rainy", icon: "10d" },
      ],
    },
    Dubai: {
      temperature: 35,
      condition: "Sunny",
      humidity: 45,
      windSpeed: 8,
      pressure: 1015,
      visibility: 15,
      uvIndex: 11,
      feelsLike: 39,
      forecast: [
        { day: "Today", high: 37, low: 28, condition: "Sunny", icon: "01d" },
        { day: "Tomorrow", high: 39, low: 30, condition: "Sunny", icon: "01d" },
        { day: "Wed", high: 36, low: 27, condition: "Partly Cloudy", icon: "02d" },
        { day: "Thu", high: 38, low: 29, condition: "Sunny", icon: "01d" },
        { day: "Fri", high: 40, low: 31, condition: "Sunny", icon: "01d" },
      ],
    },
  }

  return (
    weatherDatabase[city] || {
      temperature: 20,
      condition: "Partly Cloudy",
      humidity: 60,
      windSpeed: 10,
      pressure: 1013,
      visibility: 10,
      uvIndex: 5,
      feelsLike: 22,
      forecast: [
        { day: "Today", high: 22, low: 16, condition: "Partly Cloudy", icon: "02d" },
        { day: "Tomorrow", high: 24, low: 18, condition: "Sunny", icon: "01d" },
        { day: "Wed", high: 21, low: 15, condition: "Cloudy", icon: "03d" },
        { day: "Thu", high: 23, low: 17, condition: "Sunny", icon: "01d" },
        { day: "Fri", high: 25, low: 19, condition: "Partly Cloudy", icon: "02d" },
      ],
    }
  )
}
