import { LayoutContainer } from "@/components/layout-container"
import { DaoList } from "@/components/dao-list"

export default function BrowseDaosPage() {
  return (
    <LayoutContainer>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Browse DAOs</h1>
        <DaoList />
      </div>
    </LayoutContainer>
  )
}
