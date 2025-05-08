import { LayoutContainer } from "@/components/layout-container"
import { MyDaos } from "@/components/my-daos"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function MyDaosPage() {
  return (
    <LayoutContainer>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">My DAOs</h1>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/browse-daos">
                <PlusCircle className="mr-2 h-4 w-4" />
                Join DAO
              </Link>
            </Button>
            <Button asChild>
              <Link href="/create-dao">Create DAO</Link>
            </Button>
          </div>
        </div>
        <MyDaos />
      </div>
    </LayoutContainer>
  )
}
