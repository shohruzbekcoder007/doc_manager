import { useParams, useLocation } from "wouter";
import { useDocument, useDeleteDocument, useUpdateDocument } from "@/hooks/use-documents";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Pencil, Trash2, Calendar, Folder, Clock, Share2 } from "lucide-react";
import { useState } from "react";
import { DocumentEditor } from "@/components/DocumentEditor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function DocumentView() {
  const { id } = useParams();
  const documentId = id ? parseInt(id) : null;
  const { data: document, isLoading, error } = useDocument(documentId);
  const deleteMutation = useDeleteDocument();
  const updateMutation = useUpdateDocument();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (documentId) {
      await deleteMutation.mutateAsync(documentId);
      setIsDeleteDialogOpen(false);
      setLocation("/");
    }
  };

  const handleUpdate = async (data: any) => {
    if (documentId) {
      await updateMutation.mutateAsync({ id: documentId, ...data });
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied", description: "Document URL copied to clipboard" });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-12 space-y-8 animate-pulse">
        <div className="space-y-4 border-b border-border pb-8">
          <Skeleton className="h-4 w-32 bg-muted" />
          <Skeleton className="h-12 w-3/4 bg-muted" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24 bg-muted" />
            <Skeleton className="h-4 w-24 bg-muted" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full bg-muted" />
          <Skeleton className="h-4 w-full bg-muted" />
          <Skeleton className="h-4 w-5/6 bg-muted" />
          <Skeleton className="h-32 w-full bg-muted mt-8" />
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 text-muted-foreground text-4xl">?</div>
        <h2 className="text-2xl font-bold font-display mb-2">Document Not Found</h2>
        <p className="text-muted-foreground mb-8">The document you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => setLocation("/")} variant="outline">
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-12">
      <header className="mb-10 pb-6 border-b border-border">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4 font-mono">
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
            <Folder className="w-3.5 h-3.5" />
            {document.category}
          </span>
          {document.createdAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(document.createdAt), "MMMM d, yyyy")}
            </span>
          )}
          {document.createdAt && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {format(new Date(document.createdAt), "h:mm a")}
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
            {document.title}
          </h1>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={copyLink} title="Copy Link">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsEditorOpen(true)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="min-h-[50vh]">
        <MarkdownViewer content={document.content} />
      </main>

      <div className="mt-20 pt-10 border-t border-border flex justify-between text-muted-foreground text-sm">
        <div>
          Last updated: {document.createdAt ? format(new Date(document.createdAt), "PPP") : "Unknown"}
        </div>
      </div>

      <DocumentEditor
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        initialData={document}
        onSubmit={handleUpdate}
        isSubmitting={updateMutation.isPending}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document
              "{document.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
