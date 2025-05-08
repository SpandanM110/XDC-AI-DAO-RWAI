"use client"

import type React from "react"

import { useState } from "react"
import { useWeb3 } from "@/hooks/use-web3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { ethers } from "ethers"
import { toast } from "@/components/ui/use-toast"

export function FundDao() {
  const { contract, isConnected, daoAddress } = useWeb3()
  const [amount, setAmount] = useState("")
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
      console.log("Funding DAO:", daoAddress)
      console.log("Amount:", amount, "XDC")

      // Convert amount to wei
      const amountInWei = ethers.parseEther(amount)
      console.log("Amount in Wei:", amountInWei.toString())

      // Call the contract method to fund the DAO
      const tx = await contract.fundDAO(daoAddress, {
        value: amountInWei,
      })
      console.log("Transaction sent:", tx.hash)

      toast({
        title: "Transaction Sent",
        description: "Funding your DAO. Please wait for confirmation...",
      })

      // Wait for transaction confirmation
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt)

      toast({
        title: "DAO Funded",
        description: `Successfully sent ${amount} XDC to the DAO treasury`,
      })

      // Reset form
      setAmount("")
    } catch (error: any) {
      console.error("Error funding DAO:", error)
      toast({
        title: "Error Funding DAO",
        description: error.message || "Failed to fund DAO",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="fund-dao">
      <h2 className="text-2xl font-bold mb-4">Fund DAO</h2>
      <Card>
        <CardHeader>
          <CardTitle>Send XDC to Treasury</CardTitle>
        </CardHeader>
        <CardContent>
          {!daoAddress && isConnected ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No DAO found. You need to create one first.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (XDC)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={loading || !isConnected || !daoAddress}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
