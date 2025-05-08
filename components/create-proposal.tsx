"use client"

import type React from "react"

import { useState } from "react"
import { useWeb3 } from "@/hooks/use-web3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function CreateProposal() {
  const { contract, isConnected, daoAddress } = useWeb3()
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("86400") // Default 1 day in seconds
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contract || !isConnected || !daoAddress) {
      toast({
        title: "Error",
        description: "Contract not connected or no DAO found",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      console.log("Creating proposal for DAO:", daoAddress)
      console.log("Description:", description)
      console.log("Duration:", duration)

      // Call the contract method to create a proposal
      const tx = await contract.createProposal(daoAddress, description, duration)
      console.log("Transaction sent:", tx.hash)

      toast({
        title: "Transaction Sent",
        description: "Creating your proposal. Please wait for confirmation...",
      })

      // Wait for transaction confirmation
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt)

      toast({
        title: "Proposal Created",
        description: "Your proposal has been successfully created",
      })

      // Reset form
      setDescription("")
      setDuration("86400")
    } catch (error: any) {
      console.error("Error creating proposal:", error)
      toast({
        title: "Error Creating Proposal",
        description: error.message || "Failed to create proposal",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="create-proposal">
      <h2 className="text-2xl font-bold mb-4">Create Proposal</h2>
      <Card>
        <CardHeader>
          <CardTitle>Submit a New Proposal</CardTitle>
        </CardHeader>
        <CardContent>
          {!daoAddress && isConnected ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No DAO found. You need to create one first.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Proposal Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your proposal..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Voting Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="3600"
                  placeholder="86400"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 1 hour (3600 seconds). Default is 1 day (86400 seconds).
                </p>
              </div>
              <Button type="submit" disabled={loading || !isConnected || !daoAddress}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Proposal"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
