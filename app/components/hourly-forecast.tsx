"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function HourlyForecast({ hourlyData, getWeatherIcon, convertTemp, getTempUnit }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex space-x-4">
            {hourlyData.map((hour, index) => (
              <div key={index} className="text-center p-2 rounded-lg bg-gray-50 min-w-[80px]">
                <p className="font-medium text-sm">{hour.time}</p>
                <div className="flex justify-center my-2">{getWeatherIcon(hour.condition)}</div>
                <p className="font-bold">
                  {convertTemp(hour.temp)}
                  {getTempUnit()}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

