"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useWeb3 } from "@/hooks/use-web3"
import { AgentControl } from "./ai-governance/agent-control"
import { UserAccountMenu } from "./user-account-menu"

export function TopNavigation() {
  const pathname = usePathname()
  const { isConnected } = useWeb3()

  // If not connected, don't render anything
  if (!isConnected) {
    return null
  }

  // Update the navItems array to include the My DAOs page but remove redundant Crossmint Setup
  const navItems = [
    {
      title: "Overview",
      href: "/",
    },
    {
      title: "My DAOs",
      href: "/my-daos",
    },
    {
      title: "Browse DAOs",
      href: "/browse-daos",
    },
    {
      title: "Create DAO",
      href: "/create-dao",
    },
    {
      title: "Create Proposal",
      href: "/create-proposal",
    },
    {
      title: "Fund DAO",
      href: "/fund-dao",
    },
    {
      title: "Execute Proposal",
      href: "/execute-proposal",
    },
    {
      title: "AI Insights",
      href: "/ai-insights",
    },
  ]

  // Full navigation for connected users
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center mr-4">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
            <span className="text-primary-foreground font-bold">X</span>
          </div>
          <span className="font-bold text-lg">XDC DAO</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <AgentControl />
          <UserAccountMenu />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <nav className="flex items-center px-4 pb-3 space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "text-sm font-medium whitespace-nowrap transition-colors hover:text-primary",
                pathname === item.href ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
