"use client"

import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/hooks/use-web3"
import { Loader2 } from "lucide-react"

export function WalletConnect() {
  const { isConnected, connect, disconnect, account, isLoading } = useWeb3()

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {isConnected ? (
        <Button variant="outline" className="w-full" onClick={disconnect}>
          Disconnect {account ? `(${account.substring(0, 6)}...${account.substring(account.length - 4)})` : ""}
        </Button>
      ) : (
        <Button className="w-full" onClick={connect} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            "Connect Wallet"
          )}
        </Button>
      )}
    </div>
  )
}
