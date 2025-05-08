"use client"

import { useState } from "react"
import { useAgent } from "./agent-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Brain, Search, AlertTriangle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ethers } from "ethers"

export function TransactionExplainer() {
  const { isAgentEnabled, isAgentProcessing, explainTransaction } = useAgent()

  const [txHash, setTxHash] = useState("")
  const [explanation, setExplanation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExplain = async () => {
    if (!txHash.trim()) {
      setError("Please enter a transaction hash")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // In a real implementation, we would fetch transaction data from the blockchain
      // For now, we'll simulate it with some mock data
      const mockTxData = {
        from: "0x" + Math.random().toString(16).substring(2, 42),
        to: "0x" + Math.random().toString(16).substring(2, 42),
        value: ethers.parseEther("0.5").toString(),
        gasUsed: "21000",
        timestamp: Date.now(),
        status: "success",
        method: "transfer",
      }

      const result = await explainTransaction(txHash, mockTxData)
      setExplanation(result)
    } catch (error: any) {
      console.error("Error explaining transaction:", error)
      setError(error.message || "Failed to explain transaction")
    } finally {
      setLoading(false)
    }
  }

  if (!isAgentEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Explainer</CardTitle>
          <CardDescription>Enable AI Assistant to use this feature</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>AI Assistant Required</AlertTitle>
            <AlertDescription>
              Please enable the AI Assistant from the top navigation bar to use the transaction explainer.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          AI Transaction Explainer
        </CardTitle>
        <CardDescription>Get a simple explanation of any transaction on the XDC blockchain</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="txHash">Transaction Hash</Label>
            <div className="flex space-x-2">
              <Input id="txHash" placeholder="0x..." value={txHash} onChange={(e) => setTxHash(e.target.value)} />
              <Button onClick={handleExplain} disabled={loading || isAgentProcessing || !txHash.trim()}>
                {loading || isAgentProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-center">Analyzing transaction...</p>
            </div>
          )}

          {explanation && !loading && (
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Summary</h3>
                <p>{explanation.summary}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Impact</h3>
                <p>{explanation.impact}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Risk Assessment</h3>
                <Badge
                  variant={
                    explanation.riskAssessment.toLowerCase().includes("high")
                      ? "destructive"
                      : explanation.riskAssessment.toLowerCase().includes("medium")
                        ? "outline"
                        : "default"
                  }
                >
                  {explanation.riskAssessment}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Recommendation</h3>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{explanation.recommendation}</AlertDescription>
                </Alert>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
