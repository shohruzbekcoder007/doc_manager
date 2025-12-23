import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.documents.list.path, async (req, res) => {
    const docs = await storage.getDocuments();
    res.json(docs);
  });

  app.get(api.documents.get.path, async (req, res) => {
    const doc = await storage.getDocument(Number(req.params.id));
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(doc);
  });

  app.post(api.documents.create.path, async (req, res) => {
    try {
      const input = api.documents.create.input.parse(req.body);
      const doc = await storage.createDocument(input);
      res.status(201).json(doc);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.documents.update.path, async (req, res) => {
    try {
      const input = api.documents.update.input.parse(req.body);
      const existing = await storage.getDocument(Number(req.params.id));
      if (!existing) {
        return res.status(404).json({ message: 'Document not found' });
      }
      const doc = await storage.updateDocument(Number(req.params.id), input);
      res.json(doc);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.documents.delete.path, async (req, res) => {
    const existing = await storage.getDocument(Number(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Document not found' });
    }
    await storage.deleteDocument(Number(req.params.id));
    res.status(204).send();
  });

  // Seed data
  const existingDocs = await storage.getDocuments();
  if (existingDocs.length === 0) {
    await storage.createDocument({
      title: "Welcome to Docs",
      content: "# Welcome\n\nThis is your new documentation site. You can edit this page or create new ones.",
      category: "Getting Started",
      order: 0
    });
    await storage.createDocument({
      title: "Installation",
      content: "# Installation\n\nRun `npm install` to get started.",
      category: "Getting Started",
      order: 1
    });
  }

  return httpServer;
}
