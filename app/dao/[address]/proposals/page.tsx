import { LayoutContainer } from "@/components/layout-container"
import { DaoProposals } from "@/components/dao-proposals"

export default function DaoProposalsPage({ params }: { params: { address: string } }) {
  return (
    <LayoutContainer>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">DAO Proposals</h1>
        <DaoProposals address={params.address} />
      </div>
    </LayoutContainer>
  )
}
