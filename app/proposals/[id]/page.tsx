import { LayoutContainer } from "@/components/layout-container"
import { ProposalDetail } from "@/components/proposal-detail"

export default function ProposalDetailPage({ params }: { params: { id: string } }) {
  return (
    <LayoutContainer>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Proposal Details</h1>
        <ProposalDetail proposalId={params.id} />
      </div>
    </LayoutContainer>
  )
}
