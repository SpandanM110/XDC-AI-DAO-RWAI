"use client"
import { useAgent } from "./agent-provider"
import { Brain, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function AgentControl() {
  const { isAgentEnabled, isAgentProcessing, enableAgent, disableAgent } = useAgent()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            <Switch
              id="ai-agent"
              checked={isAgentEnabled}
              onCheckedChange={(checked) => {
                if (checked) {
                  enableAgent()
                } else {
                  disableAgent()
                }
              }}
              disabled={isAgentProcessing}
            />
            <Label htmlFor="ai-agent" className="cursor-pointer flex items-center">
              {isAgentProcessing ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Brain className="h-4 w-4 mr-1" />
              )}
              <span className="sr-only md:not-sr-only">AI Governance</span>
            </Label>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isAgentEnabled ? "Disable" : "Enable"} AI Governance Assistant</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
