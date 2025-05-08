"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Wallet, ArrowRight, Vote, ThumbsUp, ThumbsDown, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { ethers } from "ethers"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"
import { useWeb3 } from "@/hooks/use-web3"

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

type ProposalInfo = {
  id: number
  description: string
  yesVotes: number
  noVotes: number
  deadline: number
  executed: boolean
}

export function DaoCard({ dao }: { dao: DaoInfo }) {
  const { contract } = useWeb3()
  const [expanded, setExpanded] = useState(false)
  const [activeProposals, setActiveProposals] = useState<ProposalInfo[]>([])
  const [loadingProposals, setLoadingProposals] = useState(false)

  // Function to load active proposals when expanding the card
  const handleExpand = () => {
    if (!expanded && !activeProposals.length && dao.proposalCount > 0) {
      loadActiveProposals()
    }
    setExpanded(!expanded)
  }

  // Load active proposals from the contract
  const loadActiveProposals = async () => {
    if (!contract) return

    setLoadingProposals(true)

    try {
      const proposals: ProposalInfo[] = []
      const now = Math.floor(Date.now() / 1000)

      // Fetch the most recent proposals first (up to 5)
      const startIdx = Math.max(0, dao.proposalCount - 5)
      const endIdx = dao.proposalCount

      for (let i = startIdx; i < endIdx; i++) {
        try {
          const proposalId = i
          const proposal = await contract.getProposal(dao.address, proposalId)

          // Check if proposal is active (not executed and deadline not passed)
          if (!proposal.executed && Number(proposal.deadline) > now) {
            proposals.push({
              id: proposalId,
              description: proposal.description,
              yesVotes: Number(proposal.yesVotes),
              noVotes: Number(proposal.noVotes),
              deadline: Number(proposal.deadline),
              executed: proposal.executed,
            })
          }
        } catch (error) {
          console.error(`Error fetching proposal ${i} for DAO ${dao.address}:`, error)
        }
      }

      setActiveProposals(proposals)
    } catch (error) {
      console.error("Error loading active proposals:", error)
    } finally {
      setLoadingProposals(false)
    }
  }

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Get time left for a proposal
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

  // Get category label
  const getCategoryLabel = (value?: string): string => {
    if (!value) return "Other"

    const categories = {
      defi: "DeFi",
      social: "Social Impact",
      dev: "Development",
      community: "Community",
      other: "Other",
    }
    return categories[value as keyof typeof categories] || "Other"
  }

  // Count active proposals
  const activeProposalCount = activeProposals.length

  return (
    <Collapsible
      open={expanded}
      onOpenChange={handleExpand}
      className="border rounded-lg overflow-hidden transition-all duration-200"
    >
      <Card className="border-0 shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-lg">{dao.name}</h3>
                <div className="flex gap-1">
                  {!dao.active && (
                    <Badge variant="destructive" className="text-xs">
                      Inactive
                    </Badge>
                  )}
                  {dao.category && (
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryLabel(dao.category)}
                    </Badge>
                  )}
                  {dao.isCreator && (
                    <Badge variant="outline" className="text-xs">
                      Creator
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Address: <span className="font-mono">{formatAddress(dao.address)}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-4">
              <div className="flex items-center gap-1 text-sm">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span>{ethers.formatEther(dao.balance)} XDC</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{dao.proposalCount} Proposals</span>
              </div>
              {expanded && !loadingProposals ? (
                <div className="flex items-center gap-1 text-sm">
                  <Vote className="h-4 w-4 text-muted-foreground" />
                  <span>{activeProposalCount} Active</span>
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>

        <CollapsibleTrigger asChild>
          <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-dashed border-border/50 mt-4">
            <Button variant="ghost" size="sm" className="gap-1">
              {expanded ? "Hide Details" : "Show Details"}
              <ArrowRight className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
            </Button>

            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/dao/${dao.address}`}>View DAO</Link>
              </Button>

              {dao.active && (
                <Button asChild size="sm">
                  <Link href={`/dao/${dao.address}/proposals`}>View Proposals</Link>
                </Button>
              )}
            </div>
          </CardFooter>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 pt-0 border-t">
            <div className="space-y-4">
              <h4 className="font-medium">Active Proposals</h4>

              {loadingProposals ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading proposals...</p>
                  </div>
                </div>
              ) : activeProposals.length > 0 ? (
                <div className="space-y-3">
                  {activeProposals.map((proposal) => (
                    <div key={proposal.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-sm">{proposal.description}</h5>
                        <span className="text-xs text-muted-foreground">{getTimeLeft(proposal.deadline)}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-full"
                            style={{
                              width: `${
                                proposal.yesVotes + proposal.noVotes > 0
                                  ? (proposal.yesVotes / (proposal.yesVotes + proposal.noVotes)) * 100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>

                        <div className="flex justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{proposal.yesVotes} Yes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsDown className="h-3 w-3" />
                            <span>{proposal.noVotes} No</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/dao/${dao.address}/proposals/${proposal.id}`}>Vote Now</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 border rounded-md bg-muted/30">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      {dao.proposalCount > 0 ? "No active proposals found" : "This DAO has no proposals yet"}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-2">
                {dao.isCreator && dao.active && (
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dao/${dao.address}/transfer`}>Transfer Funds</Link>
                  </Button>
                )}

                {dao.active && (
                  <Button asChild size="sm">
                    <Link href={`/create-proposal?dao=${dao.address}`}>Create Proposal</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
