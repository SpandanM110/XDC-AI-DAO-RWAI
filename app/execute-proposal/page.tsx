import { LayoutContainer } from "@/components/layout-container"
import { ExecuteProposal } from "@/components/execute-proposal"

export default function ExecuteProposalPage() {
  return (
    <LayoutContainer>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Execute Proposal</h1>
        <ExecuteProposal />
      </div>
    </LayoutContainer>
  )
}
