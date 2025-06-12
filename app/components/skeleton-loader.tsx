import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function WeatherSkeleton() {
  return (
    <div className="space-y-4 w-full">
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-24 mt-2" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2 min-w-[80px]">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2 p-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

