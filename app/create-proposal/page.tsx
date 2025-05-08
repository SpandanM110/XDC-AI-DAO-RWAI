import { CreateProposal } from "@/components/create-proposal"
import { ProposalGenerator } from "@/components/ai-governance/proposal-generator"
import { LayoutContainer } from "@/components/layout-container"

export default function CreateProposalPage() {
  return (
    <LayoutContainer>
      <h1 className="text-3xl font-bold mb-6">Create Proposal</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <CreateProposal />
        </div>
        <div>
          <ProposalGenerator />
        </div>
      </div>
    </LayoutContainer>
  )
}
