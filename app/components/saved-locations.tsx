"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

export function SavedLocations({
  currentLocation,
  onSelectLocation,
}: {
  currentLocation: string
  onSelectLocation: (location: string) => void
}) {
  const [savedLocations, setSavedLocations] = useState<string[]>([])

  // Load saved locations from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("weatherAppLocations")
    if (saved) {
      setSavedLocations(JSON.parse(saved))
    }
  }, [])

  // Save locations to localStorage when they change
  useEffect(() => {
    localStorage.setItem("weatherAppLocations", JSON.stringify(savedLocations))
  }, [savedLocations])

  const saveCurrentLocation = () => {
    if (!currentLocation) return

    if (!savedLocations.includes(currentLocation)) {
      setSavedLocations([...savedLocations, currentLocation])
    }
  }

  const removeLocation = (location: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSavedLocations(savedLocations.filter((loc) => loc !== location))
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={saveCurrentLocation}
        disabled={!currentLocation || savedLocations.includes(currentLocation)}
        title="Save current location"
      >
        <Star
          className={`h-4 w-4 ${savedLocations.includes(currentLocation) ? "fill-yellow-400 text-yellow-400" : ""}`}
        />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="px-2" disabled={savedLocations.length === 0}>
            Saved Locations ({savedLocations.length})
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <ScrollArea className="h-64">
            <div className="p-4">
              <h4 className="mb-2 font-medium">Your Saved Locations</h4>
              {savedLocations.length === 0 ? (
                <p className="text-sm text-gray-500">No saved locations yet</p>
              ) : (
                <ul className="space-y-2">
                  {savedLocations.map((location, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                      onClick={() => onSelectLocation(location)}
                    >
                      <span className="text-sm truncate">{location}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => removeLocation(location, e)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  )
}

