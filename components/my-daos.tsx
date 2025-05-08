"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/hooks/use-web3"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Users, PlusCircle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ethers } from "ethers"
import { DaoCard } from "./dao-card"

type DaoInfo = {
  address: string
  name: string
  creator: string
  balance: bigint
  proposalCount: number
  isMember: boolean
  isCreator: boolean
  active: boolean
  category?: string
}

export function MyDaos() {
  const { contract, isConnected, account } = useWeb3()
  const [createdDao, setCreatedDao] = useState<DaoInfo | null>(null)
  const [joinedDaos, setJoinedDaos] = useState<DaoInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserDaos() {
      if (contract && isConnected && account) {
        try {
          setLoading(true)
          setError(null)
          console.log("Fetching DAOs for user:", account)

          // Fetch the DAO created by this user
          try {
            const userDaoAddress = await contract.getCreatorDao(account)
            if (userDaoAddress && userDaoAddress !== ethers.ZeroAddress) {
              console.log("User created DAO:", userDaoAddress)

              // Get DAO details
              const summary = await contract.getDaoSummary(userDaoAddress)

              setCreatedDao({
                address: userDaoAddress,
                name: summary[0],
                creator: summary[2],
                balance: summary[3],
                proposalCount: Number(summary[4]),
                isMember: true,
                isCreator: true,
                active: summary[5],
                category: extractCategory(summary[1]),
              })
            }
          } catch (error) {
            console.error("Error fetching user's created DAO:", error)
          }

          // Fetch DAOs the user has joined
          try {
            // Get all active DAOs
            const activeDAOs = await contract.getActiveDAOs(0, 50)
            console.log("All active DAOs:", activeDAOs)

            const userJoinedDaos: DaoInfo[] = []

            // Check each DAO if the user is a member
            for (const daoAddress of activeDAOs) {
              // Skip if this is the user's created DAO
              if (createdDao && daoAddress === createdDao.address) continue

              try {
                const isMember = await contract.isMember(daoAddress, account)

                if (isMember) {
                  // Get DAO details
                  const summary = await contract.getDaoSummary(daoAddress)

                  userJoinedDaos.push({
                    address: daoAddress,
                    name: summary[0],
                    creator: summary[2],
                    balance: summary[3],
                    proposalCount: Number(summary[4]),
                    isMember: true,
                    isCreator: summary[2].toLowerCase() === account.toLowerCase(),
                    active: summary[5],
                    category: extractCategory(summary[1]),
                  })
                }
              } catch (memberError) {
                console.error(`Error checking membership for DAO ${daoAddress}:`, memberError)
              }
            }

            setJoinedDaos(userJoinedDaos)
          } catch (error) {
            console.error("Error fetching joined DAOs:", error)
            setError("Failed to fetch joined DAOs. The contract might not support the required functions.")
          }
        } catch (error) {
          console.error("Error fetching user DAOs:", error)
          setError("Failed to fetch your DAOs. Please check your connection and try again.")
        } finally {
          setLoading(false)
        }
      } else if (isConnected) {
        setLoading(false)
      }
    }

    fetchUserDaos()
  }, [contract, isConnected, account])

  // Helper function to extract category from metadata
  const extractCategory = (metadata: string): string => {
    if (metadata && metadata.includes("|category:")) {
      const categoryMatch = metadata.match(/\|category:([a-z]+)/)
      if (categoryMatch && categoryMatch[1]) {
        return categoryMatch[1]
      }
    }
    return "other"
  }

  // Get category label
  const getCategoryLabel = (value: string): string => {
    const categories = {
      defi: "DeFi",
      social: "Social Impact",
      dev: "Development",
      community: "Community",
      other: "Other",
    }
    return categories[value as keyof typeof categories] || "Other"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </div>
    )
  }

  const hasNoDAOs = !createdDao && joinedDaos.length === 0

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {hasNoDAOs ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">No DAOs Found</h3>
            <p className="text-muted-foreground text-center mb-6">
              You haven't created or joined any DAOs yet. Create your own DAO or browse existing ones to join.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/create-dao">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create a DAO
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/browse-daos">Browse DAOs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All DAOs</TabsTrigger>
            <TabsTrigger value="created">Created</TabsTrigger>
            <TabsTrigger value="joined">Joined</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {createdDao && (
              <div className="space-y-2">
                <h2 className="text-lg font-medium">DAO You Created</h2>
                <DaoCard dao={createdDao} />
              </div>
            )}

            {joinedDaos.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-lg font-medium">DAOs You Joined</h2>
                <div className="grid grid-cols-1 gap-4">
                  {joinedDaos.map((dao) => (
                    <DaoCard key={dao.address} dao={dao} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="created">
            {createdDao ? (
              <DaoCard dao={createdDao} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <PlusCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No DAO Created</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    You haven't created a DAO yet. Create your own DAO to start managing proposals and funds.
                  </p>
                  <Button asChild>
                    <Link href="/create-dao">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create a DAO
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="joined">
            {joinedDaos.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {joinedDaos.map((dao) => (
                  <DaoCard key={dao.address} dao={dao} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No DAOs Joined</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    You haven't joined any DAOs yet. Browse existing DAOs to find ones that interest you.
                  </p>
                  <Button asChild>
                    <Link href="/browse-daos">Browse DAOs</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
