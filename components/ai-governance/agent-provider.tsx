"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"
import { useWeb3 } from "@/hooks/use-web3"
import * as LocalAnalysisEngine from "./local-analysis-engine"
import {
  testGeminiConnection,
  analyzeProposalWithGemini,
  suggestVoteWithGemini,
  generateProposalDraftWithGemini,
  summarizeDAOWithGemini,
  explainTransactionWithGemini,
  suggestDAOImprovementsWithGemini,
  generateDAODescriptionWithGemini,
  type AnalysisResult,
  type VoteSuggestion,
  type DAOSummary,
  type TransactionExplanation,
} from "@/app/actions/gemini-actions"

type AgentContextType = {
  isAgentEnabled: boolean
  isAgentProcessing: boolean
  isUsingFallback: boolean
  agentError: string | null
  enableAgent: () => Promise<void>
  disableAgent: () => void
  analyzeProposal: (proposalId: string, description: string) => Promise<AnalysisResult>
  suggestVote: (proposalId: string, description: string) => Promise<VoteSuggestion>
  executeProposalWithAgent: (proposalId: string) => Promise<boolean>
  retryConnection: () => Promise<void>
  // New AI capabilities
  generateProposalDraft: (topic: string, context?: string) => Promise<string>
  summarizeDAO: (daoAddress: string, daoInfo: any) => Promise<DAOSummary>
  explainTransaction: (txHash: string, txData: any) => Promise<TransactionExplanation>
  suggestDAOImprovements: (daoAddress: string, daoInfo: any) => Promise<string[]>
  generateDAODescription: (purpose: string, goals: string[]) => Promise<string>
}

const AgentContext = createContext<AgentContextType>({
  isAgentEnabled: false,
  isAgentProcessing: false,
  isUsingFallback: false,
  agentError: null,
  enableAgent: async () => {},
  disableAgent: () => {},
  analyzeProposal: async () => ({
    summary: "",
    riskLevel: "medium",
    potentialImpact: "",
    recommendation: "",
  }),
  suggestVote: async () => ({
    recommendation: "abstain",
    confidence: 0,
    reasoning: "",
  }),
  executeProposalWithAgent: async () => false,
  retryConnection: async () => {},
  // Default implementations for new capabilities
  generateProposalDraft: async () => "",
  summarizeDAO: async () => ({
    overview: "",
    health: "fair",
    keyMetrics: [],
    recentActivity: "",
  }),
  explainTransaction: async () => ({
    summary: "",
    impact: "",
    riskAssessment: "",
    recommendation: "",
  }),
  suggestDAOImprovements: async () => [],
  generateDAODescription: async () => "",
})

export const useAgent = () => useContext(AgentContext)

export function AgentProvider({ children }: { children: ReactNode }) {
  const { account, daoAddress } = useWeb3()
  const [isAgentEnabled, setIsAgentEnabled] = useState(false)
  const [isAgentProcessing, setIsAgentProcessing] = useState(false)
  const [isUsingFallback, setIsUsingFallback] = useState(false)
  const [agentError, setAgentError] = useState<string | null>(null)
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  const initializeGemini = async () => {
    try {
      setIsAgentProcessing(true)
      setAgentError(null)

      const result = await testGeminiConnection()

      if (!result.success) {
        throw new Error(result.message)
      }

      setIsUsingFallback(false)

      toast({
        title: "AI Governance Agent Initialized",
        description: "Gemini AI is now connected and ready to assist with DAO governance tasks.",
      })
    } catch (error: any) {
      console.error("Error initializing Gemini:", error)
      setAgentError(error.message || "Failed to initialize the AI governance agent")
      setIsUsingFallback(true)

      toast({
        title: "Error Initializing Gemini",
        description: "Using local analysis capabilities instead. " + error.message,
        variant: "warning",
      })
    } finally {
      setIsAgentProcessing(false)
    }
  }

  // This effect handles initialization of Gemini
  useEffect(() => {
    if (isAgentEnabled && account) {
      initializeGemini()
    }
  }, [isAgentEnabled, account, connectionAttempts])

  const enableAgent = async () => {
    try {
      if (!account) {
        throw new Error("Please connect your wallet first")
      }

      setIsAgentEnabled(true)
      // Initialization will be handled by the useEffect
    } catch (error: any) {
      console.error("Error enabling agent:", error)
      toast({
        title: "Error Enabling Agent",
        description: error.message || "Failed to enable the AI assistant",
        variant: "destructive",
      })
    }
  }

  const disableAgent = () => {
    setIsAgentEnabled(false)
    setIsUsingFallback(false)
    setAgentError(null)

    toast({
      title: "AI Assistant Disabled",
      description: "The assistant has been disabled.",
    })
  }

  const retryConnection = async () => {
    if (!isAgentEnabled) {
      await enableAgent()
    } else {
      setIsUsingFallback(false)
      setAgentError(null)
      setConnectionAttempts((prev) => prev + 1)
      await initializeGemini()
    }
  }

  const analyzeProposal = async (proposalId: string, description: string): Promise<AnalysisResult> => {
    try {
      setIsAgentProcessing(true)

      // If using fallback, use local analysis engine
      if (isUsingFallback) {
        // Add a small delay to simulate processing
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return LocalAnalysisEngine.analyzeProposal(description)
      }

      // Use server action to analyze the proposal
      return await analyzeProposalWithGemini(proposalId, description)
    } catch (error: any) {
      console.error("Error analyzing proposal:", error)

      // Fall back to local analysis
      setIsUsingFallback(true)
      toast({
        title: "Error Using Gemini",
        description: "Falling back to local analysis. " + error.message,
        variant: "warning",
      })

      return LocalAnalysisEngine.analyzeProposal(description)
    } finally {
      setIsAgentProcessing(false)
    }
  }

  const suggestVote = async (proposalId: string, description: string): Promise<VoteSuggestion> => {
    try {
      setIsAgentProcessing(true)

      // If using fallback, use local analysis engine
      if (isUsingFallback) {
        // Add a small delay to simulate processing
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return LocalAnalysisEngine.suggestVote(description)
      }

      // Use server action to suggest a vote
      return await suggestVoteWithGemini(proposalId, description)
    } catch (error: any) {
      console.error("Error suggesting vote:", error)

      // Fall back to local analysis
      setIsUsingFallback(true)
      toast({
        title: "Error Using Gemini",
        description: "Falling back to local analysis. " + error.message,
        variant: "warning",
      })

      return LocalAnalysisEngine.suggestVote(description)
    } finally {
      setIsAgentProcessing(false)
    }
  }

  const executeProposalWithAgent = async (proposalId: string): Promise<boolean> => {
    try {
      setIsAgentProcessing(true)

      if (isUsingFallback) {
        throw new Error("Gemini AI is not properly initialized. Cannot execute proposal.")
      }

      // In a real implementation, we would use a wallet integration to execute the proposal
      // For now, we'll simulate the execution
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Proposal Execution Simulated",
        description: "In a production environment, this would execute the proposal transaction.",
      })

      return true
    } catch (error: any) {
      console.error("Error executing proposal:", error)
      toast({
        title: "Error Executing Proposal",
        description: error.message || "Failed to execute the proposal",
        variant: "destructive",
      })
      return false
    } finally {
      setIsAgentProcessing(false)
    }
  }

  // New AI capabilities implementation

  const generateProposalDraft = async (topic: string, context?: string): Promise<string> => {
    try {
      setIsAgentProcessing(true)

      if (isUsingFallback) {
        return `Draft proposal for ${topic}. This is a placeholder generated by the local system because Gemini AI is not available.`
      }

      return await generateProposalDraftWithGemini(topic, context)
    } catch (error: any) {
      console.error("Error generating proposal draft:", error)
      return `Failed to generate proposal draft: ${error.message}. Please try again later.`
    } finally {
      setIsAgentProcessing(false)
    }
  }

  const summarizeDAO = async (daoAddress: string, daoInfo: any): Promise<DAOSummary> => {
    try {
      setIsAgentProcessing(true)

      if (isUsingFallback) {
        return {
          overview: `This is a DAO at address ${daoAddress}. Local analysis used due to Gemini AI unavailability.`,
          health: "fair",
          keyMetrics: ["Members: Unknown", "Treasury: Unknown", "Proposals: Unknown"],
          recentActivity: "No recent activity data available.",
        }
      }

      return await summarizeDAOWithGemini(daoAddress, daoInfo)
    } catch (error: any) {
      console.error("Error summarizing DAO:", error)
      return {
        overview: `Error analyzing DAO: ${error.message}`,
        health: "fair",
        keyMetrics: ["Data unavailable"],
        recentActivity: "Analysis failed",
      }
    } finally {
      setIsAgentProcessing(false)
    }
  }

  const explainTransaction = async (txHash: string, txData: any): Promise<TransactionExplanation> => {
    try {
      setIsAgentProcessing(true)

      if (isUsingFallback) {
        return {
          summary: `Transaction ${txHash.substring(0, 8)}...${txHash.substring(txHash.length - 6)}`,
          impact: "Impact cannot be determined without AI analysis",
          riskAssessment: "Risk assessment unavailable",
          recommendation: "Please review transaction details manually",
        }
      }

      return await explainTransactionWithGemini(txHash, txData)
    } catch (error: any) {
      console.error("Error explaining transaction:", error)
      return {
        summary: `Error analyzing transaction: ${error.message}`,
        impact: "Impact unknown due to analysis error",
        riskAssessment: "Risk assessment unavailable",
        recommendation: "Please review transaction details manually",
      }
    } finally {
      setIsAgentProcessing(false)
    }
  }

  const suggestDAOImprovements = async (daoAddress: string, daoInfo: any): Promise<string[]> => {
    try {
      setIsAgentProcessing(true)

      if (isUsingFallback) {
        return [
          "Consider increasing member participation",
          "Review governance parameters",
          "Evaluate treasury management strategy",
        ]
      }

      return await suggestDAOImprovementsWithGemini(daoAddress, daoInfo)
    } catch (error: any) {
      console.error("Error suggesting DAO improvements:", error)
      return ["Error generating suggestions", "Please try again later"]
    } finally {
      setIsAgentProcessing(false)
    }
  }

  const generateDAODescription = async (purpose: string, goals: string[]): Promise<string> => {
    try {
      setIsAgentProcessing(true)

      if (isUsingFallback) {
        return `A DAO focused on ${purpose} with goals including ${goals.join(", ")}.`
      }

      return await generateDAODescriptionWithGemini(purpose, goals)
    } catch (error: any) {
      console.error("Error generating DAO description:", error)
      return `A DAO focused on ${purpose}. Error generating full description: ${error.message}`
    } finally {
      setIsAgentProcessing(false)
    }
  }

  return (
    <AgentContext.Provider
      value={{
        isAgentEnabled,
        isAgentProcessing,
        isUsingFallback,
        agentError,
        enableAgent,
        disableAgent,
        analyzeProposal,
        suggestVote,
        executeProposalWithAgent,
        retryConnection,
        // New AI capabilities
        generateProposalDraft,
        summarizeDAO,
        explainTransaction,
        suggestDAOImprovements,
        generateDAODescription,
      }}
    >
      {children}
    </AgentContext.Provider>
  )
}
