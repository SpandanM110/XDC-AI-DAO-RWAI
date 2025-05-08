"use client"

import type React from "react"

import { useState } from "react"
import { useWeb3 } from "@/hooks/use-web3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useAgent } from "./ai-governance/agent-provider"

export function CreateDao() {
  const router = useRouter()
  const { contract, isConnected, account } = useWeb3()
  const { isAgentEnabled, generateDAODescription } = useAgent()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [purpose, setPurpose] = useState("")
  const [goals, setGoals] = useState("")
  const [loading, setLoading] = useState(false)
  const [generatingDescription, setGeneratingDescription] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contract || !isConnected || !account) {
      toast({
        title: "Error",
        description: "Wallet not connected",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      console.log("Creating DAO with name:", name)
      console.log("Description:", description)

      // Call the contract method to create a DAO
      const tx = await contract.createDao(name, description)
      console.log("Transaction sent:", tx.hash)

      toast({
        title: "Transaction Sent",
        description: "Creating your DAO. Please wait for confirmation...",
      })

      // Wait for transaction confirmation
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt)

      // Get the DAO address from the event logs
      const daoCreatedEvent = receipt.logs
        .map((log: any) => {
          try {
            return contract.interface.parseLog(log)
          } catch (e) {
            return null
          }
        })
        .find((event: any) => event && event.name === "DaoCreated")

      const daoAddress = daoCreatedEvent ? daoCreatedEvent.args.daoAddress : null
      console.log("New DAO address:", daoAddress)

      toast({
        title: "DAO Created",
        description: "Your DAO has been successfully created",
      })

      // Reset form
      setName("")
      setDescription("")
      setPurpose("")
      setGoals("")

      // Redirect to the DAO page
      if (daoAddress) {
        router.push(`/dao/${daoAddress}`)
      } else {
        router.push("/my-daos")
      }
    } catch (error: any) {
      console.error("Error creating DAO:", error)
      toast({
        title: "Error Creating DAO",
        description: error.message || "Failed to create DAO",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateDescription = async () => {
    if (!purpose || !goals) {
      toast({
        title: "Missing Information",
        description: "Please enter the DAO purpose and goals to generate a description",
        variant: "destructive",
      })
      return
    }

    try {
      setGeneratingDescription(true)
      const goalsList = goals.split("\n").filter((g) => g.trim().length > 0)
      const generatedDescription = await generateDAODescription(purpose, goalsList)
      setDescription(generatedDescription)

      toast({
        title: "Description Generated",
        description: "AI has created a description based on your purpose and goals",
      })
    } catch (error: any) {
      console.error("Error generating description:", error)
      toast({
        title: "Error Generating Description",
        description: error.message || "Failed to generate description",
        variant: "destructive",
      })
    } finally {
      setGeneratingDescription(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New DAO</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">DAO Name</Label>
            <Input
              id="name"
              placeholder="Enter DAO name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {isAgentEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="purpose">DAO Purpose</Label>
                <Input
                  id="purpose"
                  placeholder="e.g., Community development, Protocol governance"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">DAO Goals (one per line)</Label>
                <Textarea
                  id="goals"
                  placeholder="e.g., Fund community projects&#10;Improve protocol security&#10;Increase adoption"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateDescription}
                disabled={generatingDescription || !purpose || !goals}
                className="w-full"
              >
                {generatingDescription ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Description with AI
                  </>
                )}
              </Button>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">DAO Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the purpose and goals of your DAO"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
            />
          </div>

          <Button type="submit" disabled={loading || !isConnected} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create DAO"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
