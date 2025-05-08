import { LayoutContainer } from "@/components/layout-container"
import { DaoCreationWizard } from "@/components/dao-creation-wizard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateDao } from "@/components/create-dao"

export default function CreateDaoPage() {
  return (
    <LayoutContainer>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create DAO</h1>

        <Tabs defaultValue="wizard" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wizard">Guided Wizard</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Mode</TabsTrigger>
          </TabsList>
          <TabsContent value="wizard">
            <DaoCreationWizard />
          </TabsContent>
          <TabsContent value="advanced">
            <CreateDao />
          </TabsContent>
        </Tabs>
      </div>
    </LayoutContainer>
  )
}
