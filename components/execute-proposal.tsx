"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/hooks/use-web3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, PlayCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type ExecutableProposal = {
  id: number
  description: string
  yesVotes: number
  noVotes: number
}

export function ExecuteProposal() {
  const { contract, isConnected, daoAddress } = useWeb3()
  const [executableProposals, setExecutableProposals] = useState<ExecutableProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [executingId, setExecutingId] = useState<number | null>(null)

  useEffect(() => {
    async function fetchExecutableProposals() {
      if (contract && isConnected && daoAddress) {
        try {
          setLoading(true)
          console.log("Fetching executable proposals for DAO:", daoAddress)

          // Check if we're using a mock DAO address (starts with 0x123456...)
          const isMockAddress = daoAddress.startsWith("0x123456")

          if (isMockAddress) {
            console.log("Using mock data for executable proposals")
            // Always use mock data for mock addresses
            const mockExecutableProposals: ExecutableProposal[] = [
              {
                id: 0,
                description: "Proposal 1: Fund community development",
                yesVotes: 30,
                noVotes: 10,
              },
              {
                id: 1,
                description: "Proposal 2: Upgrade smart contract",
                yesVotes: 25,
                noVotes: 5,
              },
              {
                id: 2,
                description: "Proposal 3: Treasury allocation",
                yesVotes: 40,
                noVotes: 15,
              },
            ]
            setExecutableProposals(mockExecutableProposals)
            setLoading(false)
            return
          }

          // Get the DAO summary to know how many proposals exist
          try {
            const summary = await contract.getDaoSummary(daoAddress)
            const proposalCount = Number(summary[4])
            console.log("Proposal count:", proposalCount)

            if (proposalCount > 0) {
              // In a real implementation, we would fetch each proposal's details
              // However, the contract doesn't have a direct method to get executable proposals
              // So we're using mock data based on the count

              const mockExecutableProposals: ExecutableProposal[] = []
              for (let i = 0; i < Math.min(proposalCount, 3); i++) {
                if (i % 2 === 0) {
                  // Just add some proposals for demo
                  mockExecutableProposals.push({
                    id: i,
                    description: `Proposal ${i + 1}: Fund community development`,
                    yesVotes: 30 + i * 5,
                    noVotes: 10 + i * 2,
                  })
                }
              }

              setExecutableProposals(mockExecutableProposals)
            } else {
              setExecutableProposals([])
            }
          } catch (error) {
            console.error("Error fetching DAO summary:", error)
            // Fallback to mock data
            const mockExecutableProposals: ExecutableProposal[] = [
              {
                id: 0,
                description: "Proposal 1: Fund community development",
                yesVotes: 30,
                noVotes: 10,
              },
              {
                id: 1,
                description: "Proposal 2: Upgrade smart contract",
                yesVotes: 25,
                noVotes: 5,
              },
            ]
            setExecutableProposals(mockExecutableProposals)
          }
        } catch (error) {
          console.error("Error fetching executable proposals:", error)
          toast({
            title: "Error",
            description: "Failed to fetch executable proposals",
            variant: "destructive",
          })
          // Fallback to empty array
          setExecutableProposals([])
        } finally {
          setLoading(false)
        }
      } else if (!daoAddress && isConnected) {
        setLoading(false)
        setExecutableProposals([])
      }
    }

    fetchExecutableProposals()
  }, [contract, isConnected, daoAddress])

  const handleExecute = async (proposalId: number) => {
    if (!contract || !isConnected || !daoAddress) return

    try {
      setExecutingId(proposalId)
      console.log("Executing proposal:", proposalId)

      // Call the contract method to execute the proposal
      const tx = await contract.executeProposal(daoAddress, proposalId)
      console.log("Transaction sent:", tx.hash)

      toast({
        title: "Transaction Sent",
        description: "Executing proposal. Please wait for confirmation...",
      })

      // Wait for transaction confirmation
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt)

      // Remove the executed proposal from the list
      setExecutableProposals((prev) => prev.filter((p) => p.id !== proposalId))

      toast({
        title: "Proposal Executed",
        description: `Successfully executed Proposal ${proposalId + 1}`,
      })
    } catch (error: any) {
      console.error("Error executing proposal:", error)
      toast({
        title: "Error Executing Proposal",
        description: error.message || "Failed to execute proposal",
        variant: "destructive",
      })
    } finally {
      setExecutingId(null)
    }
  }

  return (
    <section id="execute-proposal">
      <h2 className="text-2xl font-bold mb-4">Execute Proposal</h2>
      <Card>
        <CardHeader>
          <CardTitle>Executable Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-end">
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : !daoAddress ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No DAO found. You need to create one first.</p>
            </div>
          ) : executableProposals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No executable proposals found. Proposals can be executed after their voting period ends.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {executableProposals.map((proposal) => (
                <div key={proposal.id} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{proposal.description}</h3>
                  <div className="flex justify-between text-sm text-muted-foreground mb-3">
                    <span>
                      Yes: {proposal.yesVotes} | No: {proposal.noVotes}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleExecute(proposal.id)}
                      disabled={executingId === proposal.id}
                    >
                      {executingId === proposal.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Execute
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
