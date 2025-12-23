import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI && !process.env.DATABASE_URL) {
  throw new Error(
    "MONGODB_URI or DATABASE_URL must be set. Did you forget to provide a MongoDB connection string?",
  );
}

const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;
let cachedClient: MongoClient | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri as string);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function getDatabase() {
  const client = await getMongoClient();
  return client.db("docsapp");
}
