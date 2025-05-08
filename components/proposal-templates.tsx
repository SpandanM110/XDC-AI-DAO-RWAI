"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle, Copy } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Proposal templates
const proposalTemplates = [
  {
    id: "funding",
    name: "Funding Request",
    description: "Request funds from the DAO treasury for a project or initiative.",
    template: `Funding Request: [Project Name]

Amount Requested: [Amount] XDC

Project Description:
[Provide a detailed description of the project or initiative that requires funding]

Goals and Objectives:
- [Goal 1]
- [Goal 2]
- [Goal 3]

Timeline:
- [Milestone 1]: [Date]
- [Milestone 2]: [Date]
- [Milestone 3]: [Date]

Budget Breakdown:
- [Item 1]: [Amount] XDC
- [Item 2]: [Amount] XDC
- [Item 3]: [Amount] XDC

Expected Outcomes:
[Describe the expected outcomes and how they will benefit the DAO]

Reporting:
[Explain how you will report progress and results to the DAO]`,
  },
  {
    id: "governance",
    name: "Governance Change",
    description: "Propose changes to the DAO's governance structure or rules.",
    template: `Governance Change Proposal: [Title]

Current Situation:
[Describe the current governance structure or rule that you want to change]

Proposed Change:
[Clearly explain the change you are proposing]

Rationale:
[Explain why this change is necessary or beneficial]

Implementation Process:
[Describe how the change will be implemented]

Timeline:
[Provide a timeline for implementing the change]

Voting Period:
[Specify the recommended voting period for this proposal]

Impact Analysis:
[Analyze the potential impact of this change on the DAO and its members]`,
  },
  {
    id: "partnership",
    name: "Partnership Proposal",
    description: "Propose a partnership with another organization or DAO.",
    template: `Partnership Proposal: [Partner Name]

Partner Information:
- Name: [Partner Name]
- Type: [Organization/DAO/Project]
- Website: [URL]
- Contact: [Contact Information]

Partnership Description:
[Describe the nature of the proposed partnership]

Benefits to Our DAO:
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

Benefits to Partner:
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

Resource Requirements:
[List any resources required from the DAO]

Timeline:
[Provide a timeline for establishing and maintaining the partnership]

Success Metrics:
[Define how the success of the partnership will be measured]`,
  },
  {
    id: "community",
    name: "Community Initiative",
    description: "Propose a community-focused initiative or event.",
    template: `Community Initiative Proposal: [Initiative Name]

Initiative Description:
[Provide a detailed description of the community initiative or event]

Goals:
- [Goal 1]
- [Goal 2]
- [Goal 3]

Target Audience:
[Describe who this initiative is aimed at]

Resource Requirements:
- Budget: [Amount] XDC
- Personnel: [Number of people needed]
- Other resources: [List other resources needed]

Timeline:
- Planning phase: [Dates]
- Implementation phase: [Dates]
- Evaluation phase: [Dates]

Expected Outcomes:
[Describe the expected outcomes and how they will benefit the community]

Success Metrics:
[Define how the success of the initiative will be measured]`,
  },
]

// Custom proposal form
interface CustomProposalFormProps {
  onGenerate: (proposal: string) => void
}

function CustomProposalForm({ onGenerate }: CustomProposalFormProps) {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [timeline, setTimeline] = useState("")
  const [outcomes, setOutcomes] = useState("")

  const handleGenerate = () => {
    const proposal = `Proposal: ${title}

${amount ? `Amount Requested: ${amount} XDC\n\n` : ""}Description:
${description}

${timeline ? `Timeline:\n${timeline}\n\n` : ""}${outcomes ? `Expected Outcomes:\n${outcomes}` : ""}`

    onGenerate(proposal)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Proposal Title</Label>
        <Input
          id="title"
          placeholder="Enter a clear, descriptive title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">
          Amount (XDC)
          <span className="text-xs text-muted-foreground ml-2">(Optional)</span>
        </Label>
        <Input id="amount" type="number" placeholder="0.0" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your proposal in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeline">
          Timeline
          <span className="text-xs text-muted-foreground ml-2">(Optional)</span>
        </Label>
        <Textarea
          id="timeline"
          placeholder="- Phase 1: [Date]\n- Phase 2: [Date]"
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="outcomes">
          Expected Outcomes
          <span className="text-xs text-muted-foreground ml-2">(Optional)</span>
        </Label>
        <Textarea
          id="outcomes"
          placeholder="Describe the expected outcomes and benefits..."
          value={outcomes}
          onChange={(e) => setOutcomes(e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <Button onClick={handleGenerate} disabled={!title || !description}>
        Generate Proposal
      </Button>
    </div>
  )
}

export function ProposalTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [customizedTemplate, setCustomizedTemplate] = useState("")
  const [activeTab, setActiveTab] = useState("templates")

  const handleSelectTemplate = (templateId: string) => {
    const template = proposalTemplates.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setCustomizedTemplate(template.template)
    }
  }

  const handleCopyTemplate = () => {
    if (customizedTemplate) {
      navigator.clipboard.writeText(customizedTemplate)
      toast({
        title: "Copied to clipboard",
        description: "You can now paste the template into your proposal",
      })
    }
  }

  const handleCustomProposal = (proposal: string) => {
    setCustomizedTemplate(proposal)
    setActiveTab("preview")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Proposal Templates</CardTitle>
        <CardDescription>Use these templates to create effective proposals for your DAO</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="custom">Custom Proposal</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proposalTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTemplate === template.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                  }`}
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{template.name}</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">{template.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                </div>
              ))}
            </div>

            {selectedTemplate && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Template Preview</h3>
                  <Button variant="outline" size="sm" onClick={handleCopyTemplate}>
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                </div>
                <Textarea
                  value={customizedTemplate}
                  onChange={(e) => setCustomizedTemplate(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  You can edit this template to fit your specific proposal needs.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 mt-4">
            <div className="bg-muted/30 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Create Your Own Proposal</h3>
              <p className="text-sm text-muted-foreground">
                Fill out the form below to generate a custom proposal. You can preview and edit the final result.
              </p>
            </div>

            <CustomProposalForm onGenerate={handleCustomProposal} />
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Proposal Preview</h3>
              <Button variant="outline" size="sm" onClick={handleCopyTemplate}>
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
            </div>
            <div className="border rounded-lg p-4 bg-muted/30">
              <pre className="whitespace-pre-wrap font-mono text-sm">{customizedTemplate}</pre>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Edit Proposal</h4>
              <Textarea
                value={customizedTemplate}
                onChange={(e) => setCustomizedTemplate(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground mt-2">
                You can make final edits to your proposal before copying it.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-4">
              <h4 className="font-medium text-green-800 dark:text-green-400">Next Steps</h4>
              <ul className="mt-2 space-y-1 text-sm text-green-700 dark:text-green-300">
                <li>• Copy this proposal text</li>
                <li>• Go to the Create Proposal page</li>
                <li>• Paste the text into the description field</li>
                <li>• Set your desired voting duration</li>
                <li>• Submit your proposal to the DAO</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
