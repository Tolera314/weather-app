import { NextResponse } from "next/server"

// Helper function to map WeatherAPI conditions to our app's conditions
function mapWeatherCondition(condition: string): string {
  if (condition.includes("sunny") || condition.includes("clear")) {
    return "Sunny"
  } else if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("thunder")) {
    return "Rainy"
  } else if (condition.includes("cloudy") && condition.includes("partly")) {
    return "Partly Cloudy"
  } else if (condition.includes("cloudy") || condition.includes("overcast")) {
    return "Cloudy"
  } else if (condition.includes("wind")) {
    return "Windy"
  }
  return "Cloudy"
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location")

  if (!location) {
    return NextResponse.json({ error: "Location parameter is required" }, { status: 400 })
  }

  try {
    // Use the provided WeatherAPI key
    const API_KEY = "dcf6f78084a24a838d2143931250204"

    // Call the WeatherAPI.com API
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=3&aqi=no&alerts=no&hour=24`,
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to fetch weather data" },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Get the next 24 hours of forecast data
    const now = new Date()
    const currentHour = now.getHours()

    // Get hourly forecast for the next 24 hours
    const hourlyForecast = []
    let hoursRemaining = 24

    // Process today's remaining hours
    const todayHours = data.forecast.forecastday[0].hour.slice(currentHour)
    hourlyForecast.push(...todayHours.slice(0, hoursRemaining))
    hoursRemaining -= todayHours.length

    // If we need more hours, get them from tomorrow
    if (hoursRemaining > 0 && data.forecast.forecastday.length > 1) {
      const tomorrowHours = data.forecast.forecastday[1].hour.slice(0, hoursRemaining)
      hourlyForecast.push(...tomorrowHours)
    }

    // Format hourly data
    const formattedHourly = hourlyForecast.map((hour) => {
      const hourTime = new Date(hour.time)
      return {
        time: hourTime.getHours() + ":00",
        temp: Math.round(hour.temp_c),
        condition: mapWeatherCondition(hour.condition.text.toLowerCase()),
      }
    })

    // Format the data to match our app's structure
    const weatherData = {
      location: `${data.location.name}, ${data.location.country}`,
      current: {
        temp: Math.round(data.current.temp_c),
        condition: mapWeatherCondition(data.current.condition.text.toLowerCase()),
        humidity: data.current.humidity,
        wind: Math.round(data.current.wind_kph),
      },
      forecast: data.forecast.forecastday.map((day) => {
        return {
          day: new Date(day.date).toLocaleDateString("en-US", { weekday: "long" }),
          temp: Math.round(day.day.avgtemp_c),
          condition: mapWeatherCondition(day.day.condition.text.toLowerCase()),
        }
      }),
      hourly: formattedHourly,
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}

