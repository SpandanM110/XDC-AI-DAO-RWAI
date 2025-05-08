"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

type DaoActionsProps = {
  daoAddress: string
  isCreator: boolean
  refreshData?: () => void
}

export function DaoActions(props: DaoActionsProps) {
  const { daoAddress, isCreator } = props

  if (!isCreator) return null

  return (
    <div className="flex flex-col gap-2">
      <Button asChild variant="outline" className="justify-start">
        <Link href={`/dao/${daoAddress}/transfer`}>Transfer Funds</Link>
      </Button>
    </div>
  )
}
