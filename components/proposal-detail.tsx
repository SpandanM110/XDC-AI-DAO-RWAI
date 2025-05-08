"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/hooks/use-web3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, Loader2, AlertCircle, Calendar, Users } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProposalAnalysis } from "./ai-governance/proposal-analysis"
import { VoteSuggestion } from "./ai-governance/vote-suggestion"
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

export function ProposalDetail({ proposalId }: { proposalId: string }) {
  const { contract, isConnected, daoAddress, account } = useWeb3()
  const { isAgentEnabled } = useAgent()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [votingLoading, setVotingLoading] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    async function fetchProposal() {
      if (contract && isConnected && daoAddress && account) {
        try {
          setLoading(true)
          setError(null)
          console.log("Fetching proposal:", proposalId)

          // Get proposal details
          try {
            const details = await contract.getProposalDetails(daoAddress, proposalId)
            console.log(`Proposal details:`, details)

            // Check if the current user has voted on this proposal
            const hasVoted = await contract.hasVoted(daoAddress, proposalId, account)
            console.log(`User has voted on proposal:`, hasVoted)

            setProposal({
              id: Number(proposalId),
              description: details[0],
              deadline: Number(details[1]),
              yesVotes: Number(details[2]),
              noVotes: Number(details[3]),
              executed: details[4],
              hasVoted,
            })
          } catch (error) {
            console.error(`Error fetching proposal:`, error)
            setError(`Error fetching proposal. The contract might not support the new functions yet.`)

            // Simulate a proposal for demonstration
            setProposal({
              id: Number(proposalId),
              description: `Proposal ${proposalId}: Fund community development initiative with 5000 XDC to support local blockchain education programs and developer workshops. This initiative aims to increase adoption of XDC technology and grow the ecosystem through hands-on training and community engagement.`,
              deadline: Math.floor(Date.now() / 1000) + 86400,
              yesVotes: 15,
              noVotes: 5,
              executed: false,
              hasVoted: false,
            })
          }
        } catch (error) {
          console.error("Error fetching proposal:", error)
          setError("Failed to fetch proposal. Please check your connection and try again.")
          toast({
            title: "Error",
            description: "Failed to fetch proposal",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      } else if (isConnected) {
        setLoading(false)
      }
    }

    fetchProposal()

    // Check URL for tab parameter
    const params = new URLSearchParams(window.location.search)
    const tabParam = params.get("tab")
    if (tabParam === "analysis" || tabParam === "suggestion") {
      setActiveTab(tabParam)
    }
  }, [contract, isConnected, daoAddress, account, proposalId])

  const handleVote = async (support: boolean) => {
    if (!contract || !isConnected || !daoAddress || !proposalId) return

    const loadingKey = support ? "yes" : "no"
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
      setProposal((prev) => {
        if (!prev) return null
        return {
          ...prev,
          yesVotes: support ? prev.yesVotes + 1 : prev.yesVotes,
          noVotes: !support ? prev.noVotes + 1 : prev.noVotes,
          hasVoted: true,
        }
      })

      toast({
        title: "Vote Submitted",
        description: `You voted ${support ? "Yes" : "No"} on Proposal ${proposalId}`,
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex justify-between mt-6">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && !proposal) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!proposal) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Proposal Not Found</AlertTitle>
        <AlertDescription>The requested proposal could not be found.</AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{proposal.description}</CardTitle>
            <Badge variant={proposal.executed ? "secondary" : "default"}>
              {proposal.executed ? "Executed" : "Active"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Voting Deadline</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(proposal.deadline * 1000).toLocaleString()} ({getTimeLeft(proposal.deadline)})
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Votes</p>
                <p className="text-sm text-muted-foreground">
                  Yes: {proposal.yesVotes} | No: {proposal.noVotes} | Total: {proposal.yesVotes + proposal.noVotes}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-center">
            <div className="flex space-x-2">
              <Button
                variant="default"
                onClick={() => handleVote(true)}
                disabled={
                  proposal.executed ||
                  votingLoading["yes"] ||
                  votingLoading["no"] ||
                  proposal.hasVoted ||
                  getTimeLeft(proposal.deadline) === "Voting ended"
                }
              >
                {votingLoading["yes"] ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ThumbsUp className="mr-2 h-4 w-4" />
                )}
                Vote Yes
              </Button>
              <Button
                variant="outline"
                onClick={() => handleVote(false)}
                disabled={
                  proposal.executed ||
                  votingLoading["yes"] ||
                  votingLoading["no"] ||
                  proposal.hasVoted ||
                  getTimeLeft(proposal.deadline) === "Voting ended"
                }
              >
                {votingLoading["no"] ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ThumbsDown className="mr-2 h-4 w-4" />
                )}
                Vote No
              </Button>
            </div>
            {proposal.hasVoted && (
              <Badge variant="outline" className="ml-2">
                You have voted on this proposal
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {isAgentEnabled && (
        <Tabs defaultValue="analysis" className="mt-6" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="suggestion">Vote Suggestion</TabsTrigger>
          </TabsList>
          <TabsContent value="analysis">
            <ProposalAnalysis proposalId={proposalId} description={proposal.description} />
          </TabsContent>
          <TabsContent value="suggestion">
            <VoteSuggestion proposalId={proposalId} description={proposal.description} />
          </TabsContent>
        </Tabs>
      )}
    </>
  )
}
