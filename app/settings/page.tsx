"use client"

import { useState, useEffect } from "react"
import { AppHeader } from "../components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Trash2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [defaultUnit, setDefaultUnit] = useState("celsius")
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState("30")
  const [saveSearchHistory, setSaveSearchHistory] = useState(true)
  const [saveLocations, setSaveLocations] = useState(true)
  const { toast } = useToast()

  // Load settings from localStorage on component mount
  useEffect(() => {
    const settings = localStorage.getItem("weatherAppSettings")
    if (settings) {
      const parsedSettings = JSON.parse(settings)
      setDefaultUnit(parsedSettings.defaultUnit || "celsius")
      setAutoRefresh(parsedSettings.autoRefresh || false)
      setRefreshInterval(parsedSettings.refreshInterval || "30")
      setSaveSearchHistory(parsedSettings.saveSearchHistory !== false)
      setSaveLocations(parsedSettings.saveLocations !== false)
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      defaultUnit,
      autoRefresh,
      refreshInterval,
      saveSearchHistory,
      saveLocations,
    }
    localStorage.setItem("weatherAppSettings", JSON.stringify(settings))

    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    })
  }

  // Clear all app data
  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all app data? This will remove your saved locations, search history, and reset all settings.",
      )
    ) {
      localStorage.removeItem("weatherAppSettings")
      localStorage.removeItem("weatherAppLocations")
      localStorage.removeItem("weatherAppSearchHistory")

      // Reset state to defaults
      setDefaultUnit("celsius")
      setAutoRefresh(false)
      setRefreshInterval("30")
      setSaveSearchHistory(true)
      setSaveLocations(true)

      toast({
        title: "Data cleared",
        description: "All app data has been reset to defaults",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1 container py-6 md:py-10 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Customize your weather app experience</p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Display Preferences</CardTitle>
                <CardDescription>Customize how weather information is displayed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Default Temperature Unit</Label>
                  <RadioGroup value={defaultUnit} onValueChange={setDefaultUnit} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="celsius" id="celsius" />
                      <Label htmlFor="celsius">Celsius (°C)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fahrenheit" id="fahrenheit" />
                      <Label htmlFor="fahrenheit">Fahrenheit (°F)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data & Updates</CardTitle>
                <CardDescription>Configure how the app refreshes and stores data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-refresh">Auto Refresh</Label>
                    <p className="text-sm text-muted-foreground">Automatically refresh weather data</p>
                  </div>
                  <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                </div>

                {autoRefresh && (
                  <div className="space-y-2">
                    <Label>Refresh Interval</Label>
                    <RadioGroup
                      value={refreshInterval}
                      onValueChange={setRefreshInterval}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="15" id="15min" />
                        <Label htmlFor="15min">Every 15 minutes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="30" id="30min" />
                        <Label htmlFor="30min">Every 30 minutes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="60" id="60min" />
                        <Label htmlFor="60min">Every hour</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="save-history">Save Search History</Label>
                    <p className="text-sm text-muted-foreground">Remember your recent searches</p>
                  </div>
                  <Switch id="save-history" checked={saveSearchHistory} onCheckedChange={setSaveSearchHistory} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="save-locations">Save Favorite Locations</Label>
                    <p className="text-sm text-muted-foreground">Remember your saved locations</p>
                  </div>
                  <Switch id="save-locations" checked={saveLocations} onCheckedChange={setSaveLocations} />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Button variant="destructive" className="flex items-center gap-2" onClick={clearAllData}>
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>

              <Button className="flex items-center gap-2" onClick={saveSettings}>
                <Save className="h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

