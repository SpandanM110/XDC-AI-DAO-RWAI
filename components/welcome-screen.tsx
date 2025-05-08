"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletConnect } from "@/components/wallet-connect"
import { useWeb3 } from "@/hooks/use-web3"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function WelcomeScreen() {
  const { isConnected } = useWeb3()
  const router = useRouter()

  useEffect(() => {
    if (isConnected) {
      router.push("/my-daos")
    }
  }, [isConnected, router])

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to XDC DAO</CardTitle>
          <CardDescription className="text-center">
            Connect your wallet to get started with decentralized governance on the XDC Network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 bg-gray-100 rounded-lg text-center dark:bg-gray-800">
            <h3 className="font-medium mb-2">Decentralized Governance Made Easy</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create, manage, and participate in DAOs with AI-powered governance tools
            </p>
          </div>
          <WalletConnect />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button variant="outline" className="w-full" onClick={() => router.push("/learn")}>
            Learn More
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.push("/browse-daos")}>
            Browse DAOs
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
