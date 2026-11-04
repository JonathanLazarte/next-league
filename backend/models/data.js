import { require } from "../utils.js";
import fs from "node:fs";
import mongoose from "mongoose";
//import { v4 as uuidv4 } from 'uuid';
const { MongoClient, ServerApiVersion } = require("mongodb");
const { v4: uuidv4 } = require("uuid");


const url =
  "mongodb+srv://theshakadevirgo:JohnShaka151515@leagueoflegendsclone.dwigeek.mongodb.net/?appName=LeagueOfLegendsClone";
const localurl = "mongodb://localhost:27017/";
const clusterUrl =
  "mongodb+srv://LazarteJonathan:Jonii1543104@mycluster.orto15k.mongodb.net/?appName=MyCluster";

const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dataBase = client.db("LeagueOfLegendsInterface");
const usersCollection = dataBase.collection("users");

//await growthCollection.insertMany(growthRates)

/*mongoose.connect(uri);
const userSchema = new mongoose.Schema({
	name: String,
	password: String,
})
const User = mongoose.model('user', userSchema);
const newUser = new User({
	name: "Jonathan Lazarte",
	password: "Jonii1543104",
})
newUser.save().then(data => console.log(data))
*/

export class dataModel {

  static async getChamps() {
    const champs = await require("././data/champion.json");
    return champs.data;
  }

  static async getChampionFull() {
    const champ = await require("././data/championFull.json");
    return champ.data;
  }

  static async getSkins() {
    const skins = await require("././data/skins_flat.json");
    return skins;
  }
}
