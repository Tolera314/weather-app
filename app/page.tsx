"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Cloud, CloudRain, Sun, CloudSun, Wind, Droplets, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { TemperatureToggle } from "./components/temperature-toggle"
import { SavedLocations } from "./components/saved-locations"
import { HourlyForecast } from "./components/hourly-forecast"
import { WeatherBackground } from "./components/weather-background"
import { WeatherSkeleton } from "./components/skeleton-loader"
import { AppHeader } from "./components/app-header"
import { SearchHistory } from "./components/search-history"
import { RefreshButton } from "./components/refresh-button"
import { useMobile } from "@/hooks/use-mobile"

export default function WeatherApp() {
  const [location, setLocation] = useState("")
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [isCelsius, setIsCelsius] = useState(true)
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(null)
  const { toast } = useToast()
  const isMobile = useMobile()

  const { searchHistory, addToHistory, historyComponent } = SearchHistory({
    onSelectLocation: (loc) => {
      setLocation(loc)
      fetchWeather(null, loc)
    },
  })

  // Load settings from localStorage
  useEffect(() => {
    const settings = localStorage.getItem("weatherAppSettings")
    if (settings) {
      const parsedSettings = JSON.parse(settings)
      setIsCelsius(parsedSettings.defaultUnit !== "fahrenheit")

      // Set up auto-refresh if enabled
      if (parsedSettings.autoRefresh && weather) {
        const interval = Number.parseInt(parsedSettings.refreshInterval || "30", 10) * 60 * 1000
        const autoRefresh = setInterval(() => {
          fetchWeather(null, location)
        }, interval)

        setAutoRefreshInterval(autoRefresh)

        return () => clearInterval(autoRefresh)
      }
    }

    setInitialLoading(false)
  }, [weather, location])

  // Clean up auto-refresh interval
  useEffect(() => {
    return () => {
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval)
      }
    }
  }, [autoRefreshInterval])

  // Try to load last location on initial load
  useEffect(() => {
    const lastLocation = localStorage.getItem("weatherAppLastLocation")
    if (lastLocation) {
      setLocation(lastLocation)
      fetchWeather(null, lastLocation)
    } else {
      setInitialLoading(false)
      // Try to get user's location automatically
      getCurrentLocation()
    }
  }, [])

  const fetchWeather = useCallback(
    async (e, locationOverride = null) => {
      e?.preventDefault()

      const locationToFetch = locationOverride || location

      if (!locationToFetch.trim()) {
        toast({
          title: "Error",
          description: "Please enter a location",
          variant: "destructive",
        })
        return
      }

      setLoading(true)

      try {
        // Call our API endpoint
        const response = await fetch(`/api/weather?location=${encodeURIComponent(locationToFetch)}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch weather data")
        }

        const weatherData = await response.json()
        setWeather(weatherData)

        // Save to search history if it's a new search
        if (locationOverride !== location) {
          setLocation(weatherData.location)
        }

        // Add to search history
        addToHistory(weatherData.location)

        // Save as last location
        localStorage.setItem("weatherAppLastLocation", weatherData.location)
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch weather data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
        setInitialLoading(false)
      }
    },
    [location, toast, addToHistory],
  )

  const getWeatherIcon = (condition) => {
    const iconSize = isMobile ? "h-6 w-6" : "h-8 w-8"

    switch (condition) {
      case "Sunny":
        return <Sun className={`${iconSize} text-yellow-500`} />
      case "Cloudy":
        return <Cloud className={`${iconSize} text-gray-500`} />
      case "Rainy":
        return <CloudRain className={`${iconSize} text-blue-500`} />
      case "Partly Cloudy":
        return <CloudSun className={`${iconSize} text-gray-500`} />
      case "Windy":
        return <Wind className={`${iconSize} text-blue-300`} />
      default:
        return <Cloud className={iconSize} />
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            // Call our API endpoint with coordinates
            const response = await fetch(`/api/weather?location=${latitude},${longitude}`)

            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(errorData.error || "Failed to fetch weather data")
            }

            const weatherData = await response.json()
            setWeather(weatherData)
            setLocation(weatherData.location) // Update the input field with the location name

            // Add to search history
            addToHistory(weatherData.location)

            // Save as last location
            localStorage.setItem("weatherAppLastLocation", weatherData.location)
          } catch (error) {
            toast({
              title: "Error",
              description: error.message || "Failed to fetch weather data for your location",
              variant: "destructive",
            })
          } finally {
            setLoading(false)
            setInitialLoading(false)
          }
        },
        (error) => {
          setLoading(false)
          setInitialLoading(false)
          toast({
            title: "Geolocation Error",
            description: getGeolocationErrorMessage(error),
            variant: "destructive",
          })
        },
      )
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      })
    }
  }

  const getGeolocationErrorMessage = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location access was denied. Please enable location services."
      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable."
      case error.TIMEOUT:
        return "The request to get your location timed out."
      default:
        return "An unknown error occurred while trying to get your location."
    }
  }

  // Convert temperature between Celsius and Fahrenheit
  const convertTemp = (temp) => {
    if (isCelsius) {
      return temp
    }
    return Math.round((temp * 9) / 5 + 32)
  }

  // Get the temperature unit symbol
  const getTempUnit = () => (isCelsius ? "°C" : "°F")

  // Handle selecting a saved location
  const handleSelectSavedLocation = (savedLocation) => {
    setLocation(savedLocation)
    // Fetch weather for the selected location
    fetchWeather(null, savedLocation)
  }

  // Handle refresh button click
  const handleRefresh = async () => {
    return fetchWeather(null, location)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      {weather && <WeatherBackground condition={weather.current.condition} />}

      <main className="flex-1 container py-6 md:py-10">
        <div className="mx-auto max-w-md w-full space-y-6">
          <div className="space-y-4">
            <form onSubmit={fetchWeather} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Loading..." : <Search className="h-4 w-4" />}
              </Button>
            </form>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={getCurrentLocation}
                  disabled={loading}
                >
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">My Location</span>
                </Button>

                {historyComponent}
              </div>

              <div className="flex items-center gap-2">
                <RefreshButton onRefresh={handleRefresh} />

                <SavedLocations
                  currentLocation={weather?.location || ""}
                  onSelectLocation={handleSelectSavedLocation}
                />
              </div>
            </div>
          </div>

          {initialLoading ? (
            <WeatherSkeleton />
          ) : weather ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <TemperatureToggle onToggle={setIsCelsius} />
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl sm:text-2xl">{weather.location}</CardTitle>
                  <CardDescription>Current Weather</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                      {getWeatherIcon(weather.current.condition)}
                      <div>
                        <p className="text-2xl sm:text-4xl font-bold">
                          {convertTemp(weather.current.temp)}
                          {getTempUnit()}
                        </p>
                        <p className="text-sm sm:text-base text-muted-foreground">{weather.current.condition}</p>
                      </div>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                        <span className="text-xs sm:text-sm">{weather.current.humidity}% Humidity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="h-3 w-3 sm:h-4 sm:w-4 text-blue-300" />
                        <span className="text-xs sm:text-sm">{weather.current.wind} km/h Wind</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {weather.hourly && (
                <HourlyForecast
                  hourlyData={weather.hourly}
                  getWeatherIcon={getWeatherIcon}
                  convertTemp={convertTemp}
                  getTempUnit={getTempUnit}
                />
              )}

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>3-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    {weather.forecast.map((day, index) => (
                      <div key={index} className="text-center p-2 rounded-lg bg-accent/50">
                        <p className="font-medium text-xs sm:text-sm">{day.day}</p>
                        <div className="flex justify-center my-1 sm:my-2">{getWeatherIcon(day.condition)}</div>
                        <p className="font-bold text-sm sm:text-base">
                          {convertTemp(day.temp)}
                          {getTempUnit()}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{day.condition}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground justify-center">
                  Powered by WeatherAPI.com
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Welcome to Weather App</h2>
              <p className="text-muted-foreground mb-6">Enter a location or use your current location to get started</p>
              <Button onClick={getCurrentLocation} className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Use My Location
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

