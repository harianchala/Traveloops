import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const response = generateTravelResponse(message.toLowerCase())

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in travel chat API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateTravelResponse(input: string): string {
  // Weather queries
  if (input.includes("weather")) {
    if (input.includes("tokyo")) {
      return "🌤️ Tokyo is currently experiencing partly cloudy weather at 22°C with 65% humidity. The forecast shows sunny skies tomorrow with temperatures reaching 24°C. Perfect weather for sightseeing! Would you like me to suggest some outdoor activities?"
    }
    if (input.includes("santorini")) {
      return "☀️ Santorini has beautiful sunny weather at 25°C with gentle sea breezes. The next few days will be perfect for sunset viewing and wine tasting. The famous Oia sunset will be spectacular tonight!"
    }
    if (input.includes("dubai")) {
      return "🌡️ Dubai is quite hot at 35°C with low humidity. It's perfect weather for indoor activities like shopping malls and museums during the day, and outdoor desert safaris in the evening. Stay hydrated!"
    }
    if (input.includes("paris")) {
      return "☁️ Paris has overcast skies at 16°C with 70% humidity. Light rain is expected later, so pack an umbrella! Perfect weather for visiting museums like the Louvre or enjoying cozy cafes."
    }
    if (input.includes("bali")) {
      return "🌴 Bali enjoys tropical weather at 28°C with high humidity. Expect some afternoon showers but plenty of sunshine. Great for beach activities in the morning and spa treatments in the afternoon!"
    }
    return "🌍 I can provide weather information for any destination! Just mention the city name and I'll give you current conditions and forecasts."
  }

  // Best time to visit queries
  if (input.includes("best time") || input.includes("when to visit")) {
    if (input.includes("santorini")) {
      return "🏖️ The best time to visit Santorini is from April to October, with peak season being July-August. For fewer crowds and great weather, I recommend May-June or September-October. The weather is perfect, prices are lower, and you'll have amazing sunset views!"
    }
    if (input.includes("tokyo")) {
      return "🌸 Tokyo is beautiful year-round! Spring (March-May) offers cherry blossoms, summer (June-August) has festivals but can be hot and humid, autumn (September-November) has perfect weather and fall colors, and winter (December-February) is mild with fewer crowds."
    }
    if (input.includes("bali")) {
      return "🌴 Bali's dry season (April-October) is ideal for visiting, with sunny days and low humidity. The wet season (November-March) has afternoon showers but is less crowded and more affordable. Avoid January-February for the heaviest rains."
    }
    return "📅 I can help you find the perfect time to visit any destination based on weather, crowds, and prices. Which destination are you interested in?"
  }

  // Budget travel queries
  if (input.includes("budget") || input.includes("cheap") || input.includes("affordable")) {
    return "💰 Here are my top budget travel tips:\n\n• Book flights 6-8 weeks in advance\n• Stay in hostels or guesthouses\n• Eat at local markets and street food stalls\n• Use public transportation\n• Look for free walking tours and activities\n• Travel during shoulder seasons\n• Consider destinations in Southeast Asia, Eastern Europe, or Central America\n\nWhich destination are you considering? I can give specific budget advice!"
  }

  // Local events queries
  if (input.includes("events") || input.includes("festivals") || input.includes("activities")) {
    if (input.includes("paris")) {
      return "🎭 Paris has amazing events this month! Check out:\n\n• Louvre Night Tours (Wed & Fri evenings)\n• Seine River Dinner Cruises (daily)\n• Montmartre Art Walks (weekends)\n• Local jazz clubs in Saint-Germain\n• Seasonal markets at Marché des Enfants Rouges\n\nWould you like specific dates and booking information?"
    }
    if (input.includes("tokyo")) {
      return "🎌 Tokyo's event calendar is packed! Current highlights:\n\n• Cherry Blossom Festival at Ueno Park\n• Tokyo Food Festival in Shibuya\n• Anime Convention at Tokyo Big Sight\n• Traditional tea ceremonies in temples\n• Sumo wrestling tournaments\n\nLet me know which type of event interests you most!"
    }
    return "🎉 I can help you discover local events, festivals, and cultural activities for any destination. Which city are you visiting?"
  }

  // Hotel queries
  if (input.includes("hotel") || input.includes("accommodation") || input.includes("stay")) {
    if (input.includes("dubai")) {
      return "🏨 Dubai has incredible accommodation options:\n\n• Luxury: Burj Al Arab, Atlantis The Palm\n• Mid-range: Rove Hotels, Citymax Hotels\n• Budget: Premier Inn, Ibis Styles\n• Unique: Desert camps, Marina apartments\n\nFor the best deals, book directly with hotels or check during Ramadan for lower prices. Which area of Dubai interests you?"
    }
    return "🛏️ I can recommend accommodations based on your budget and preferences. Which destination and what's your budget range?"
  }

  // Food queries
  if (input.includes("food") || input.includes("restaurant") || input.includes("eat")) {
    if (input.includes("bali")) {
      return "🍽️ Bali's food scene is incredible! Must-try experiences:\n\n• Nasi Goreng (fried rice) at local warungs\n• Fresh seafood at Jimbaran Beach\n• Balinese cooking classes in Ubud\n• Vegetarian cafes in Canggu\n• Traditional rijsttafel dinners\n• Tropical fruits at local markets\n\nWould you like specific restaurant recommendations or cooking class bookings?"
    }
    return "🍴 I can recommend the best local cuisine and restaurants for any destination. Which city are you visiting and what type of food do you enjoy?"
  }

  // Greeting responses
  if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
    return "👋 Hello! I'm excited to help you plan your next adventure. I can assist with destination information, weather updates, local events, accommodation recommendations, and travel tips. What would you like to explore today?"
  }

  // Thank you responses
  if (input.includes("thank")) {
    return "😊 You're very welcome! I'm here whenever you need travel advice or planning help. Have an amazing trip, and don't hesitate to ask if you need anything else!"
  }

  // Default response
  return "🤔 I'd love to help you with that! I specialize in:\n\n• Weather forecasts for any destination\n• Best times to visit places\n• Local events and festivals\n• Budget travel tips\n• Hotel and restaurant recommendations\n• Cultural insights and travel advice\n\nCould you be more specific about what you'd like to know? For example, you could ask about weather in Tokyo, best time to visit Santorini, or budget tips for Southeast Asia."
}
