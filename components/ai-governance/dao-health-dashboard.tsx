"use client"

import { useState, useEffect } from "react"
import { useAgent } from "./agent-provider"
import { useWeb3 } from "@/hooks/use-web3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, Brain } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export function DAOHealthDashboard() {
  const { isAgentEnabled, isAgentProcessing, summarizeDAO, suggestDAOImprovements } = useAgent()
  const { daoAddress, contract } = useWeb3()

  const [daoInfo, setDaoInfo] = useState<any>(null)
  const [daoSummary, setDaoSummary] = useState<any>(null)
  const [improvements, setImprovements] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (daoAddress && contract && isAgentEnabled) {
      fetchDAOInfo()
    }
  }, [daoAddress, contract, isAgentEnabled])

  const fetchDAOInfo = async () => {
    if (!daoAddress || !contract) return

    try {
      setLoading(true)
      setError(null)

      // Fetch DAO information from the contract
      const summary = await contract.getDaoSummary(daoAddress)

      // Format the data
      const daoData = {
        name: summary[0] || "Unnamed DAO",
        description: summary[1] || "No description",
        treasuryBalance: Number(summary[2]) || 0,
        memberCount: Number(summary[3]) || 0,
        proposalCount: Number(summary[4]) || 0,
        createdAt: Number(summary[5]) || 0,
      }

      setDaoInfo(daoData)

      // Get AI analysis
      if (isAgentEnabled) {
        const summary = await summarizeDAO(daoAddress, daoData)
        setDaoSummary(summary)

        const suggestedImprovements = await suggestDAOImprovements(daoAddress, daoData)
        setImprovements(suggestedImprovements)
      }
    } catch (error: any) {
      console.error("Error fetching DAO info:", error)
      setError(error.message || "Failed to fetch DAO information")
    } finally {
      setLoading(false)
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "fair":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "concerning":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  if (!isAgentEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>DAO Health Dashboard</CardTitle>
          <CardDescription>Enable AI Assistant to use this feature</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>AI Assistant Required</AlertTitle>
            <AlertDescription>
              Please enable the AI Assistant from the top navigation bar to use the DAO health dashboard.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!daoAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>DAO Health Dashboard</CardTitle>
          <CardDescription>No DAO selected</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>No DAO Selected</AlertTitle>
            <AlertDescription>Please select or create a DAO to view its health dashboard.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              DAO Health Dashboard
            </CardTitle>
            <CardDescription>AI-powered insights about your DAO's health and performance</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchDAOInfo} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-center mb-4">Analyzing DAO health and performance...</p>
          </div>
        ) : daoSummary ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Overview</h3>
              <p className="text-sm text-muted-foreground">{daoSummary.overview}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Health Status</h3>
                <Badge className={getHealthColor(daoSummary.health)}>{daoSummary.health.toUpperCase()}</Badge>
              </div>
              <Progress
                value={
                  daoSummary.health === "excellent"
                    ? 100
                    : daoSummary.health === "good"
                      ? 75
                      : daoSummary.health === "fair"
                        ? 50
                        : daoSummary.health === "concerning"
                          ? 25
                          : 0
                }
                className="h-2"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Key Metrics</h3>
              <ul className="space-y-1">
                {daoSummary.keyMetrics.map((metric: string, index: number) => (
                  <li key={index} className="text-sm flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                    {metric}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">{daoSummary.recentActivity}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Suggested Improvements</h3>
              <ul className="space-y-1">
                {improvements.map((improvement, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <TrendingUp className="h-4 w-4 mr-2 text-blue-600 mt-0.5" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No DAO analysis available. Click Refresh to analyze your DAO.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
