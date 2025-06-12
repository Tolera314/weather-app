"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RefreshButton({
  onRefresh,
  className = "",
}: {
  onRefresh: () => Promise<void>
  className?: string
}) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Button variant="outline" size="icon" className={className} onClick={handleRefresh} disabled={isRefreshing}>
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      <span className="sr-only">Refresh</span>
    </Button>
  )
}

