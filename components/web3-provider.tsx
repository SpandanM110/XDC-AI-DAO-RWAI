"use client"

import { createContext, useEffect, useState, type ReactNode } from "react"
import { ethers } from "ethers"
import { daoAbi } from "@/lib/dao-abi"
import { toast } from "@/components/ui/use-toast"

export const Web3Context = createContext<{
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  contract: ethers.Contract | null
  account: string | null
  chainId: number | null
  daoAddress: string | null
  isConnected: boolean
  isLoading: boolean
  connect: () => Promise<void>
  disconnect: () => void
  isCrossmintUser: boolean
}>({
  provider: null,
  signer: null,
  contract: null,
  account: null,
  chainId: null,
  daoAddress: null,
  isConnected: false,
  isLoading: true,
  connect: async () => {},
  disconnect: () => {},
  isCrossmintUser: false,
})

// Updated contract address from the newly deployed EnhancedDAO contract
const CONTRACT_ADDRESS = "0x19c31fc77be4ffaa446cc14e6bb91158e6193f47"
const APOTHEM_CHAIN_ID = 51

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [daoAddress, setDaoAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCrossmintUser, setIsCrossmintUser] = useState(false)

  // Completely revised fetchDaoAddress function that avoids using getActiveDAOs
  const fetchDaoAddress = async (contract: ethers.Contract) => {
    try {
      console.log("Attempting to fetch DAO address...")

      // First try: Check if the user has created a DAO
      if (account) {
        try {
          console.log("Checking if user has created a DAO...")
          // Try to get the DAO created by this account using the getCreatorDao function
          const userDaoAddress = await contract.getCreatorDao(account)
          if (userDaoAddress && userDaoAddress !== ethers.ZeroAddress) {
            console.log("User DAO Address:", userDaoAddress)

            // Check if the DAO is active
            try {
              const daoSummary = await contract.getDaoSummary(userDaoAddress)
              if (daoSummary && daoSummary.length > 5 && daoSummary[5] === true) {
                console.log("Found active DAO for user:", userDaoAddress)
                setDaoAddress(userDaoAddress)
                return userDaoAddress
              } else {
                console.log("User's DAO exists but is inactive")
              }
            } catch (error) {
              console.error("Error checking if DAO is active:", error)
            }
          }
        } catch (error) {
          console.error("Error fetching user's DAO:", error)
        }
      }

      // Second try: Use getDaoCount and iterate through DAOs
      console.log("Trying to get all DAOs using getDaoCount...")
      try {
        const daoCount = await contract.getDaoCount()
        console.log("DAO Count:", daoCount.toString())

        if (daoCount > 0) {
          // Try to get the first few DAOs and find an active one
          for (let i = 0; i < Math.min(Number(daoCount), 5); i++) {
            try {
              const daoAddress = await contract.daoAddresses(i)
              console.log(`DAO Address ${i}:`, daoAddress)

              // Check if this DAO is active
              try {
                const daoSummary = await contract.getDaoSummary(daoAddress)
                if (daoSummary && daoSummary.length > 5 && daoSummary[5] === true) {
                  console.log(`Found active DAO at index ${i}:`, daoAddress)
                  setDaoAddress(daoAddress)
                  return daoAddress
                }
              } catch (summaryError) {
                console.error(`Error checking if DAO ${daoAddress} is active:`, summaryError)
              }
            } catch (addressError) {
              console.error(`Error getting DAO address at index ${i}:`, addressError)
            }
          }

          // If we couldn't find an active DAO, just use the first one
          try {
            const firstDaoAddress = await contract.daoAddresses(0)
            console.log("Using first DAO Address:", firstDaoAddress)
            setDaoAddress(firstDaoAddress)
            return firstDaoAddress
          } catch (firstDaoError) {
            console.error("Error getting first DAO address:", firstDaoError)
          }
        } else {
          console.log("No DAOs found (count is 0)")
        }
      } catch (countError) {
        console.error("Error with getDaoCount method:", countError)

        // Third try: Direct access to daoAddresses mapping
        console.log("Trying direct access to daoAddresses mapping...")
        try {
          const firstDaoAddress = await contract.daoAddresses(0)
          console.log("First DAO Address (direct access):", firstDaoAddress)
          if (firstDaoAddress && firstDaoAddress !== ethers.ZeroAddress) {
            setDaoAddress(firstDaoAddress)
            return firstDaoAddress
          }
        } catch (directAccessError) {
          console.error("Error with direct access to daoAddresses:", directAccessError)
        }
      }

      // Last resort: Use a hardcoded DAO address if available
      // This is just for development/testing purposes
      const hardcodedDaoAddress = "0x0000000000000000000000000000000000000000" // Replace with a known DAO address if you have one
      if (hardcodedDaoAddress && hardcodedDaoAddress !== "0x0000000000000000000000000000000000000000") {
        console.log("Using hardcoded DAO address:", hardcodedDaoAddress)
        setDaoAddress(hardcodedDaoAddress)
        return hardcodedDaoAddress
      }

      console.log("No DAOs found or unable to fetch DAO information")
      return null
    } catch (error) {
      console.error("Error in fetchDaoAddress:", error)
      return null
    }
  }

  const checkConnection = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        // Using BrowserProvider instead of Web3Provider for ethers v6
        const ethProvider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await ethProvider.listAccounts()

        if (accounts.length > 0) {
          const ethSigner = await ethProvider.getSigner()
          const network = await ethProvider.getNetwork()
          const ethChainId = Number(network.chainId)

          setProvider(ethProvider)
          setSigner(ethSigner)
          setAccount(accounts[0].address)
          setChainId(ethChainId)
          setIsConnected(true)

          const daoContract = new ethers.Contract(CONTRACT_ADDRESS, daoAbi, ethSigner)
          setContract(daoContract)

          // Fetch DAO address
          await fetchDaoAddress(daoContract)
        }
      }
    } catch (error) {
      console.error("Failed to check wallet connection:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  const connect = async () => {
    try {
      setIsLoading(true)

      if (!window.ethereum) {
        toast({
          title: "Wallet Not Found",
          description: "Please install MetaMask or XDCPay!",
          variant: "destructive",
        })
        return
      }

      // Using BrowserProvider instead of Web3Provider for ethers v6
      const ethProvider = new ethers.BrowserProvider(window.ethereum)
      await ethProvider.send("eth_requestAccounts", [])
      const accounts = await ethProvider.listAccounts()
      const ethSigner = await ethProvider.getSigner()
      const network = await ethProvider.getNetwork()
      const ethChainId = Number(network.chainId)

      // Check if connected to Apothem testnet
      if (ethChainId !== APOTHEM_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${APOTHEM_CHAIN_ID.toString(16)}` }],
          })
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: `0x${APOTHEM_CHAIN_ID.toString(16)}`,
                    chainName: "XDC Apothem Testnet",
                    nativeCurrency: {
                      name: "XDC",
                      symbol: "XDC",
                      decimals: 18,
                    },
                    rpcUrls: ["https://erpc.apothem.network"],
                    blockExplorerUrls: ["https://explorer.apothem.network/"],
                  },
                ],
              })
            } catch (addError) {
              console.error("Error adding XDC network:", addError)
              toast({
                title: "Network Error",
                description: "Failed to add XDC Apothem network to your wallet",
                variant: "destructive",
              })
            }
          } else {
            console.error("Error switching network:", switchError)
            toast({
              title: "Network Error",
              description: "Failed to switch to XDC Apothem network",
              variant: "destructive",
            })
          }
        }
      }

      // Refresh provider after network switch
      const updatedProvider = new ethers.BrowserProvider(window.ethereum)
      const updatedSigner = await updatedProvider.getSigner()

      setProvider(updatedProvider)
      setSigner(updatedSigner)
      setAccount(accounts[0].address)
      setChainId(ethChainId)
      setIsConnected(true)

      const daoContract = new ethers.Contract(CONTRACT_ADDRESS, daoAbi, updatedSigner)
      setContract(daoContract)

      // Fetch DAO address
      await fetchDaoAddress(daoContract)

      toast({
        title: "Wallet Connected",
        description: "Successfully connected to XDC Apothem network",
      })
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setProvider(null)
    setSigner(null)
    setContract(null)
    setAccount(null)
    setChainId(null)
    setDaoAddress(null)
    setIsConnected(false)
    setIsCrossmintUser(false)

    toast({
      title: "Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect()
    } else {
      setAccount(accounts[0])
      checkConnection()
    }
  }

  const handleChainChanged = () => {
    window.location.reload()
  }

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        contract,
        account,
        chainId,
        daoAddress,
        isConnected,
        isLoading,
        connect,
        disconnect,
        isCrossmintUser,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
