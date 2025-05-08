"use client"

import { useState } from "react"
import { useAgent } from "./agent-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Brain, Sparkles, Copy } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"

export function ProposalGenerator() {
  const { isAgentEnabled, isAgentProcessing, generateProposalDraft } = useAgent()
  const [topic, setTopic] = useState("")
  const [context, setContext] = useState("")
  const [generatedProposal, setGeneratedProposal] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a proposal topic",
        variant: "destructive",
      })
      return
    }

    
  }

  if (!isAgentEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Proposal Generator</CardTitle>
          <CardDescription>Enable AI Assistant to use this feature</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>AI Assistant Required</AlertTitle>
            <AlertDescription>
              Please enable the AI Assistant from the top navigation bar to use the proposal generator.
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
          AI Proposal Generator
        </CardTitle>
        <CardDescription>
          Let AI help you draft a well-structured proposal based on your topic and context
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Proposal Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Community Development Fund"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Additional Context (Optional)</Label>
            <Textarea
              id="context"
              placeholder="Provide any additional details or requirements for your proposal..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || isAgentProcessing || !topic.trim()}
            className="w-full"
          >
            {isGenerating || isAgentProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Proposal
              </>
            )}
          </Button>

          {generatedProposal && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <Label>Generated Proposal</Label>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>
              <div className="rounded-md border bg-muted/50 p-4">
                <pre className="whitespace-pre-wrap text-sm">{generatedProposal}</pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
