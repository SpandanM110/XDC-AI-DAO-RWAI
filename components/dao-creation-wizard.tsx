"use client"

import { useState } from "react"
import { useWeb3 } from "@/hooks/use-web3"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, HelpCircle, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ethers } from "ethers"

// DAO Templates
const daoTemplates = [
  {
    id: "community",
    name: "Community DAO",
    description: "A general-purpose DAO for community governance and treasury management.",
    category: "community",
    exampleName: "XDC Community Hub",
  },
  {
    id: "development",
    name: "Development Fund",
    description: "A DAO focused on funding and managing development projects.",
    category: "dev",
    exampleName: "XDC Developer Fund",
  },
  {
    id: "defi",
    name: "DeFi Protocol",
    description: "A DAO for governing a decentralized finance protocol or service.",
    category: "defi",
    exampleName: "XDC DeFi Governance",
  },
  {
    id: "social",
    name: "Social Impact",
    description: "A DAO dedicated to social impact initiatives and charitable activities.",
    category: "social",
    exampleName: "XDC Impact Collective",
  },
]

export function DaoCreationWizard() {
  const { contract, isConnected } = useWeb3()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [createdDaoAddress, setCreatedDaoAddress] = useState<string | null>(null)

  // Categories matching those in the DAO list component
  const categories = [
    { value: "defi", label: "DeFi" },
    { value: "social", label: "Social Impact" },
    { value: "dev", label: "Development" },
    { value: "community", label: "Community" },
    { value: "other", label: "Other" },
  ]

  const steps = [
    { title: "Choose Template", description: "Select a template for your DAO" },
    { title: "Configure DAO", description: "Set up your DAO details" },
    { title: "Review & Create", description: "Review and create your DAO" },
    { title: "Success", description: "Your DAO has been created" },
  ]

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = daoTemplates.find((t) => t.id === templateId)
    if (template) {
      setName(template.exampleName)
      setCategory(template.category)
      setDescription(`A ${template.name.toLowerCase()} focused on the XDC network.`)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!contract || !isConnected) {
      toast({
        title: "Error",
        description: "Contract not connected",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      console.log("Creating DAO with name:", name)
      console.log("Category:", category)
      console.log("Description:", description)

      // Format metadata to include the category and description
      const metadata = `ipfs://|category:${category}|description:${description}`

      // Call the contract method to create a DAO
      const tx = await contract.createDAO(name, metadata)
      console.log("Transaction sent:", tx.hash)

      toast({
        title: "Transaction Sent",
        description: "Creating your DAO. Please wait for confirmation...",
      })

      // Wait for transaction confirmation
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt)

      // Try to get the DAO address from the event logs
      let daoAddress = null
      try {
        // Look for the event that contains the DAO address
        for (const log of receipt.logs) {
          // This is a simplified approach - in a real app, you'd decode the event data
          if (log.topics && log.topics.length > 0) {
            // Assuming the DAO address is in the event data
            daoAddress = ethers.getAddress("0x" + log.data.slice(26, 66))
            break
          }
        }
      } catch (error) {
        console.error("Error extracting DAO address:", error)
      }

      setCreatedDaoAddress(daoAddress)
      handleNext() // Move to success step

      toast({
        title: "DAO Created",
        description: "Your DAO has been successfully created!",
      })
    } catch (error: any) {
      console.error("Error creating DAO:", error)
      toast({
        title: "Error Creating DAO",
        description: error.message || "Failed to create DAO",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Your DAO</CardTitle>
        <CardDescription>Follow the steps to create your own Decentralized Autonomous Organization</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    index < currentStep
                      ? "bg-primary text-primary-foreground"
                      : index === currentStep
                        ? "bg-primary/90 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
                </div>
                <span className={`text-xs ${index === currentStep ? "font-medium" : "text-muted-foreground"}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
              <div
                className="h-1 bg-primary transition-all"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step 1: Choose Template */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Choose a DAO Template</h3>
            <p className="text-muted-foreground">
              Select a template that best fits your DAO's purpose. You can customize it in the next step.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {daoTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTemplate === template.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                  }`}
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Configure DAO */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configure Your DAO</h3>
            <p className="text-muted-foreground">
              Customize your DAO's details. These settings will be visible to all members.
            </p>

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  DAO Name
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 inline ml-1 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80">Choose a clear, memorable name that reflects your DAO's purpose.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="name"
                  placeholder="My XDC DAO"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 inline ml-1 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80">Categories help others discover your DAO based on its purpose.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 inline ml-1 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80">Explain your DAO's purpose, goals, and how it will operate.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your DAO's purpose and goals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review & Create */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Review & Create</h3>
            <p className="text-muted-foreground">
              Review your DAO details before creation. Once created, some settings cannot be changed.
            </p>

            <div className="border rounded-lg p-4 mt-4 bg-muted/30">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">DAO Name:</span>
                  <p className="font-medium">{name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <p className="font-medium">{categories.find((c) => c.value === category)?.label || category}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Description:</span>
                  <p className="text-sm mt-1">{description}</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-4">
              <h4 className="font-medium text-amber-800 dark:text-amber-400">Important Notes</h4>
              <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-300">
                <li>• You can only create one active DAO at a time with your wallet</li>
                <li>• Creating a DAO will deploy a new contract on the XDC network</li>
                <li>• You will be the creator and have special permissions</li>
                <li>• Other users can join your DAO once it's created</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === 3 && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-medium">DAO Created Successfully!</h3>
            <p className="text-muted-foreground">Your DAO has been created and is now active on the XDC network.</p>

            {createdDaoAddress && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">DAO Address:</p>
                <p className="font-mono text-xs break-all">{createdDaoAddress}</p>
              </div>
            )}

            <div className="mt-6 space-y-2">
              <p className="font-medium">Next Steps:</p>
              <div className="flex flex-col gap-2 max-w-md mx-auto">
                <Button variant="outline" asChild>
                  <a href={createdDaoAddress ? `/dao/${createdDaoAddress}` : "/"}>View Your DAO</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={createdDaoAddress ? `/dao/${createdDaoAddress}/create-proposal` : "/create-proposal"}>
                    Create First Proposal
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={createdDaoAddress ? `/dao/${createdDaoAddress}/fund` : "/fund-dao"}>Fund Your DAO</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {currentStep > 0 && currentStep < 3 && (
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        )}
        {currentStep === 0 && (
          <Button variant="outline" onClick={handleBack} disabled>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        )}
        {currentStep === 3 && (
          <Button variant="outline" asChild>
            <a href="/">Return Home</a>
          </Button>
        )}

        {currentStep < 2 && (
          <Button onClick={handleNext} disabled={currentStep === 0 && !selectedTemplate}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        {currentStep === 2 && (
          <Button onClick={handleSubmit} disabled={loading || !name || !category}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create DAO"
            )}
          </Button>
        )}
        {currentStep === 3 && (
          <Button asChild>
            <a href={createdDaoAddress ? `/dao/${createdDaoAddress}` : "/"}>
              View Your DAO <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
