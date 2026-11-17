import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI must be configured before starting the API.");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const database = client.db(
  process.env.MONGODB_DB_NAME ?? "LeagueOfLegendsInterface",
);

export async function connectDatabase() {
  await client.connect();
  await database.command({ ping: 1 });
  await Promise.all([
    database.collection("connections").createIndex({ ip: 1 }, { unique: true }),
    database.collection("connections").createIndex({ lastSeen: -1 }),
  ]);
}
