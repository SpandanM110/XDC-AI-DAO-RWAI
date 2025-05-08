import { LayoutContainer } from "@/components/layout-container"
import { DAOHealthDashboard } from "@/components/ai-governance/dao-health-dashboard"
import { TransactionExplainer } from "@/components/ai-governance/transaction-explainer"
import { ProposalGenerator } from "@/components/ai-governance/proposal-generator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Brain } from "lucide-react"

export default function AIInsightsPage() {
  return (
    <LayoutContainer>
      <h1 className="text-3xl font-bold mb-2">AI Insights</h1>
      <p className="text-muted-foreground mb-6">
        Leverage Gemini AI to gain deeper insights into your DAO and governance
      </p>

      <Alert className="mb-6">
        <Brain className="h-4 w-4" />
        <AlertTitle>AI Assistant</AlertTitle>
        <AlertDescription>Enable the AI Assistant from the top navigation bar to use these features.</AlertDescription>
      </Alert>

      <div className="space-y-8">
        <DAOHealthDashboard />
        <TransactionExplainer />
        <ProposalGenerator />
      </div>
    </LayoutContainer>
  )
}
