import { require } from "../utils.js";
const { MongoClient, ServerApiVersion } = require('mongodb')

const url = "mongodb+srv://theshakadevirgo:JohnShaka151515@leagueoflegendsclone.dwigeek.mongodb.net/?appName=LeagueOfLegendsClone"
const client = new MongoClient(url, {
  ServerApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

const database = client.db('LeagueOfLegendsInterface')
const logsCollection = database.collection('logs')

export class connectionModel {
  static async log({ ip, path }) {
    await logsCollection.insertOne({
      ip,
      path
    })
  }
}
