"use client"

import { useEffect, useState } from "react"

export function WeatherBackground({ condition }) {
  const [timeOfDay, setTimeOfDay] = useState("day")

  useEffect(() => {
    const hours = new Date().getHours()
    if (hours >= 6 && hours < 18) {
      setTimeOfDay("day")
    } else {
      setTimeOfDay("night")
    }
  }, [])

  const getBackgroundClass = () => {
    if (timeOfDay === "night") {
      return "from-slate-900 to-blue-900"
    }

    switch (condition) {
      case "Sunny":
        return "from-sky-400 to-blue-500"
      case "Cloudy":
        return "from-gray-300 to-gray-400"
      case "Rainy":
        return "from-slate-500 to-slate-700"
      case "Partly Cloudy":
        return "from-blue-300 to-blue-400"
      case "Windy":
        return "from-cyan-400 to-blue-500"
      default:
        return "from-sky-100 to-white"
    }
  }

  return (
    <div className={`fixed inset-0 bg-gradient-to-b ${getBackgroundClass()} -z-10`}>
      {condition === "Rainy" && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="rain">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="drop"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      )}

      {condition === "Sunny" && timeOfDay === "day" && (
        <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-yellow-300 blur-xl opacity-70"></div>
      )}

      {condition === "Partly Cloudy" && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="clouds">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="cloud"
                style={{
                  top: `${10 + Math.random() * 20}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.7 + Math.random() * 0.3,
                  animationDuration: `${80 + Math.random() * 40}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

