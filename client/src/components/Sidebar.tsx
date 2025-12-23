import { Link, useLocation } from "wouter";
import { type Document } from "@shared/schema";
import { cn } from "@/lib/utils";
import { FileText, FolderOpen, Plus, Search } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  documents: Document[];
  onCreateNew: () => void;
}

export function Sidebar({ documents, onCreateNew }: SidebarProps) {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // Group documents by category
  const groupedDocs = documents.reduce((acc, doc) => {
    const category = doc.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  // Filter based on search
  const filteredCategories = Object.keys(groupedDocs).filter(category => {
    if (searchTerm === "") return true;
    const docs = groupedDocs[category];
    return category.toLowerCase().includes(searchTerm.toLowerCase()) || 
           docs.some(d => d.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }).sort();

  return (
    <aside className="w-64 border-r border-border h-screen bg-secondary/30 flex flex-col fixed left-0 top-0 z-20 overflow-hidden">
      <div className="p-6 border-b border-border/50 bg-background/50 backdrop-blur-sm">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-accent" />
          DocuApp
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-widest">
          Personal Docs
        </p>
      </div>

      <div className="p-4 space-y-4">
        <button
          onClick={onCreateNew}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 px-4 rounded-lg font-medium shadow-lg shadow-primary/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          New Document
        </button>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search docs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-8 space-y-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No documents found.
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category} className="space-y-1">
              <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 font-mono">
                {category}
              </h3>
              <div className="space-y-0.5">
                {groupedDocs[category]
                  .filter(d => searchTerm === "" || d.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((doc) => {
                    const isActive = location === `/docs/${doc.id}`;
                    return (
                      <Link key={doc.id} href={`/docs/${doc.id}`} className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 group",
                        isActive 
                          ? "bg-white shadow-sm text-accent font-medium" 
                          : "text-foreground/70 hover:bg-white/50 hover:text-foreground"
                      )}>
                        <FileText className={cn(
                          "w-3.5 h-3.5 transition-colors",
                          isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        <span className="truncate">{doc.title}</span>
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))
        )}
      </nav>

      <div className="p-4 border-t border-border/50 text-xs text-center text-muted-foreground">
        © 2025 DocuApp
      </div>
    </aside>
  );
}
