import { LayoutContainer } from "@/components/layout-container"
import { DaoOverview } from "@/components/dao-overview"
import { WalletConnect } from "@/components/wallet-connect"

export default function Home() {
  return (
    <LayoutContainer>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">DAO Dashboard</h1>
        <WalletConnect />
        <DaoOverview />
      </div>
    </LayoutContainer>
  )
}
