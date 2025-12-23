import { ObjectId } from "mongodb";
import { getDatabase } from "./db";
import type { Document, InsertDocument, UpdateDocumentRequest } from "@shared/schema";

export interface IStorage {
  getDocuments(): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(doc: InsertDocument): Promise<Document>;
  updateDocument(id: string, doc: UpdateDocumentRequest): Promise<Document>;
  deleteDocument(id: string): Promise<void>;
}

export class MongoStorage implements IStorage {
  async getDocuments(): Promise<Document[]> {
    const db = await getDatabase();
    const docs = await db
      .collection("documents")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map((doc: any) => ({
      ...doc,
      id: doc._id.toString(),
    }));
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const db = await getDatabase();
    const doc = await db.collection("documents").findOne({
      _id: new ObjectId(id),
    });
    if (!doc) return undefined;
    return {
      ...doc,
      id: doc._id.toString(),
    };
  }

  async createDocument(insertDoc: InsertDocument): Promise<Document> {
    const db = await getDatabase();
    const result = await db.collection("documents").insertOne({
      ...insertDoc,
      createdAt: new Date().toISOString(),
    });
    const doc = await db.collection("documents").findOne({
      _id: result.insertedId,
    });
    return {
      ...doc,
      id: doc!._id.toString(),
    };
  }

  async updateDocument(id: string, updates: UpdateDocumentRequest): Promise<Document> {
    const db = await getDatabase();
    const result = await db.collection("documents").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: "after" }
    );
    return {
      ...result.value,
      id: result.value!._id.toString(),
    };
  }

  async deleteDocument(id: string): Promise<void> {
    const db = await getDatabase();
    await db.collection("documents").deleteOne({
      _id: new ObjectId(id),
    });
  }
}

export const storage = new MongoStorage();
