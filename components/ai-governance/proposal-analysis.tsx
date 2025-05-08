"use client"

import { useState, useEffect } from "react"
import { useAgent } from "./agent-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertTriangle, CheckCircle, HelpCircle, Brain, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

type ProposalAnalysisProps = {
  proposalId: string
  description: string
}

export function ProposalAnalysis({ proposalId, description }: ProposalAnalysisProps) {
  const { isAgentEnabled, isAgentProcessing, isUsingFallback, agentError, analyzeProposal, retryConnection } =
    useAgent()

  const [analysis, setAnalysis] = useState<{
    summary: string
    riskLevel: "low" | "medium" | "high"
    potentialImpact: string
    recommendation: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  // Auto-analyze when component mounts if URL parameter is present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("autoAnalyze") === "true" && isAgentEnabled && !analysis && !loading) {
      handleAnalyze()
    }
  }, [isAgentEnabled])

  // Simulate progress during analysis
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (loading) {
      setAnalysisProgress(0)
      interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + Math.random() * 15
        })
      }, 500)
    } else if (analysis) {
      setAnalysisProgress(100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [loading, analysis])

  const handleAnalyze = async () => {
    if (!isAgentEnabled) return

    try {
      setLoading(true)
      setError(null)
      const result = await analyzeProposal(proposalId, description)
      setAnalysis(result)
    } catch (err: any) {
      setError(err.message || "Failed to analyze proposal")
    } finally {
      setLoading(false)
    }
  }

  if (!isAgentEnabled) {
    return null
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              AI Proposal Analysis
            </CardTitle>
            <CardDescription>Get an AI-powered analysis of this proposal to help inform your vote</CardDescription>
          </div>
          {isUsingFallback && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
              Local Analysis
            </Badge>
          )}
          {!isUsingFallback && !agentError && (
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              Gemini AI Analysis
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {agentError && (
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Notice</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>{agentError}</p>
              <p>Using local analysis capabilities instead. For full features, try reconnecting.</p>
              <Button onClick={retryConnection} variant="outline" size="sm" className="w-fit">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Connection
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!analysis && !loading && (
          <div className="flex flex-col items-center justify-center py-6">
            <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-4">
              Use AI to analyze this proposal and get insights to help inform your vote
            </p>
            <Button onClick={handleAnalyze} disabled={isAgentProcessing || loading}>
              {isAgentProcessing || loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Proposal"
              )}
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-center mb-4">Analyzing proposal content and potential impacts...</p>
            <div className="w-full max-w-md">
              <Progress value={analysisProgress} className="h-2" />
              <p className="text-xs text-center mt-2 text-muted-foreground">
                {isUsingFallback ? "Using local analysis" : "Processing with Gemini AI"}
              </p>
            </div>
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Summary</h3>
              <p className="text-sm text-muted-foreground">{analysis.summary}</p>
            </div>

            <div>
              <h3 className="font-medium mb-1">Risk Assessment</h3>
              <div className="flex items-center">
                <Badge
                  variant={
                    analysis.riskLevel === "high"
                      ? "destructive"
                      : analysis.riskLevel === "medium"
                        ? "outline"
                        : "default"
                  }
                >
                  {analysis.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-1">Potential Impact</h3>
              <p className="text-sm text-muted-foreground">{analysis.potentialImpact}</p>
            </div>

            <div>
              <h3 className="font-medium mb-1">Recommendation</h3>
              <p className="text-sm text-muted-foreground">{analysis.recommendation}</p>
            </div>

            <div className="pt-2">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>AI-Generated Analysis</AlertTitle>
                <AlertDescription>
                  {isUsingFallback
                    ? "This analysis is generated using local analysis capabilities and should be used as a general guide only."
                    : "This analysis is generated by Gemini AI and should be used as a supplementary tool for your decision-making process."}
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
