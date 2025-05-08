"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/hooks/use-web3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, Loader2, PlusCircle, AlertCircle, Brain } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAgent } from "./ai-governance/agent-provider"

type Proposal = {
  id: number
  description: string
  deadline: number
  yesVotes: number
  noVotes: number
  executed: boolean
  hasVoted?: boolean
}

export function ProposalList() {
  const { contract, isConnected, daoAddress, account } = useWeb3()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [votingLoading, setVotingLoading] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const { isAgentEnabled } = useAgent()

  useEffect(() => {
    async function fetchProposals() {
      if (contract && isConnected && daoAddress && account) {
        try {
          setLoading(true)
          setError(null)
          console.log("Fetching proposals for DAO:", daoAddress)

          // Get the DAO summary to know how many proposals exist
          const summary = await contract.getDaoSummary(daoAddress)
          const proposalCount = Number(summary[4])
          console.log("Proposal count:", proposalCount)

          if (proposalCount > 0) {
            try {
              const fetchedProposals: Proposal[] = []

              // Fetch each proposal using the new getProposalDetails function
              for (let i = 0; i < proposalCount; i++) {
                try {
                  // Get proposal details
                  const details = await contract.getProposalDetails(daoAddress, i)
                  console.log(`Proposal ${i} details:`, details)

                  // Check if the current user has voted on this proposal
                  const hasVoted = await contract.hasVoted(daoAddress, i, account)
                  console.log(`User has voted on proposal ${i}:`, hasVoted)

                  fetchedProposals.push({
                    id: i,
                    description: details[0],
                    deadline: Number(details[1]),
                    yesVotes: Number(details[2]),
                    noVotes: Number(details[3]),
                    executed: details[4],
                    hasVoted,
                  })
                } catch (error) {
                  console.error(`Error fetching proposal ${i}:`, error)
                  setError(`Error fetching proposal ${i}. The contract might not support the new functions yet.`)
                }
              }

              if (fetchedProposals.length > 0) {
                setProposals(fetchedProposals)
              } else {
                // If we couldn't fetch any proposals, use simulated data
                simulateProposals(proposalCount)
              }
            } catch (error) {
              console.error("Error fetching proposal details:", error)
              setError("Failed to fetch proposal details. The contract might not support the new functions yet.")

              // Fallback to simulated data
              simulateProposals(proposalCount)
            }
          } else {
            setProposals([])
          }
        } catch (error) {
          console.error("Error fetching proposals:", error)
          setError("Failed to fetch proposals. Please check your connection and try again.")
          toast({
            title: "Error",
            description: "Failed to fetch proposals",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      } else if (!daoAddress && isConnected) {
        setLoading(false)
        setProposals([])
      }
    }

    // Helper function to create simulated proposals
    function simulateProposals(count: number) {
      const simulatedProposals: Proposal[] = []
      for (let i = 0; i < count; i++) {
        simulatedProposals.push({
          id: i,
          description: `Proposal ${i + 1}: Community Development Fund`,
          deadline: Math.floor(Date.now() / 1000) + 86400 * (i + 1),
          yesVotes: 10 + i * 3,
          noVotes: 5 + i,
          executed: i === 0,
          hasVoted: false,
        })
      }
      setProposals(simulatedProposals)
      setError(
        "Using simulated proposal data. To see real data, deploy the updated contract with getProposalDetails function.",
      )
    }

    fetchProposals()
  }, [contract, isConnected, daoAddress, account])

  const handleVote = async (proposalId: number, support: boolean) => {
    if (!contract || !isConnected || !daoAddress) return

    const loadingKey = `${proposalId}-${support ? "yes" : "no"}`
    try {
      setVotingLoading((prev) => ({ ...prev, [loadingKey]: true }))
      console.log("Voting on proposal:", proposalId, "Support:", support)

      // Call the contract method to vote
      const tx = await contract.voteOnProposal(daoAddress, proposalId, support)
      console.log("Transaction sent:", tx.hash)

      toast({
        title: "Transaction Sent",
        description: "Submitting your vote. Please wait for confirmation...",
      })

      // Wait for transaction confirmation
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt)

      // Update the UI
      setProposals((prev) =>
        prev.map((p) =>
          p.id === proposalId
            ? {
                ...p,
                yesVotes: support ? p.yesVotes + 1 : p.yesVotes,
                noVotes: !support ? p.noVotes + 1 : p.noVotes,
                hasVoted: true,
              }
            : p,
        ),
      )

      toast({
        title: "Vote Submitted",
        description: `You voted ${support ? "Yes" : "No"} on Proposal ${proposalId + 1}`,
      })
    } catch (error: any) {
      console.error("Error voting:", error)

      // Extract a more user-friendly error message
      let errorMessage = "Failed to submit vote"

      if (error.message) {
        if (error.message.includes("already voted")) {
          errorMessage = "You have already voted on this proposal"
        } else if (error.message.includes("voting period") || error.message.includes("Voting closed")) {
          errorMessage = "The voting period for this proposal has ended"
        } else if (error.message.includes("executed")) {
          errorMessage = "This proposal has already been executed"
        } else if (error.message.includes("gas")) {
          errorMessage = "Transaction failed: Not enough gas or gas price too low"
        } else if (error.message.includes("rejected")) {
          errorMessage = "Transaction rejected by user"
        }
      }

      toast({
        title: "Error Voting",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setVotingLoading((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  const getTimeLeft = (deadline: number) => {
    const now = Math.floor(Date.now() / 1000)
    const secondsLeft = deadline - now

    if (secondsLeft <= 0) return "Voting ended"

    const days = Math.floor(secondsLeft / 86400)
    const hours = Math.floor((secondsLeft % 86400) / 3600)
    const minutes = Math.floor((secondsLeft % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active and Past Proposals</CardTitle>
        <Button asChild size="sm">
          <Link href="/create-proposal">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Proposal
          </Link>
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
                  <div className="flex space-x-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : !daoAddress ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-4">No DAO found. You need to create one first.</p>
            <Button asChild>
              <Link href="/create-dao">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create a DAO
              </Link>
            </Button>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-4">No proposals found. Create a proposal to get started.</p>
            <Button asChild>
              <Link href="/create-proposal">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Proposal
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{proposal.description}</h3>
                  <Badge variant={proposal.executed ? "secondary" : "default"}>
                    {proposal.executed ? "Executed" : "Active"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mb-3">
                  <span>
                    Yes: {proposal.yesVotes} | No: {proposal.noVotes}
                  </span>
                  <span>{getTimeLeft(proposal.deadline)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVote(proposal.id, true)}
                      disabled={
                        proposal.executed ||
                        votingLoading[`${proposal.id}-yes`] ||
                        votingLoading[`${proposal.id}-no`] ||
                        proposal.hasVoted ||
                        getTimeLeft(proposal.deadline) === "Voting ended"
                      }
                    >
                      {votingLoading[`${proposal.id}-yes`] ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ThumbsUp className="h-4 w-4 mr-2" />
                      )}
                      Vote Yes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVote(proposal.id, false)}
                      disabled={
                        proposal.executed ||
                        votingLoading[`${proposal.id}-yes`] ||
                        votingLoading[`${proposal.id}-no`] ||
                        proposal.hasVoted ||
                        getTimeLeft(proposal.deadline) === "Voting ended"
                      }
                    >
                      {votingLoading[`${proposal.id}-no`] ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ThumbsDown className="h-4 w-4 mr-2" />
                      )}
                      Vote No
                    </Button>
                  </div>
                  {proposal.hasVoted && (
                    <Badge variant="outline" className="ml-2">
                      You voted
                    </Badge>
                  )}
                  {proposal.executed ? null : (
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/execute-proposal?id=${proposal.id}`}>View Details</Link>
                    </Button>
                  )}
                </div>
                {isAgentEnabled && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center mb-2">
                      <Brain className="h-4 w-4 mr-1 text-primary" />
                      <span className="text-sm font-medium">AI Governance</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Navigate to proposal details with AI analysis tab active
                          window.location.href = `/proposals/${proposal.id}?tab=analysis`
                        }}
                      >
                        View AI Analysis
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
