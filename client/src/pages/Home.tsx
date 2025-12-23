import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DocumentEditor } from "@/components/DocumentEditor";
import { useDocuments, useCreateDocument } from "@/hooks/use-documents";
import { Switch, Route, useLocation } from "wouter";
import DocumentView from "./DocumentView";
import { Loader2, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center mb-8 shadow-inner ring-1 ring-accent/10">
        <FileText className="w-10 h-10 text-accent" />
      </div>
      <h2 className="text-3xl font-display font-bold text-foreground mb-3">
        Welcome to DocuApp
      </h2>
      <p className="max-w-md text-muted-foreground mb-8 text-lg leading-relaxed">
        Your personal knowledge base. Create documents, organize ideas, and keep everything in one beautiful place.
      </p>
      <Button 
        size="lg" 
        onClick={onCreate} 
        className="text-base px-8 py-6 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
        Create your first document
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </div>
  );
}

function Dashboard() {
  const { data: documents = [], isLoading } = useDocuments();
  const createMutation = useCreateDocument();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleCreate = async (data: any) => {
    const newDoc = await createMutation.mutateAsync(data);
    setLocation(`/docs/${newDoc.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        documents={documents} 
        onCreateNew={() => setIsCreateOpen(true)} 
      />
      
      <div className="flex-1 ml-64 h-full overflow-y-auto bg-white/50 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
        
        <Switch>
          <Route path="/docs/:id" component={DocumentView} />
          <Route path="/">
            <EmptyState onCreate={() => setIsCreateOpen(true)} />
          </Route>
        </Switch>
      </div>

      <DocumentEditor
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}

export default Dashboard;
