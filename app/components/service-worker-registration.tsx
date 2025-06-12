"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function ServiceWorkerRegistration() {
  const { toast } = useToast()

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("ServiceWorker registration successful with scope: ", registration.scope)
          })
          .catch((error) => {
            console.log("ServiceWorker registration failed: ", error)
          })
      })
    }

    // Check for app installation
    let deferredPrompt

    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      deferredPrompt = e

      // Show a notification that the app can be installed
      toast({
        title: "Install Weather App",
        description: "Add this app to your home screen for quick access",
        action: (
          <button
            className="rounded bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
            onClick={() => {
              // Show the install prompt
              deferredPrompt.prompt()
              // Wait for the user to respond to the prompt
              deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                  console.log("User accepted the install prompt")
                } else {
                  console.log("User dismissed the install prompt")
                }
                deferredPrompt = null
              })
            }}
          >
            Install
          </button>
        ),
        duration: 10000,
      })
    })
  }, [toast])

  return null
}

