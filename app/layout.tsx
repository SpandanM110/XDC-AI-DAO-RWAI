import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Web3Provider } from "@/components/web3-provider"
import { AgentProvider } from "@/components/ai-governance/agent-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "XDC DAO Dashboard",
  description: "Dashboard for a Decentralized Autonomous Organization on XDC blockchain with AI governance",
   
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Web3Provider>
            <AgentProvider>{children}</AgentProvider>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
