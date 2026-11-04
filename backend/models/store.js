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



export class storeModel {
  static async buySkin({ userId, skinId, coin, price }) {

    //Agregar una nueva Skin a un usuario:

    const hoy = new Date();

    usersCollection.updateOne(
      { id: userId },
      { $push: { skins: { id: skinId, purchaseDate: hoy } } },
    );

    coin == "BE" &&
      usersCollection.updateOne({ id: userId }, { $inc: { BE: -price } });
    coin == "RP" &&
      usersCollection.updateOne({ id: userId }, { $inc: { RP: -price } });

    return { id: skinId, purchaseDate: hoy };
  }
  static async buyChampion({ userId, championId, coin, price }) {

    //Agregar un nuevo Campeón a un usuario:

    usersCollection.updateOne(
      { id: userId },
      { $push: { champions: { id: championId } } },
    );
    coin == "BE" &&
      usersCollection.updateOne({ id: userId }, { $inc: { BE: -price } });
    coin == "RP" &&
      usersCollection.updateOne({ id: userId }, { $inc: { RP: -price } });

    return { id: championId };
  }
}
