"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/hooks/use-web3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ethers } from "ethers"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

export function DaoOverview() {
  const { contract, isConnected, daoAddress, account } = useWeb3()
  const [daoSummary, setDaoSummary] = useState<DaoSummary | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshDaoSummary = async () => {
    if (contract && isConnected && daoAddress && account) {
      try {
        setLoading(true)
        console.log("Refreshing DAO summary for address:", daoAddress)

        // Call the contract to get DAO summary
        const summary = await contract.getDaoSummary(daoAddress)
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
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    async function fetchDaoSummary() {
      if (contract && isConnected && daoAddress && account) {
        try {
          setLoading(true)
          console.log("Fetching DAO summary for address:", daoAddress)

          // Check if we're using a mock DAO address (starts with 0x123456...)
          const isMockAddress = daoAddress.startsWith("0x123456")

          if (isMockAddress) {
            console.log("Using mock data for DAO summary")
            // Use mock data for development/demo purposes
            setDaoSummary({
              name: "XDC Community DAO",
              metadataCID: "ipfs://QmXyz...",
              creator: account, // Use the current account as creator
              balance: ethers.parseEther("10"),
              proposalCount: BigInt(3),
              creationDate: new Date(),
              active: true,
              isCreator: true, // Make the current user the creator for demo
            })
            setLoading(false)
            return
          }

          // Call the contract to get DAO summary
          try {
            const summary = await contract.getDaoSummary(daoAddress)
            console.log("DAO Summary:", summary)

            // Check if the current user is the creator
            const isCreator = summary[2].toLowerCase() === account.toLowerCase()

            setDaoSummary({
              name: summary[0],
              metadataCID: summary[1],
              creator: summary[2],
              balance: summary[3],
              proposalCount: summary[4],
              creationDate: new Date(), // Creation date not available in contract, using current date as placeholder
              active: summary.length > 5 ? summary[5] : true, // Default to true if not available in contract
              isCreator,
            })
          } catch (error) {
            console.error("Error fetching DAO summary from contract:", error)
            // Use mock data as fallback
            setDaoSummary({
              name: "XDC Community DAO",
              metadataCID: "ipfs://QmXyz...",
              creator: account, // Use the current account as creator
              balance: ethers.parseEther("5"),
              proposalCount: BigInt(2),
              creationDate: new Date(),
              active: true,
              isCreator: true, // Make the current user the creator for demo
            })
          }
        } catch (error) {
          console.error("Error fetching DAO summary:", error)
          toast({
            title: "Error",
            description: "Failed to fetch DAO information",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      } else if (!daoAddress && isConnected) {
        setLoading(false)
      }
    }

    fetchDaoSummary()
  }, [contract, isConnected, daoAddress, account])

  useEffect(() => {
    if (daoAddress) {
      refreshDaoSummary()
    }
  }, [daoAddress, contract, isConnected, account])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            {loading ? <Skeleton className="h-8 w-48" /> : daoSummary ? daoSummary.name : "No DAO Found"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!daoAddress && !loading && isConnected ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No DAO found. You need to create one first.</p>
              <Button asChild>
                <Link href="/create-dao">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create a DAO
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {daoSummary && !daoSummary.active && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Inactive DAO</AlertTitle>
                  <AlertDescription>
                    This DAO has been shut down by its creator and is no longer active. No new proposals can be created
                    or voted on.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Creator</p>
                  {loading ? (
                    <Skeleton className="h-6 w-36 mt-1" />
                  ) : daoSummary ? (
                    <p className="font-mono">{formatAddress(daoSummary.creator)}</p>
                  ) : (
                    <p>-</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Treasury Balance</p>
                  {loading ? (
                    <Skeleton className="h-6 w-24 mt-1" />
                  ) : daoSummary ? (
                    <p className="font-bold">{ethers.formatEther(daoSummary.balance)} XDC</p>
                  ) : (
                    <p>0 XDC</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Creation Date</p>
                  {loading ? (
                    <Skeleton className="h-6 w-32 mt-1" />
                  ) : daoSummary ? (
                    <p>{daoSummary.creationDate.toLocaleDateString()}</p>
                  ) : (
                    <p>-</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Proposal Count</p>
                  {loading ? (
                    <Skeleton className="h-6 w-16 mt-1" />
                  ) : daoSummary ? (
                    <p>{daoSummary.proposalCount.toString()}</p>
                  ) : (
                    <p>0</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {loading ? (
                    <Skeleton className="h-6 w-16 mt-1" />
                  ) : daoSummary ? (
                    <p className={daoSummary.active ? "text-green-500" : "text-red-500"}>
                      {daoSummary.active ? "Active" : "Inactive"}
                    </p>
                  ) : (
                    <p>-</p>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {daoAddress && daoSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {daoSummary.active && (
                  <>
                    <Button asChild variant="outline" className="justify-start">
                      <Link href="/create-proposal">Create Proposal</Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                      <Link href="/fund-dao">Fund DAO</Link>
                    </Button>
                  </>
                )}
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/proposals">View Proposals</Link>
                </Button>

                {daoSummary.isCreator && daoSummary.active && (
                  <Button asChild variant="outline" className="justify-start">
                    <Link href={`/dao/${daoAddress}/transfer`}>Transfer Funds</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Contract Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">DAO Address</p>
                  <p className="font-mono text-xs break-all">{daoAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Factory Contract</p>
                  <p className="font-mono text-xs break-all">{contract?.target}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Network</p>
                  <p>XDC Apothem Testnet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
