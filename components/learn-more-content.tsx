"use client"

import Link from "next/link"
import { ArrowLeft, Check, HelpCircle, Info, Lightbulb, Shield, Users, Vote, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function LearnMoreContent() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Welcome
          </Button>
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Understanding XDC DAO</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Learn everything you need to know about our decentralized governance platform before getting started.
        </p>
      </div>

      <Tabs defaultValue="overview" className="mb-12">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="guides">User Guides</TabsTrigger>
          <TabsTrigger value="roles">User Roles</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-primary" />
                What is XDC DAO?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                XDC DAO is a decentralized governance platform built on the XDC blockchain that enables organizations to
                make decisions collectively through transparent voting mechanisms.
              </p>
              <p>
                Our platform allows users to create Decentralized Autonomous Organizations (DAOs), propose ideas, vote
                on decisions, and manage shared treasuries—all secured by blockchain technology.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                How Do DAOs Work?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                A Decentralized Autonomous Organization (DAO) is an entity with no central leadership. Decisions are
                made collectively by community members and automatically executed through smart contracts on the
                blockchain.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">1</div>
                    Creation
                  </h3>
                  <p className="text-sm">
                    A DAO is created with specific rules encoded in smart contracts that define how decisions will be
                    made and funds managed.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">2</div>
                    Proposals
                  </h3>
                  <p className="text-sm">
                    Members submit proposals for actions the DAO should take, from treasury management to operational
                    decisions.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">3</div>
                    Voting
                  </h3>
                  <p className="text-sm">
                    Members vote on proposals, with each vote recorded transparently on the blockchain.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">4</div>
                    Execution
                  </h3>
                  <p className="text-sm">
                    If approved, proposals are automatically executed through the smart contract.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">5</div>
                    Transparency
                  </h3>
                  <p className="text-sm">
                    All actions and funds are tracked on the blockchain, providing complete transparency.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">6</div>
                    Evolution
                  </h3>
                  <p className="text-sm">The DAO can evolve over time through new proposals and voting.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                Why Use XDC DAO?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Transparency</h3>
                    <p className="text-sm text-muted-foreground">
                      All decisions and transactions are recorded on the blockchain and visible to all members.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Decentralization</h3>
                    <p className="text-sm text-muted-foreground">
                      No single entity controls the organization; power is distributed among members.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Automation</h3>
                    <p className="text-sm text-muted-foreground">
                      Smart contracts automatically execute decisions once voting thresholds are met.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Global Collaboration</h3>
                    <p className="text-sm text-muted-foreground">
                      Members can participate from anywhere in the world without intermediaries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Blockchain technology provides robust security for all operations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">XDC Blockchain Benefits</h3>
                    <p className="text-sm text-muted-foreground">
                      Fast transactions, low fees, and energy efficiency compared to other blockchains.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Secure Governance
              </CardTitle>
              <CardDescription>Create and manage DAOs with transparent voting and execution processes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our platform provides a secure environment for creating and managing DAOs with transparent governance
                processes:
              </p>

              <ul className="space-y-2 ml-6 list-disc">
                <li>Create a DAO with customizable parameters</li>
                <li>Establish clear voting rules and thresholds</li>
                <li>Transparent execution of approved proposals</li>
                <li>Immutable record of all governance actions</li>
                <li>Protection against unauthorized changes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Vote className="mr-2 h-5 w-5 text-primary" />
                Decentralized Voting
              </CardTitle>
              <CardDescription>
                Propose ideas and vote on important decisions with a tamper-proof voting system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Our voting system ensures that all members can participate in decision-making:</p>

              <ul className="space-y-2 ml-6 list-disc">
                <li>Create detailed proposals with supporting documentation</li>
                <li>Vote securely with blockchain verification</li>
                <li>Real-time voting results and analytics</li>
                <li>Automated execution of approved proposals</li>
                <li>Historical record of all votes and decisions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-primary" />
                Treasury Management
              </CardTitle>
              <CardDescription>
                Collectively manage funds with transparent transactions and proposal-based spending
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Our treasury management features allow for transparent handling of collective funds:</p>

              <ul className="space-y-2 ml-6 list-disc">
                <li>Secure treasury wallet controlled by the DAO</li>
                <li>Transparent record of all financial transactions</li>
                <li>Proposal-based fund allocation</li>
                <li>Multiple funding sources and contribution methods</li>
                <li>Detailed financial reporting and analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Community Governance
              </CardTitle>
              <CardDescription>
                Build consensus and make decisions as a community with equal voting rights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Our platform empowers communities to govern themselves effectively:</p>

              <ul className="space-y-2 ml-6 list-disc">
                <li>Equal voting rights for all members</li>
                <li>Transparent decision-making processes</li>
                <li>Multiple DAO participation from a single account</li>
                <li>Community discussion forums for proposals</li>
                <li>Delegation options for voting power</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="mt-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Creating a DAO</CardTitle>
              <CardDescription>
                Step-by-step guide to creating your own Decentralized Autonomous Organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">1</div>
                    Connect Your Wallet
                  </h3>
                  <p className="text-sm">
                    First, connect your XDC wallet to the platform. This will be used to create and manage your DAO.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">2</div>
                    Navigate to Create DAO
                  </h3>
                  <p className="text-sm">Click on "Create DAO" in the navigation menu or from your dashboard.</p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">3</div>
                    Fill in DAO Details
                  </h3>
                  <p className="text-sm">
                    Enter your DAO's name, description, and configure governance parameters such as voting duration and
                    quorum requirements.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">4</div>
                    Review and Confirm
                  </h3>
                  <p className="text-sm">
                    Review all details and confirm the creation. This will deploy your DAO smart contract to the XDC
                    blockchain.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">5</div>
                    Fund Your DAO
                  </h3>
                  <p className="text-sm">
                    After creation, you can fund your DAO's treasury to enable proposal execution and other activities.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">6</div>
                    Invite Members
                  </h3>
                  <p className="text-sm">
                    Share your DAO's address with potential members so they can join and participate in governance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Creating and Voting on Proposals</CardTitle>
              <CardDescription>How to create proposals and participate in voting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Creating a Proposal</h3>
                  <ol className="space-y-2 ml-6 list-decimal">
                    <li>Navigate to your DAO's page and click "Create Proposal"</li>
                    <li>Select the proposal type (fund transfer, contract interaction, etc.)</li>
                    <li>Fill in the proposal details, including title, description, and specific actions</li>
                    <li>Review and submit your proposal</li>
                    <li>Pay the small transaction fee to publish the proposal on-chain</li>
                  </ol>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Voting on Proposals</h3>
                  <ol className="space-y-2 ml-6 list-decimal">
                    <li>Browse active proposals in your DAO</li>
                    <li>Review proposal details and any attached documentation</li>
                    <li>Click "Vote" and select your position (For/Against)</li>
                    <li>Confirm your vote with your wallet</li>
                    <li>Your vote will be recorded on the blockchain and counted toward the final result</li>
                  </ol>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Executing Approved Proposals</h3>
                  <ol className="space-y-2 ml-6 list-decimal">
                    <li>Once a proposal passes the required voting threshold, it becomes eligible for execution</li>
                    <li>Any member can trigger the execution of an approved proposal</li>
                    <li>Navigate to the proposal and click "Execute"</li>
                    <li>Confirm the transaction with your wallet</li>
                    <li>The proposal's actions will be automatically executed on-chain</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Managing DAO Treasury</CardTitle>
              <CardDescription>How to fund and manage your DAO's treasury</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Funding the Treasury</h3>
                  <ol className="space-y-2 ml-6 list-decimal">
                    <li>Navigate to your DAO's page and click "Fund DAO"</li>
                    <li>Enter the amount of XDC you wish to contribute</li>
                    <li>Confirm the transaction with your wallet</li>
                    <li>The funds will be transferred to the DAO's treasury</li>
                  </ol>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Transferring Funds</h3>
                  <ol className="space-y-2 ml-6 list-decimal">
                    <li>Create a proposal with the "Transfer Funds" action</li>
                    <li>Specify the recipient address and amount</li>
                    <li>Submit the proposal for voting</li>
                    <li>If approved, execute the proposal to transfer the funds</li>
                  </ol>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Monitoring Treasury Activity</h3>
                  <ol className="space-y-2 ml-6 list-decimal">
                    <li>View the current treasury balance on your DAO's dashboard</li>
                    <li>Review the transaction history to see all incoming and outgoing transactions</li>
                    <li>Track proposal-related expenditures</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>DAO Creator</CardTitle>
              <CardDescription>Responsibilities and capabilities of DAO creators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  As a DAO creator, you are responsible for establishing the initial parameters of the organization and
                  helping it grow. Here's what you can do:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Capabilities</h3>
                    <ul className="space-y-2 ml-6 list-disc">
                      <li>Create the DAO with custom parameters</li>
                      <li>Fund the initial treasury</li>
                      <li>Create and vote on proposals</li>
                      <li>Execute approved proposals</li>
                      <li>Transfer funds from the treasury (via proposals)</li>
                    </ul>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Responsibilities</h3>
                    <ul className="space-y-2 ml-6 list-disc">
                      <li>Establish clear governance rules</li>
                      <li>Promote transparency in decision-making</li>
                      <li>Encourage member participation</li>
                      <li>Ensure the DAO's mission is followed</li>
                      <li>Facilitate smooth operations</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Important Notes</h3>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>You can only create one active DAO at a time</li>
                    <li>While you initiate the DAO, governance is shared among all members</li>
                    <li>Your voting power is equal to other members</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DAO Member</CardTitle>
              <CardDescription>Responsibilities and capabilities of DAO members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  As a DAO member, you participate in the governance process and help shape the organization's future.
                  Here's what you can do:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Capabilities</h3>
                    <ul className="space-y-2 ml-6 list-disc">
                      <li>Join multiple DAOs simultaneously</li>
                      <li>Create and vote on proposals</li>
                      <li>Contribute funds to the treasury</li>
                      <li>Execute approved proposals</li>
                      <li>Participate in discussions</li>
                    </ul>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Responsibilities</h3>
                    <ul className="space-y-2 ml-6 list-disc">
                      <li>Stay informed about proposals</li>
                      <li>Vote responsibly on decisions</li>
                      <li>Contribute constructively to discussions</li>
                      <li>Help maintain the DAO's mission</li>
                      <li>Report any issues or concerns</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">How to Participate Effectively</h3>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>Regularly check for new proposals</li>
                    <li>Research and understand proposals before voting</li>
                    <li>Engage in discussions to share your perspective</li>
                    <li>Consider the long-term impact of decisions</li>
                    <li>Help execute approved proposals when needed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is a DAO?</AccordionTrigger>
                  <AccordionContent>
                    A Decentralized Autonomous Organization (DAO) is an entity with no central leadership. Decisions are
                    made collectively by community members and automatically executed through smart contracts on the
                    blockchain. DAOs enable transparent, democratic governance for organizations of all types.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I create a DAO?</AccordionTrigger>
                  <AccordionContent>
                    To create a DAO, you need to connect your XDC wallet, navigate to the "Create DAO" page, fill in
                    your DAO's details (name, description, governance parameters), review and confirm. This will deploy
                    your DAO smart contract to the XDC blockchain. After creation, you can fund your DAO's treasury and
                    invite members.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>How do proposals work?</AccordionTrigger>
                  <AccordionContent>
                    Proposals are formal suggestions for actions the DAO should take. Any member can create a proposal
                    specifying what action should be taken (e.g., transferring funds, changing parameters). Members then
                    vote on the proposal during the voting period. If the proposal reaches the required approval
                    threshold, it can be executed, and its actions will be automatically performed by the smart
                    contract.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>How is voting conducted?</AccordionTrigger>
                  <AccordionContent>
                    Voting is conducted on-chain, meaning all votes are recorded on the XDC blockchain. Each member gets
                    one vote per proposal (For or Against). Votes are counted toward the final result, and if the
                    proposal reaches the required approval threshold within the voting period, it passes and becomes
                    eligible for execution.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>How is the treasury managed?</AccordionTrigger>
                  <AccordionContent>
                    The DAO treasury is a smart contract-controlled wallet that holds the organization's funds. Members
                    can contribute to the treasury at any time. Funds can only be spent through approved proposals. All
                    transactions are recorded on the blockchain, providing complete transparency about how funds are
                    used.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>Can I participate in multiple DAOs?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can join and participate in multiple DAOs simultaneously. Each DAO operates independently,
                    and you can vote on proposals, contribute funds, and participate in governance across all the DAOs
                    you've joined. Your "My DAOs" dashboard will show all the DAOs you're currently participating in.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>What blockchain does XDC DAO use?</AccordionTrigger>
                  <AccordionContent>
                    XDC DAO is built on the XDC blockchain, which offers several advantages including fast transaction
                    times, low fees, and energy efficiency. The XDC blockchain provides a secure and reliable foundation
                    for DAO operations, ensuring that governance actions and treasury management are handled
                    efficiently.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>Is my data secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes, all critical data is stored on the XDC blockchain, making it immutable and secure. Your wallet
                    connects to the platform but remains under your control at all times. We never store your private
                    keys or sensitive information. All voting and treasury actions are secured by blockchain technology
                    and smart contracts.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Now that you understand how XDC DAO works, you're ready to join the platform and start participating in
              decentralized governance.
            </p>
            <Link href="/">
              <Button size="lg">Return to Welcome Page</Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
