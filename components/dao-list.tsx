"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/hooks/use-web3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Users, Loader2, AlertCircle, Search, Filter, CheckCircle2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ethers } from "ethers"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type DaoInfo = {
  address: string
  name: string
  creator: string
  balance: bigint
  proposalCount: number
  isMember: boolean
  category?: string // Optional category field
}

export function DaoList() {
  const { contract, isConnected, account } = useWeb3()
  const [daos, setDaos] = useState<DaoInfo[]>([])
  const [filteredDaos, setFilteredDaos] = useState<DaoInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [joiningDao, setJoiningDao] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [selectedDao, setSelectedDao] = useState<DaoInfo | null>(null)
  const [joinStep, setJoinStep] = useState<"confirm" | "signing" | "success">("confirm")

  // Categories for filtering - these should match the ones in CreateDao component
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "defi", label: "DeFi" },
    { value: "social", label: "Social Impact" },
    { value: "dev", label: "Development" },
    { value: "community", label: "Community" },
    { value: "other", label: "Other" },
  ]

  useEffect(() => {
    async function fetchDaos() {
      if (contract && isConnected) {
        try {
          setLoading(true)
          setError(null)
          console.log("Fetching active DAOs")

          try {
            // Use the new getActiveDAOs function
            const activeDAOs = await contract.getActiveDAOs(0, 20)
            console.log("Active DAOs:", activeDAOs)

            if (activeDAOs && activeDAOs.length > 0) {
              const fetchedDaos: DaoInfo[] = []

              for (let i = 0; i < activeDAOs.length; i++) {
                try {
                  const daoAddress = activeDAOs[i]
                  console.log(`Fetched DAO address ${i}:`, daoAddress)

                  // Get DAO details
                  const summary = await contract.getDaoSummary(daoAddress)

                  // Check if the current user is a member
                  let isMember = false
                  try {
                    isMember = await contract.isMember(daoAddress, account)
                  } catch (memberError) {
                    console.log("Could not determine membership status")
                  }

                  // Extract category from metadata if available
                  let category = "other" // Default category
                  try {
                    const metadata = summary[1] // metadataCID
                    if (metadata && metadata.includes("|category:")) {
                      const categoryMatch = metadata.match(/\|category:([a-z]+)/)
                      if (categoryMatch && categoryMatch[1]) {
                        category = categoryMatch[1]
                      }
                    }
                  } catch (error) {
                    console.log("Could not extract category from metadata")
                  }

                  fetchedDaos.push({
                    address: daoAddress,
                    name: summary[0],
                    creator: summary[2],
                    balance: summary[3],
                    proposalCount: Number(summary[4]),
                    isMember,
                    category,
                  })
                } catch (error) {
                  console.error(`Error fetching DAO details for index ${i}:`, error)
                }
              }

              setDaos(fetchedDaos)
              setFilteredDaos(fetchedDaos)
            } else {
              setDaos([])
              setFilteredDaos([])
            }
          } catch (error) {
            console.error("Error fetching DAOs:", error)
            setError("Failed to fetch DAOs. The contract might not support the expected functions.")

            // Fallback to simulated data
            simulateDaos()
          }
        } catch (error) {
          console.error("Error in fetchDaos:", error)
          setError("Failed to fetch DAOs. Please check your connection and try again.")
          toast({
            title: "Error",
            description: "Failed to fetch DAOs",
            variant: "destructive",
          })

          // Fallback to simulated data
          simulateDaos()
        } finally {
          setLoading(false)
        }
      } else if (isConnected) {
        setLoading(false)
        setDaos([])
        setFilteredDaos([])
      }
    }

    // Helper function to create simulated DAOs
    function simulateDaos() {
      const simulatedDaos: DaoInfo[] = [
        {
          address: "0x1234567890123456789012345678901234567890",
          name: "Community Development DAO",
          creator: "0x9876543210987654321098765432109876543210",
          balance: ethers.parseEther("10"),
          proposalCount: 5,
          isMember: false,
          category: "community",
        },
        {
          address: "0x2345678901234567890123456789012345678901",
          name: "XDC Ecosystem Fund",
          creator: "0x8765432109876543210987654321098765432109",
          balance: ethers.parseEther("25"),
          proposalCount: 8,
          isMember: true,
          category: "dev",
        },
        {
          address: "0x3456789012345678901234567890123456789012",
          name: "DeFi Governance",
          creator: "0x7654321098765432109876543210987654321098",
          balance: ethers.parseEther("5.5"),
          proposalCount: 3,
          isMember: false,
          category: "defi",
        },
        {
          address: "0x4567890123456789012345678901234567890123",
          name: "XDC Social Impact",
          creator: "0x6543210987654321098765432109876543210987",
          balance: ethers.parseEther("15.2"),
          proposalCount: 6,
          isMember: false,
          category: "social",
        },
        {
          address: "0x5678901234567890123456789012345678901234",
          name: "Blockchain Education Fund",
          creator: "0x5432109876543210987654321098765432109876",
          balance: ethers.parseEther("8.7"),
          proposalCount: 4,
          isMember: false,
          category: "other",
        },
      ]
      setDaos(simulatedDaos)
      setFilteredDaos(simulatedDaos)
      setError("Using simulated DAO data. To see real data, deploy the updated contract with getActiveDAOs function.")
    }

    fetchDaos()
  }, [contract, isConnected, account])

  // Filter DAOs based on search term and category
  useEffect(() => {
    let filtered = daos

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (dao) =>
          dao.name.toLowerCase().includes(term) ||
          dao.address.toLowerCase().includes(term) ||
          dao.creator.toLowerCase().includes(term),
      )
    }

    // Filter by category
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter((dao) => dao.category === categoryFilter)
    }

    setFilteredDaos(filtered)
  }, [searchTerm, categoryFilter, daos])

  const initiateJoinDao = (dao: DaoInfo) => {
    setSelectedDao(dao)
    setJoinStep("confirm")
    setJoinDialogOpen(true)
  }

  // Update the handleJoinDao function to handle potential missing functions
  const handleJoinDao = async () => {
    if (!contract || !isConnected || !selectedDao) return

    try {
      setJoinStep("signing")
      setJoiningDao(selectedDao.address)
      console.log("Joining DAO:", selectedDao.address)

      // Use the joinDAO function from the enhanced contract
      const tx = await contract.joinDAO(selectedDao.address)
      console.log("Transaction sent:", tx.hash)

      toast({
        title: "Transaction Sent",
        description: "Joining DAO. Please wait for confirmation...",
      })

      // Wait for transaction confirmation
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt)

      // Update the UI
      setDaos((prev) =>
        prev.map((dao) =>
          dao.address === selectedDao.address
            ? {
                ...dao,
                isMember: true,
              }
            : dao,
        ),
      )

      setJoinStep("success")

      toast({
        title: "DAO Joined",
        description: `You have successfully joined the DAO`,
      })
    } catch (error: any) {
      console.error("Error joining DAO:", error)

      // Extract a more user-friendly error message
      let errorMessage = "Failed to join DAO"

      if (error.message) {
        if (error.message.includes("not active")) {
          errorMessage = "This DAO is not active"
        } else if (error.message.includes("does not exist")) {
          errorMessage = "This DAO does not exist"
        } else if (error.message.includes("gas")) {
          errorMessage = "Transaction failed: Not enough gas or gas price too low"
        } else if (error.message.includes("rejected")) {
          errorMessage = "Transaction rejected by user"
        }
      }

      toast({
        title: "Error Joining DAO",
        description: errorMessage,
        variant: "destructive",
      })

      setJoinDialogOpen(false)
    } finally {
      setJoiningDao(null)
    }
  }

  const closeJoinDialog = () => {
    setJoinDialogOpen(false)
    // Reset after a short delay to allow for animation
    setTimeout(() => {
      setSelectedDao(null)
      setJoinStep("confirm")
    }, 300)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getCategoryLabel = (value: string) => {
    const category = categories.find((c) => c.value === value)
    return category ? category.label : "Unknown"
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active DAOs</CardTitle>
          <Button asChild size="sm">
            <Link href="/create-dao">Create Your Own DAO</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or address..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDaos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || categoryFilter !== "all" ? (
                <p className="mb-4">No DAOs found matching your search criteria.</p>
              ) : (
                <p className="mb-4">No active DAOs found. Be the first to create one!</p>
              )}
              <Button asChild>
                <Link href="/create-dao">Create a DAO</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDaos.map((dao) => (
                <div key={dao.address} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{dao.name}</h3>
                    <div className="flex gap-2">
                      {dao.category && <Badge variant="secondary">{getCategoryLabel(dao.category)}</Badge>}
                      {dao.isMember && <Badge variant="outline">Member</Badge>}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-3">
                    <span>Creator: {formatAddress(dao.creator)}</span>
                    <span>Balance: {ethers.formatEther(dao.balance)} XDC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{dao.proposalCount} Proposals</span>
                    </div>
                    {dao.isMember ? (
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/dao/${dao.address}`}>View DAO</Link>
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => initiateJoinDao(dao)} disabled={joiningDao === dao.address}>
                        {joiningDao === dao.address ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          "Join DAO"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Join DAO Dialog */}
      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {joinStep === "confirm" && "Join DAO"}
              {joinStep === "signing" && "Signing Transaction"}
              {joinStep === "success" && "Successfully Joined"}
            </DialogTitle>
            <DialogDescription>
              {joinStep === "confirm" && "You're about to join this DAO. This will require signing a transaction."}
              {joinStep === "signing" && "Please confirm the transaction in your wallet..."}
              {joinStep === "success" && "You are now a member of this DAO!"}
            </DialogDescription>
          </DialogHeader>

          {selectedDao && (
            <div className="p-4 border rounded-md bg-muted/50">
              <h3 className="font-medium mb-2">{selectedDao.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Address:</p>
                  <p className="font-mono">{formatAddress(selectedDao.address)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Creator:</p>
                  <p className="font-mono">{formatAddress(selectedDao.creator)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Balance:</p>
                  <p>{ethers.formatEther(selectedDao.balance)} XDC</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Proposals:</p>
                  <p>{selectedDao.proposalCount}</p>
                </div>
              </div>
            </div>
          )}

          {joinStep === "success" && (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-center">
                You have successfully joined the DAO. You can now participate in governance by voting on proposals.
              </p>
            </div>
          )}

          <DialogFooter className="flex sm:justify-between">
            {joinStep === "confirm" && (
              <>
                <Button variant="outline" onClick={closeJoinDialog}>
                  Cancel
                </Button>
                <Button onClick={handleJoinDao}>Join DAO</Button>
              </>
            )}
            {joinStep === "signing" && (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Waiting for confirmation...
              </Button>
            )}
            {joinStep === "success" && (
              <>
                <Button variant="outline" onClick={closeJoinDialog}>
                  Close
                </Button>
                <Button asChild>
                  <Link href={`/dao/${selectedDao?.address}`} onClick={closeJoinDialog}>
                    View DAO
                  </Link>
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
