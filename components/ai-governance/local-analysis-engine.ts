/**
 * Local Analysis Engine
 *
 * This module provides a fallback analysis capability when the GOAT SDK
 * is unavailable or not responding. It uses simple text analysis techniques
 * to provide basic insights about proposals.
 */

// Risk keywords that might indicate higher risk
const HIGH_RISK_KEYWORDS = [
  "all funds",
  "entire treasury",
  "emergency",
  "urgent",
  "immediate",
  "critical",
  "high risk",
  "significant risk",
  "major change",
  "fundamental change",
  "complete overhaul",
]

const MEDIUM_RISK_KEYWORDS = [
  "substantial",
  "significant",
  "modify",
  "change",
  "adjust",
  "reallocate",
  "moderate risk",
  "partial",
  "update",
  "revise",
  "amend",
]

// Impact areas that proposals might affect
const IMPACT_AREAS = [
  "treasury",
  "governance",
  "voting",
  "membership",
  "community",
  "development",
  "funding",
  "protocol",
  "security",
  "operations",
]

/**
 * Analyzes proposal text to determine risk level
 */
export function analyzeRiskLevel(text: string): "low" | "medium" | "high" {
  const lowercaseText = text.toLowerCase()

  // Check for high risk keywords
  for (const keyword of HIGH_RISK_KEYWORDS) {
    if (lowercaseText.includes(keyword.toLowerCase())) {
      return "high"
    }
  }

  // Check for medium risk keywords
  for (const keyword of MEDIUM_RISK_KEYWORDS) {
    if (lowercaseText.includes(keyword.toLowerCase())) {
      return "medium"
    }
  }

  // Default to low risk
  return "low"
}

/**
 * Identifies potential impact areas from proposal text
 */
export function identifyImpactAreas(text: string): string[] {
  const lowercaseText = text.toLowerCase()
  return IMPACT_AREAS.filter((area) => lowercaseText.includes(area.toLowerCase()))
}

/**
 * Generates a summary of the proposal
 */
export function generateSummary(text: string): string {
  // Simple summary generation - first sentence or first 100 chars
  const firstSentence = text.split(/[.!?]/).filter((s) => s.trim().length > 0)[0]

  if (firstSentence && firstSentence.length < 100) {
    return firstSentence.trim() + "."
  } else if (text.length > 150) {
    return text.substring(0, 147).trim() + "..."
  }

  return text
}

/**
 * Generates a recommendation based on risk level and impact
 */
export function generateRecommendation(riskLevel: "low" | "medium" | "high", impactAreas: string[]): string {
  if (riskLevel === "high") {
    return `This proposal carries significant risk and affects ${impactAreas.join(", ")}. Careful consideration is advised before voting.`
  } else if (riskLevel === "medium") {
    return `This proposal has moderate implications for ${impactAreas.join(", ")}. Review the details thoroughly before making a decision.`
  } else {
    return `This appears to be a relatively low-risk proposal affecting ${impactAreas.join(", ")}. Standard review is recommended.`
  }
}

/**
 * Analyzes a proposal and returns structured insights
 */
export function analyzeProposal(description: string) {
  const riskLevel = analyzeRiskLevel(description)
  const impactAreas = identifyImpactAreas(description)
  const summary = generateSummary(description)

  // Default to "governance" if no impact areas detected
  const areas = impactAreas.length > 0 ? impactAreas : ["governance"]

  const potentialImpact = `This proposal may impact ${areas.join(", ")} operations of the DAO.`
  const recommendation = generateRecommendation(riskLevel, areas)

  return {
    summary,
    riskLevel,
    potentialImpact,
    recommendation,
  }
}

/**
 * Suggests a vote based on proposal analysis
 */
export function suggestVote(description: string) {
  const { riskLevel } = analyzeProposal(description)

  // Simple vote suggestion logic
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

  // Generate reasoning
  let reasoning = ""
  if (recommendation === "yes") {
    reasoning = `Based on analysis, this proposal appears to have ${riskLevel} risk with potentially positive outcomes for the DAO.`
  } else if (recommendation === "no") {
    reasoning = `The ${riskLevel} risk level of this proposal suggests potential concerns that may outweigh the benefits.`
  } else {
    reasoning = `Given the ${riskLevel} risk assessment, more information may be needed before making a definitive decision.`
  }

  return {
    recommendation,
    confidence,
    reasoning,
  }
}
