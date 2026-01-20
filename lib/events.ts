export interface Event {
  id: string
  name: string
  description: string
  date: string
  time?: string
  location: string
  category: string
  price?: string
  rating?: number
  attendees?: number
  image?: string
  url?: string
  venue?: string
  organizer?: string
}

export async function getEventsData(city: string): Promise<Event[]> {
  try {
    const response = await fetch(`/api/events?city=${encodeURIComponent(city)}`)

    if (!response.ok) {
      throw new Error(`Events API error: ${response.status}`)
    }

    const data = await response.json()
    return data.events || getMockEventsData(city)
  } catch (error) {
    console.error("Error fetching events data:", error)
    return getMockEventsData(city)
  }
}

async function getTicketmasterEvents(city: string, apiKey: string): Promise<Event[]> {
  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?city=${encodeURIComponent(city)}&apikey=${apiKey}&size=20&sort=date,asc`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status}`)
    }

    const data = await response.json()

    return (
      data._embedded?.events?.map((event: any) => ({
        id: event.id,
        name: event.name,
        description: event.info || event.pleaseNote || "Experience this amazing event",
        date: new Date(event.dates.start.localDate).toLocaleDateString(),
        time: event.dates.start.localTime || undefined,
        location: event._embedded?.venues?.[0]?.city?.name || city,
        category: event.classifications?.[0]?.segment?.name || "Entertainment",
        price: event.priceRanges?.[0] ? `$${event.priceRanges[0].min} - $${event.priceRanges[0].max}` : "Price varies",
        rating: Math.round((Math.random() * 2 + 3.5) * 10) / 10, // Generate realistic ratings
        attendees: Math.floor(Math.random() * 5000) + 100,
        image: event.images?.[0]?.url,
        url: event.url,
        venue: event._embedded?.venues?.[0]?.name,
        organizer: event.promoter?.name || "Event Organizer",
      })) || []
    )
  } catch (error) {
    console.error("Ticketmaster API error:", error)
    return []
  }
}

function getMockEventsData(city: string): Event[] {
  // Enhanced mock events data for different cities
  const eventsDatabase: Record<string, Event[]> = {
    Tokyo: [
      {
        id: "1",
        name: "Cherry Blossom Festival",
        description:
          "Experience the beauty of sakura season with traditional performances, food stalls, and hanami picnics in Ueno Park.",
        date: "2024-04-15",
        time: "10:00 AM",
        location: "Ueno Park",
        category: "Culture",
        price: "Free",
        rating: 4.8,
        attendees: 15000,
        venue: "Ueno Park",
        organizer: "Tokyo Parks Department",
        image: "/cherry-blossom-festival.png",
        url: "#",
      },
      {
        id: "2",
        name: "Tokyo Food & Sake Festival",
        description: "Taste the finest Japanese cuisine and premium sake from renowned breweries across Japan.",
        date: "2024-04-20",
        time: "6:00 PM",
        location: "Tokyo Big Sight",
        category: "Food",
        price: "¥3,500",
        rating: 4.6,
        attendees: 2500,
        venue: "Tokyo Big Sight",
        organizer: "Japan Food Association",
        url: "#",
      },
      {
        id: "3",
        name: "Shibuya Music Festival",
        description: "Three days of live music featuring J-pop, rock, and electronic artists in the heart of Tokyo.",
        date: "2024-04-25",
        time: "7:00 PM",
        location: "Shibuya Sky",
        category: "Music",
        price: "¥8,000",
        rating: 4.7,
        attendees: 5000,
        venue: "Shibuya Sky",
        organizer: "Tokyo Music Events",
        url: "#",
      },
    ],
    Paris: [
      {
        id: "4",
        name: "Louvre Night Tours",
        description: "Exclusive after-hours access to the world's most famous museum with expert guides.",
        date: "2024-04-18",
        time: "8:00 PM",
        location: "Louvre Museum",
        category: "Art",
        price: "€45",
        rating: 4.9,
        attendees: 150,
        venue: "Louvre Museum",
        organizer: "Musée du Louvre",
        image: "/louvre-night-tour.png",
        url: "#",
      },
      {
        id: "5",
        name: "Seine River Wine Cruise",
        description: "Romantic evening cruise along the Seine with wine tasting and French cuisine.",
        date: "2024-04-22",
        time: "7:30 PM",
        location: "Port de la Bourdonnais",
        category: "Food",
        price: "€85",
        rating: 4.5,
        attendees: 80,
        venue: "Seine River",
        organizer: "Paris River Cruises",
        image: "/seine-dinner-cruise.png",
        url: "#",
      },
      {
        id: "6",
        name: "Montmartre Art Walk",
        description: "Guided tour through the artistic quarter with visits to local galleries and street art.",
        date: "2024-04-28",
        time: "2:00 PM",
        location: "Montmartre",
        category: "Art",
        price: "€25",
        rating: 4.4,
        attendees: 200,
        venue: "Montmartre District",
        organizer: "Paris Art Tours",
        url: "#",
      },
    ],
    Dubai: [
      {
        id: "7",
        name: "Desert Safari & BBQ",
        description: "Thrilling dune bashing adventure followed by traditional Bedouin camp experience.",
        date: "2024-04-16",
        time: "4:00 PM",
        location: "Dubai Desert",
        category: "Adventure",
        price: "AED 250",
        rating: 4.7,
        attendees: 500,
        venue: "Dubai Desert Conservation Reserve",
        organizer: "Desert Adventures",
        image: "/dubai-desert-safari.png",
        url: "#",
      },
      {
        id: "8",
        name: "Dubai Shopping Festival",
        description: "Month-long shopping extravaganza with discounts, entertainment, and prizes.",
        date: "2024-04-01",
        time: "10:00 AM",
        location: "Dubai Mall",
        category: "Festival",
        price: "Free",
        rating: 4.3,
        attendees: 50000,
        venue: "Dubai Mall",
        organizer: "Dubai Tourism",
        image: "/dubai-shopping-festival.png",
        url: "#",
      },
    ],
    "New York": [
      {
        id: "9",
        name: "Broadway Show: Hamilton",
        description: "The revolutionary musical that tells the story of Alexander Hamilton.",
        date: "2024-04-19",
        time: "8:00 PM",
        location: "Richard Rodgers Theatre",
        category: "Music",
        price: "$150",
        rating: 4.9,
        attendees: 1300,
        venue: "Richard Rodgers Theatre",
        organizer: "Broadway Productions",
        url: "#",
      },
      {
        id: "10",
        name: "Central Park Food Festival",
        description: "Outdoor food festival featuring NYC's best food trucks and local vendors.",
        date: "2024-04-21",
        time: "11:00 AM",
        location: "Central Park",
        category: "Food",
        price: "Free",
        rating: 4.2,
        attendees: 8000,
        venue: "Central Park",
        organizer: "NYC Food Events",
        url: "#",
      },
    ],
    London: [
      {
        id: "11",
        name: "Thames Jazz Cruise",
        description: "Evening jazz performance while cruising past London's iconic landmarks.",
        date: "2024-04-17",
        time: "7:00 PM",
        location: "Westminster Pier",
        category: "Music",
        price: "£55",
        rating: 4.6,
        attendees: 120,
        venue: "Thames River",
        organizer: "London Jazz Society",
        url: "#",
      },
      {
        id: "12",
        name: "Borough Market Food Tour",
        description: "Guided culinary tour through London's oldest and most renowned food market.",
        date: "2024-04-23",
        time: "10:00 AM",
        location: "Borough Market",
        category: "Food",
        price: "£35",
        rating: 4.5,
        attendees: 300,
        venue: "Borough Market",
        organizer: "London Food Tours",
        url: "#",
      },
    ],
    Sydney: [
      {
        id: "13",
        name: "Sydney Opera House Concert",
        description: "Classical music performance by the Sydney Symphony Orchestra.",
        date: "2024-04-24",
        time: "8:00 PM",
        location: "Sydney Opera House",
        category: "Music",
        price: "AUD 120",
        rating: 4.8,
        attendees: 2000,
        venue: "Sydney Opera House",
        organizer: "Sydney Symphony Orchestra",
        url: "#",
      },
      {
        id: "14",
        name: "Bondi Beach Festival",
        description: "Beach festival with live music, food stalls, and water sports activities.",
        date: "2024-04-26",
        time: "12:00 PM",
        location: "Bondi Beach",
        category: "Festival",
        price: "Free",
        rating: 4.4,
        attendees: 12000,
        venue: "Bondi Beach",
        organizer: "Sydney Beach Events",
        url: "#",
      },
    ],
    Rome: [
      {
        id: "15",
        name: "Colosseum Night Tour",
        description: "Exclusive evening tour of the ancient amphitheater with underground access.",
        date: "2024-04-27",
        time: "8:30 PM",
        location: "Colosseum",
        category: "Culture",
        price: "€65",
        rating: 4.7,
        attendees: 200,
        venue: "Colosseum",
        organizer: "Roman Heritage Tours",
        url: "#",
      },
      {
        id: "16",
        name: "Roman Food & Wine Experience",
        description: "Traditional Roman cuisine paired with local wines in historic Trastevere.",
        date: "2024-04-29",
        time: "7:00 PM",
        location: "Trastevere",
        category: "Food",
        price: "€75",
        rating: 4.6,
        attendees: 150,
        venue: "Trastevere District",
        organizer: "Roman Culinary Tours",
        url: "#",
      },
    ],
    Bangkok: [
      {
        id: "17",
        name: "Floating Market Tour",
        description: "Early morning visit to traditional floating markets with boat ride and local breakfast.",
        date: "2024-04-30",
        time: "6:00 AM",
        location: "Damnoen Saduak",
        category: "Culture",
        price: "฿1,200",
        rating: 4.5,
        attendees: 400,
        venue: "Damnoen Saduak Floating Market",
        organizer: "Bangkok Tours",
        url: "#",
      },
      {
        id: "18",
        name: "Thai Cooking Class",
        description: "Learn to cook authentic Thai dishes with market tour and recipe book included.",
        date: "2024-05-02",
        time: "9:00 AM",
        location: "Silom Cooking School",
        category: "Food",
        price: "฿2,500",
        rating: 4.8,
        attendees: 50,
        venue: "Silom Cooking School",
        organizer: "Thai Culinary Institute",
        image: "/balinese-cooking-class.png",
        url: "#",
      },
    ],
  }

  // Return events for the city or generate generic events
  return eventsDatabase[city] || generateGenericEvents(city)
}

function generateGenericEvents(city: string): Event[] {
  const genericEvents = [
    {
      id: `${city}-1`,
      name: `${city} City Walking Tour`,
      description: `Discover the hidden gems and rich history of ${city} with our expert local guides.`,
      date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      time: "10:00 AM",
      location: `${city} City Center`,
      category: "Culture",
      price: "Free",
      rating: 4.3,
      attendees: Math.floor(Math.random() * 500) + 50,
      venue: `${city} Tourist Center`,
      organizer: `${city} Tourism Board`,
      url: "#",
    },
    {
      id: `${city}-2`,
      name: `${city} Food Festival`,
      description: `Taste the authentic flavors of ${city} at this amazing food festival featuring local cuisine.`,
      date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      time: "6:00 PM",
      location: `${city} Main Square`,
      category: "Food",
      price: "$25",
      rating: 4.5,
      attendees: Math.floor(Math.random() * 2000) + 200,
      venue: `${city} Main Square`,
      organizer: `${city} Food Association`,
      url: "#",
    },
    {
      id: `${city}-3`,
      name: `${city} Music Night`,
      description: `Enjoy live music performances from local and international artists in ${city}.`,
      date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      time: "8:00 PM",
      location: `${city} Concert Hall`,
      category: "Music",
      price: "$45",
      rating: 4.6,
      attendees: Math.floor(Math.random() * 1000) + 100,
      venue: `${city} Concert Hall`,
      organizer: `${city} Music Society`,
      url: "#",
    },
  ]

  return genericEvents
}

export function getCategoryIcon(category: string): string {
  if (!category) return "🎫"

  const lowerCategory = category.toLowerCase()

  if (lowerCategory.includes("music")) {
    return "🎵"
  } else if (lowerCategory.includes("food")) {
    return "🍽️"
  } else if (lowerCategory.includes("art")) {
    return "🎨"
  } else if (lowerCategory.includes("culture")) {
    return "🏛️"
  } else if (lowerCategory.includes("festival")) {
    return "🎉"
  } else if (lowerCategory.includes("sport")) {
    return "⚽"
  } else if (lowerCategory.includes("theater") || lowerCategory.includes("theatre")) {
    return "🎭"
  } else if (lowerCategory.includes("dance")) {
    return "💃"
  } else if (lowerCategory.includes("adventure")) {
    return "🏔️"
  } else if (lowerCategory.includes("entertainment")) {
    return "🎪"
  }

  return "🎫"
}
