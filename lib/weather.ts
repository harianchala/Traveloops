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

export function getWeatherIcon(condition: string): string {
  const conditionLower = condition.toLowerCase()

  if (conditionLower.includes("sunny") || conditionLower.includes("clear")) return "☀️"
  if (conditionLower.includes("cloudy") || conditionLower.includes("overcast")) return "☁️"
  if (conditionLower.includes("rainy") || conditionLower.includes("rain")) return "🌧️"
  if (conditionLower.includes("thunderstorm") || conditionLower.includes("storm")) return "⛈️"
  if (conditionLower.includes("snow") || conditionLower.includes("snowy")) return "❄️"
  if (conditionLower.includes("windy") || conditionLower.includes("wind")) return "💨"
  if (conditionLower.includes("fog") || conditionLower.includes("misty")) return "🌫️"
  if (conditionLower.includes("partly")) return "⛅"
  if (conditionLower.includes("humid") || conditionLower.includes("humid")) return "💧"

  return "🌤️" // Default weather icon
}

export async function getWeatherData(city: string): Promise<WeatherData> {
  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching weather data:", error)

    // Return fallback mock data
    return {
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
  }
}
