"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

export function SearchHistory({
  onSelectLocation,
}: {
  onSelectLocation: (location: string) => void
}) {
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  // Load search history from localStorage on component mount
  useEffect(() => {
    const history = localStorage.getItem("weatherAppSearchHistory")
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // Add a location to search history
  const addToHistory = (location: string) => {
    if (!location) return

    // Create a new array without the location (if it exists)
    const filteredHistory = searchHistory.filter((item) => item !== location)

    // Add the location to the beginning of the array
    const newHistory = [location, ...filteredHistory].slice(0, 10) // Keep only the last 10 searches

    setSearchHistory(newHistory)
    localStorage.setItem("weatherAppSearchHistory", JSON.stringify(newHistory))
  }

  // Remove a location from search history
  const removeFromHistory = (location: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newHistory = searchHistory.filter((item) => item !== location)
    setSearchHistory(newHistory)
    localStorage.setItem("weatherAppSearchHistory", JSON.stringify(newHistory))
  }

  // Clear all search history
  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("weatherAppSearchHistory")
  }

  return {
    searchHistory,
    addToHistory,
    historyComponent: (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2" disabled={searchHistory.length === 0}>
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Recent Searches</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <ScrollArea className="h-64">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Recent Searches</h4>
                {searchHistory.length > 0 && (
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={clearHistory}>
                    Clear All
                  </Button>
                )}
              </div>

              {searchHistory.length === 0 ? (
                <p className="text-sm text-gray-500">No recent searches</p>
              ) : (
                <ul className="space-y-2">
                  {searchHistory.map((location, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => onSelectLocation(location)}
                    >
                      <span className="text-sm truncate">{location}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => removeFromHistory(location, e)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    ),
  }
}

