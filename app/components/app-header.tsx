"use client"

import { useState } from "react"
import { ModeToggle } from "./mode-toggle"
import { Settings, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"

export function AppHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Link href="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-sky-500"
            >
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
            <span className="hidden md:inline-block">Weather App</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Menu</span>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-2">
                  <Link
                    href="/"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => setOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => setOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/settings" className="hidden md:block">
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

