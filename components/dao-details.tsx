"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/hooks/use-web3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ethers } from "ethers"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Users, FileText, Wallet } from "lucide-react"

type DaoSummary = {
  name: string
  metadataCID: string
  creator: string
  balance: bigint
  proposalCount: bigint
  creationDate: Date
  active: boolean
  isCreator: boolean
}

export function DaoDetails({ address }: { address: string }) {
  const { contract, isConnected, account } = useWeb3()
  const [daoSummary, setDaoSummary] = useState<DaoSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDaoSummary() {
      if (contract && isConnected && address && account) {
        try {
          setLoading(true)
          setError(null)
          console.log("Fetching DAO summary for address:", address)

          // Call the contract to get DAO summary
          const summary = await contract.getDaoSummary(address)
          console.log("DAO Summary:", summary)

          // Check if the current user is the creator
          const isCreator = summary[2].toLowerCase() === account.toLowerCase()
          console.log("Current account:", account)
          console.log("DAO creator:", summary[2])
          console.log("Is creator:", isCreator)

          setDaoSummary({
            name: summary[0],
            metadataCID: summary[1],
            creator: summary[2],
            balance: summary[3],
            proposalCount: summary[4],
            creationDate: new Date(), // Creation date not available in contract, using current date as placeholder
            active: summary[5], // The active status is now the 6th element in the array
            isCreator,
          })
        } catch (error) {
          console.error("Error fetching DAO summary:", error)
          setError(
            "Failed to fetch DAO information. The DAO might not exist or the contract doesn't support this function.",
          )
          toast({
            title: "Error",
            description: "Failed to fetch DAO information",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      } else if (isConnected) {
        setLoading(false)
        setError("Please connect your wallet to view DAO details.")
      }
    }

    fetchDaoSummary()
  }, [contract, isConnected, address, account])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Add a refreshDaoSummary function to the DaoDetails component
  const refreshDaoSummary = async () => {
    if (contract && isConnected && address && account) {
      try {
        setLoading(true)
        setError(null)
        console.log("Refreshing DAO summary for address:", address)

        // Call the contract to get DAO summary
        const summary = await contract.getDaoSummary(address)
        console.log("Updated DAO Summary:", summary)

        // Check if the current user is the creator
        const isCreator = summary[2].toLowerCase() === account.toLowerCase()

        setDaoSummary({
          name: summary[0],
          metadataCID: summary[1],
          creator: summary[2],
          balance: summary[3],
          proposalCount: summary[4],
          creationDate: new Date(),
          active: summary[5],
          isCreator,
        })
      } catch (error) {
        console.error("Error refreshing DAO summary:", error)
        setError("Failed to refresh DAO information.")
      } finally {
        setLoading(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-36" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!daoSummary) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>DAO Not Found</AlertTitle>
        <AlertDescription>The requested DAO could not be found or does not exist.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{daoSummary.name}</h1>
        {!daoSummary.active && <Badge variant="destructive">Inactive</Badge>}
      </div>

      {!daoSummary.active && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Inactive DAO</AlertTitle>
          <AlertDescription>
            This DAO has been shut down by its creator and is no longer active. No new proposals can be created or voted
            on.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>DAO Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Creator</p>
                  <p className="font-mono">{formatAddress(daoSummary.creator)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Treasury Balance</p>
                  <p className="font-bold">{ethers.formatEther(daoSummary.balance)} XDC</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Creation Date</p>
                  <p>{daoSummary.creationDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Proposal Count</p>
                  <p>{daoSummary.proposalCount.toString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className={daoSummary.active ? "text-green-500" : "text-red-500"}>
                    {daoSummary.active ? "Active" : "Inactive"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">DAO Address</p>
                  <p className="font-mono text-xs break-all">{address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {daoSummary.active && (
                    <>
                      <Button asChild variant="outline" className="justify-start">
                        <Link href={`/dao/${address}/create-proposal`}>Create Proposal</Link>
                      </Button>
                      <Button asChild variant="outline" className="justify-start">
                        <Link href={`/dao/${address}/fund`}>Fund DAO</Link>
                      </Button>
                    </>
                  )}
                  <Button asChild variant="outline" className="justify-start">
                    <Link href={`/dao/${address}/proposals`}>View Proposals</Link>
                  </Button>

                  {daoSummary.isCreator && daoSummary.active && (
                    <Button asChild variant="outline" className="justify-start">
                      <Link href={`/dao/${address}/transfer`}>Transfer Funds</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Treasury Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current Balance:</span>
                    <span className="font-bold text-lg">{ethers.formatEther(daoSummary.balance)} XDC</span>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-2">Treasury Actions:</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/dao/${address}/fund`}>Fund Treasury</Link>
                      </Button>
                      {daoSummary.isCreator && daoSummary.active && (
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link href={`/dao/${address}/transfer`}>Transfer Funds</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="proposals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">View all proposals for this DAO</p>
                <Button asChild>
                  <Link href={`/dao/${address}/proposals`}>View All Proposals</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                DAO Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  This feature will show all members of the DAO. Coming soon!
                </p>
                <Button variant="outline" disabled>
                  View Members
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Badge component for DAO status
function Badge({ variant, children }: { variant: "default" | "destructive" | "outline"; children: React.ReactNode }) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
        variant === "destructive"
          ? "bg-destructive text-destructive-foreground"
          : variant === "outline"
            ? "border border-input bg-background"
            : "bg-primary text-primary-foreground"
      }`}
    >
      {children}
    </span>
  )
}
