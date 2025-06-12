"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function TemperatureToggle({
  onToggle,
}: {
  onToggle: (isCelsius: boolean) => void
}) {
  const [isCelsius, setIsCelsius] = useState(true)

  const handleToggle = (checked: boolean) => {
    setIsCelsius(checked)
    onToggle(checked)
  }

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="temp-unit" className={isCelsius ? "text-gray-400" : "font-medium"}>
        °F
      </Label>
      <Switch id="temp-unit" checked={isCelsius} onCheckedChange={handleToggle} />
      <Label htmlFor="temp-unit" className={isCelsius ? "font-medium" : "text-gray-400"}>
        °C
      </Label>
    </div>
  )
}

