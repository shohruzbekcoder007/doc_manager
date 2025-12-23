import { z } from "zod";

export const insertDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().default("General"),
  order: z.number().default(0),
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export interface Document extends InsertDocument {
  _id: string;
  id: string;
  createdAt: string;
}

export type CreateDocumentRequest = InsertDocument;
export type UpdateDocumentRequest = Partial<InsertDocument>;
