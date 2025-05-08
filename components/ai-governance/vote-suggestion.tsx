"use client"

import { useState, useEffect } from "react"
import { useAgent } from "./agent-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, ThumbsUp, ThumbsDown, HelpCircle, Brain, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

type VoteSuggestionProps = {
  proposalId: string
  description: string
}

export function VoteSuggestion({ proposalId, description }: VoteSuggestionProps) {
  const { isAgentEnabled, isAgentProcessing, isUsingFallback, agentError, suggestVote, retryConnection } = useAgent()

  const [suggestion, setSuggestion] = useState<{
    recommendation: "yes" | "no" | "abstain"
    confidence: number
    reasoning: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestionProgress, setSuggestionProgress] = useState(0)

  // Auto-suggest when component mounts if URL parameter is present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("autoSuggest") === "true" && isAgentEnabled && !suggestion && !loading) {
      handleGetSuggestion()
    }
  }, [isAgentEnabled])

  // Simulate progress during suggestion generation
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (loading) {
      setSuggestionProgress(0)
      interval = setInterval(() => {
        setSuggestionProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + Math.random() * 15
        })
      }, 500)
    } else if (suggestion) {
      setSuggestionProgress(100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [loading, suggestion])

  const handleGetSuggestion = async () => {
    if (!isAgentEnabled) return

    try {
      setLoading(true)
      setError(null)
      const result = await suggestVote(proposalId, description)
      setSuggestion(result)
    } catch (err: any) {
      setError(err.message || "Failed to get vote suggestion")
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
              AI Vote Suggestion
            </CardTitle>
            <CardDescription>Get an AI-powered voting recommendation based on proposal analysis</CardDescription>
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
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!suggestion && !loading && (
          <div className="flex flex-col items-center justify-center py-6">
            <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-4">
              Get an AI-suggested vote based on proposal analysis and governance patterns
            </p>
            <Button onClick={handleGetSuggestion} disabled={isAgentProcessing || loading}>
              {isAgentProcessing || loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Get Vote Suggestion"
              )}
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-center mb-4">Analyzing proposal and generating vote suggestion...</p>
            <div className="w-full max-w-md">
              <Progress value={suggestionProgress} className="h-2" />
              <p className="text-xs text-center mt-2 text-muted-foreground">
                {isUsingFallback ? "Using local analysis" : "Processing with Gemini AI"}
              </p>
            </div>
          </div>
        )}

        {suggestion && !loading && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="rounded-full bg-muted p-3 mb-4">
                {suggestion.recommendation === "yes" ? (
                  <ThumbsUp className="h-8 w-8 text-green-600" />
                ) : suggestion.recommendation === "no" ? (
                  <ThumbsDown className="h-8 w-8 text-red-600" />
                ) : (
                  <HelpCircle className="h-8 w-8 text-amber-600" />
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">Recommended Vote: {suggestion.recommendation.toUpperCase()}</h3>
              <div className="w-full max-w-md mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Confidence</span>
                  <span>{Math.round(suggestion.confidence * 100)}%</span>
                </div>
                <Progress value={suggestion.confidence * 100} className="h-2" />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-1">Reasoning</h3>
              <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
            </div>

            <div className="pt-2">
              <Alert>
                <AlertTitle>AI-Generated Suggestion</AlertTitle>
                <AlertDescription>
                  {isUsingFallback
                    ? "This vote suggestion is generated using local analysis capabilities and should be used as a general guide only."
                    : "This vote suggestion is generated by Gemini AI and should be used as a supplementary tool for your decision-making process."}
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
