import { LayoutContainer } from "@/components/layout-container"
import { ProposalList } from "@/components/proposal-list"

export default function ProposalsPage() {
  return (
    <LayoutContainer>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Proposals</h1>
        <ProposalList />
      </div>
    </LayoutContainer>
  )
}
