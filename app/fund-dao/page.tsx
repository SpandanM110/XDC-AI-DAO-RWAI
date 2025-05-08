import { LayoutContainer } from "@/components/layout-container"
import { FundDao } from "@/components/fund-dao"

export default function FundDaoPage() {
  return (
    <LayoutContainer>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Fund DAO</h1>
        <FundDao />
      </div>
    </LayoutContainer>
  )
}
