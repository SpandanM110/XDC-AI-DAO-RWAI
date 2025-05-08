"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

// Types for the responses
export type AnalysisResult = {
  summary: string
  riskLevel: "low" | "medium" | "high"
  potentialImpact: string
  recommendation: string
}

export type VoteSuggestion = {
  recommendation: "yes" | "no" | "abstain"
  confidence: number
  reasoning: string
}

export type DAOSummary = {
  overview: string
  health: "excellent" | "good" | "fair" | "concerning"
  keyMetrics: string[]
  recentActivity: string
}

export type TransactionExplanation = {
  summary: string
  impact: string
  riskAssessment: string
  recommendation: string
}

// Initialize Gemini on the server side
const initializeGemini = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("Gemini API key is missing")
  }

  return new GoogleGenerativeAI(apiKey)
}

// Server action to test Gemini connection
export async function testGeminiConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const genAI = initializeGemini()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    await model.generateContent("Test connection")
    return { success: true, message: "Gemini connection successful" }
  } catch (error: any) {
    console.error("Error testing Gemini connection:", error)
    return {
      success: false,
      message: error.message || "Failed to connect to Gemini",
    }
  }
}

// Server action to analyze a proposal
export async function analyzeProposalWithGemini(proposalId: string, description: string): Promise<AnalysisResult> {
  try {
    const genAI = initializeGemini()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      You are an AI governance assistant for a DAO on the XDC blockchain. 
      Please analyze the following proposal and provide:
      1. A brief summary (max 2 sentences)
      2. A risk assessment (low, medium, or high)
      3. Potential impact on the DAO and XDC ecosystem
      4. A recommendation for DAO members

      Format your response as JSON with the following structure:
      {
        "summary": "Brief summary here",
        "riskLevel": "low|medium|high",
        "potentialImpact": "Impact description here",
        "recommendation": "Recommendation here"
      }

      Proposal ID: ${proposalId}
      Proposal Description: ${description}
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse Gemini response")
    }

    const analysisData = JSON.parse(jsonMatch[0])

    return {
      summary: analysisData.summary || "No summary provided",
      riskLevel: (analysisData.riskLevel || "medium").toLowerCase() as "low" | "medium" | "high",
      potentialImpact: analysisData.potentialImpact || "No impact analysis provided",
      recommendation: analysisData.recommendation || "No recommendation provided",
    }
  } catch (error: any) {
    console.error("Error analyzing proposal with Gemini:", error)
    throw new Error(`Failed to analyze proposal: ${error.message}`)
  }
}

// Server action to suggest a vote
export async function suggestVoteWithGemini(proposalId: string, description: string): Promise<VoteSuggestion> {
  try {
    const genAI = initializeGemini()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      You are an AI governance assistant for a DAO on the XDC blockchain. 
      Please analyze the following proposal and suggest how to vote:
      
      1. Recommend a vote (yes, no, or abstain)
      2. Provide a confidence level (0.0 to 1.0)
      3. Explain your reasoning

      Format your response as JSON with the following structure:
      {
        "recommendation": "yes|no|abstain",
        "confidence": 0.75,
        "reasoning": "Explanation here"
      }

      Proposal ID: ${proposalId}
      Proposal Description: ${description}
      
      Consider the impact on the DAO treasury, governance structure, and alignment with XDC ecosystem goals.
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse Gemini response")
    }

    const suggestionData = JSON.parse(jsonMatch[0])

    return {
      recommendation: (suggestionData.recommendation || "abstain").toLowerCase() as "yes" | "no" | "abstain",
      confidence: Number.parseFloat(suggestionData.confidence) || 0.5,
      reasoning: suggestionData.reasoning || "No reasoning provided",
    }
  } catch (error: any) {
    console.error("Error suggesting vote with Gemini:", error)
    throw new Error(`Failed to suggest vote: ${error.message}`)
  }
}

// Server action to generate a proposal draft
export async function generateProposalDraftWithGemini(topic: string, context?: string): Promise<string> {
  try {
    const genAI = initializeGemini()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      You are an AI assistant for a DAO on the XDC blockchain. 
      Please generate a well-structured proposal draft on the following topic:
      
      Topic: ${topic}
      ${context ? `Additional context: ${context}` : ""}
      
      The proposal should include:
      1. A clear title
      2. Background/context
      3. Proposed action(s)
      4. Expected outcomes
      5. Required resources or funding (if applicable)
      6. Timeline
      
      Make the proposal specific to the XDC blockchain ecosystem and follow best practices for DAO governance.
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error: any) {
    console.error("Error generating proposal draft:", error)
    throw new Error(`Failed to generate proposal draft: ${error.message}`)
  }
}

// Server action to summarize a DAO
export async function summarizeDAOWithGemini(daoAddress: string, daoInfo: any): Promise<DAOSummary> {
  try {
    const genAI = initializeGemini()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      You are an AI assistant for a DAO on the XDC blockchain.
      Please analyze the following DAO information and provide a summary:
      
      DAO Address: ${daoAddress}
      DAO Information: ${JSON.stringify(daoInfo)}
      
      Format your response as JSON with the following structure:
      {
        "overview": "Brief overview of the DAO",
        "health": "excellent|good|fair|concerning",
        "keyMetrics": ["Metric 1: Value", "Metric 2: Value", ...],
        "recentActivity": "Summary of recent activity"
      }
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse Gemini response")
    }

    const summaryData = JSON.parse(jsonMatch[0])

    return {
      overview: summaryData.overview || "No overview provided",
      health: summaryData.health || "fair",
      keyMetrics: summaryData.keyMetrics || [],
      recentActivity: summaryData.recentActivity || "No recent activity data available",
    }
  } catch (error: any) {
    console.error("Error summarizing DAO:", error)
    throw new Error(`Failed to summarize DAO: ${error.message}`)
  }
}

// Server action to explain a transaction
export async function explainTransactionWithGemini(txHash: string, txData: any): Promise<TransactionExplanation> {
  try {
    const genAI = initializeGemini()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      You are an AI assistant for a DAO on the XDC blockchain.
      Please analyze the following transaction and explain it in simple terms:
      
      Transaction Hash: ${txHash}
      Transaction Data: ${JSON.stringify(txData)}
      
      Format your response as JSON with the following structure:
      {
        "summary": "What this transaction does in simple terms",
        "impact": "How this affects the DAO",
        "riskAssessment": "Any risks associated with this transaction",
        "recommendation": "Recommended action for DAO members"
      }
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse Gemini response")
    }

    const explanationData = JSON.parse(jsonMatch[0])

    return {
      summary: explanationData.summary || "No summary provided",
      impact: explanationData.impact || "Impact unknown",
      riskAssessment: explanationData.riskAssessment || "Risk assessment unavailable",
      recommendation: explanationData.recommendation || "No recommendation provided",
    }
  } catch (error: any) {
    console.error("Error explaining transaction:", error)
    throw new Error(`Failed to explain transaction: ${error.message}`)
  }
}

// Server action to suggest DAO improvements
export async function suggestDAOImprovementsWithGemini(daoAddress: string, daoInfo: any): Promise<string[]> {
  try {
    const genAI = initializeGemini()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      You are an AI assistant for a DAO on the XDC blockchain.
      Based on the following DAO information, suggest 3-5 specific improvements:
      
      DAO Address: ${daoAddress}
      DAO Information: ${JSON.stringify(daoInfo)}
      
      Format your response as a JSON array of strings, each containing a specific, actionable improvement suggestion:
      ["Suggestion 1", "Suggestion 2", "Suggestion 3", ...]
      
      Focus on governance, treasury management, member engagement, and proposal quality.
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("Failed to parse Gemini response")
    }

    const suggestions = JSON.parse(jsonMatch[0])
    return Array.isArray(suggestions) ? suggestions : []
  } catch (error: any) {
    console.error("Error suggesting DAO improvements:", error)
    throw new Error(`Failed to suggest DAO improvements: ${error.message}`)
  }
}

// Server action to generate a DAO description
export async function generateDAODescriptionWithGemini(purpose: string, goals: string[]): Promise<string> {
  try {
    const genAI = initializeGemini()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      You are an AI assistant for a DAO on the XDC blockchain.
      Please generate a compelling description for a new DAO with the following:
      
      Purpose: ${purpose}
      Goals: ${goals.join(", ")}
      
      The description should be 2-3 paragraphs, professional in tone, and highlight the unique value proposition of this DAO within the XDC ecosystem.
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error: any) {
    console.error("Error generating DAO description:", error)
    throw new Error(`Failed to generate DAO description: ${error.message}`)
  }
}
