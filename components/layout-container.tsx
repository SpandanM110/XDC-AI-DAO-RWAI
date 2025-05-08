"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useWeb3 } from "@/hooks/use-web3"
import { TopNavigation } from "./top-navigation"
import { Loader2 } from "lucide-react"
import { WelcomeScreen } from "./welcome-screen"

export function LayoutContainer({ children }: { children: React.ReactNode }) {
  const { isConnected, isLoading } = useWeb3()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />

      <div className="container mx-auto p-4 md:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-120px)]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading...</span>
          </div>
        ) : !isConnected ? (
          <WelcomeScreen />
        ) : (
          children
        )}
      </div>
    </div>
  )
}
