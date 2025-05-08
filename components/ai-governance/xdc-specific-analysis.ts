/**
 * XDC-Specific Analysis Module
 *
 * This module extends the local analysis engine with XDC-specific
 * knowledge and analysis capabilities.
 */

import * as LocalAnalysisEngine from "./local-analysis-engine"

// XDC-specific keywords that might indicate higher risk
const XDC_HIGH_RISK_KEYWORDS = [
  "network upgrade",
  "consensus change",
  "protocol modification",
  "bridge security",
  "cross-chain",
  "mainnet deployment",
]

const XDC_MEDIUM_RISK_KEYWORDS = [
  "testnet",
  "parameter adjustment",
  "fee structure",
  "validator",
  "delegation",
  "staking mechanism",
]

// XDC-specific impact areas
const XDC_IMPACT_AREAS = [
  "network performance",
  "transaction fees",
  "validator rewards",
  "interoperability",
  "enterprise adoption",
  "regulatory compliance",
  "hybrid blockchain",
]

/**
 * Analyzes proposal text to determine XDC-specific risk level
 */
export function analyzeXdcRiskLevel(text: string): "low" | "medium" | "high" {
  const lowercaseText = text.toLowerCase()

  // Check for XDC-specific high risk keywords
  for (const keyword of XDC_HIGH_RISK_KEYWORDS) {
    if (lowercaseText.includes(keyword.toLowerCase())) {
      return "high"
    }
  }

  // Check for XDC-specific medium risk keywords
  for (const keyword of XDC_MEDIUM_RISK_KEYWORDS) {
    if (lowercaseText.includes(keyword.toLowerCase())) {
      return "medium"
    }
  }

  // Fall back to general risk analysis
  return LocalAnalysisEngine.analyzeRiskLevel(text)
}

/**
 * Identifies XDC-specific impact areas from proposal text
 */
export function identifyXdcImpactAreas(text: string): string[] {
  const lowercaseText = text.toLowerCase()
  const xdcAreas = XDC_IMPACT_AREAS.filter((area) => lowercaseText.includes(area.toLowerCase()))

  // Combine with general impact areas
  const generalAreas = LocalAnalysisEngine.identifyImpactAreas(text)

  // Remove duplicates
  return [...new Set([...xdcAreas, ...generalAreas])]
}

/**
 * Generates XDC-specific recommendations based on risk level and impact
 */
export function generateXdcRecommendation(riskLevel: "low" | "medium" | "high", impactAreas: string[]): string {
  // XDC-specific recommendations
  if (impactAreas.some((area) => area.includes("network") || area.includes("protocol") || area.includes("consensus"))) {
    if (riskLevel === "high") {
      return "This proposal affects core XDC network functionality. Consider consulting with XDC technical advisors before voting."
    } else if (riskLevel === "medium") {
      return "This proposal may impact XDC network operations. Review technical specifications carefully."
    }
  }

  if (
    impactAreas.some(
      (area) => area.includes("enterprise") || area.includes("regulatory") || area.includes("compliance"),
    )
  ) {
    return "This proposal has implications for enterprise adoption or regulatory compliance. Consider alignment with XDC's enterprise-focused approach."
  }

  // Fall back to general recommendations
  return LocalAnalysisEngine.generateRecommendation(riskLevel, impactAreas)
}

/**
 * Analyzes a proposal with XDC-specific context and returns structured insights
 */
export function analyzeXdcProposal(description: string) {
  const riskLevel = analyzeXdcRiskLevel(description)
  const impactAreas = identifyXdcImpactAreas(description)
  const summary = LocalAnalysisEngine.generateSummary(description)

  // Default to "governance" if no impact areas detected
  const areas = impactAreas.length > 0 ? impactAreas : ["governance"]

  const potentialImpact = `This proposal may impact ${areas.join(", ")} within the XDC ecosystem.`
  const recommendation = generateXdcRecommendation(riskLevel, areas)

  return {
    summary,
    riskLevel,
    potentialImpact,
    recommendation,
  }
}

/**
 * Suggests a vote based on XDC-specific proposal analysis
 */
export function suggestXdcVote(description: string) {
  const { riskLevel } = analyzeXdcProposal(description)

  // XDC-specific vote suggestion logic
  let recommendation: "yes" | "no" | "abstain"
  let confidence: number

  if (riskLevel === "high") {
    recommendation = Math.random() > 0.7 ? "no" : "abstain"
    confidence = 0.5 + Math.random() * 0.2 // 50-70% confidence
  } else if (riskLevel === "medium") {
    recommendation = Math.random() > 0.6 ? "yes" : Math.random() > 0.5 ? "no" : "abstain"
    confidence = 0.6 + Math.random() * 0.2 // 60-80% confidence
  } else {
    recommendation = Math.random() > 0.2 ? "yes" : Math.random() > 0.5 ? "abstain" : "no"
    confidence = 0.7 + Math.random() * 0.2 // 70-90% confidence
  }

  // Generate XDC-specific reasoning
  let reasoning = ""
  if (recommendation === "yes") {
    reasoning = `Based on XDC-specific analysis, this proposal appears to have ${riskLevel} risk with potentially positive outcomes for the XDC ecosystem.`
  } else if (recommendation === "no") {
    reasoning = `The ${riskLevel} risk level of this proposal suggests potential concerns that may impact XDC network operations or governance.`
  } else {
    reasoning = `Given the ${riskLevel} risk assessment for XDC-specific implications, more information may be needed before making a definitive decision.`
  }

  return {
    recommendation,
    confidence,
    reasoning,
  }
}

/**
 * Enhanced local fallback that uses XDC-specific analysis
 */
export function enhancedLocalAnalysis(description: string) {
  // Use XDC-specific analysis when possible
  return analyzeXdcProposal(description)
}

/**
 * Enhanced vote suggestion that uses XDC-specific analysis
 */
export function enhancedLocalVoteSuggestion(description: string) {
  // Use XDC-specific vote suggestion
  return suggestXdcVote(description)
}
