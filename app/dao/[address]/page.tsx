import { LayoutContainer } from "@/components/layout-container"
import { DaoDetails } from "@/components/dao-details"

export default function DaoPage({ params }: { params: { address: string } }) {
  return (
    <LayoutContainer>
      <div className="max-w-4xl mx-auto">
        <DaoDetails address={params.address} />
      </div>
    </LayoutContainer>
  )
}
