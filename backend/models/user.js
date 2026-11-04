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



export class userModel {


  static async getUserData({ token }) {
    //const foundUser = usersDB.find(user => user.userName == body.userName && user.password == body.password)
    const user = await usersCollection.findOne(
      { id: token }, // Filtro: busca el usuario por su ID
      { projection: { pokemon: 0, items: 0 } }, // Proyección: excluye 'pokemon'
    );
    if (user) {
      return user;
    } else {
      return { message: "Usuario no encontrado" };
    }
  }

  static async getAllOwned({ id }) {
    const result = await usersCollection.findOne(
      { id: id }, // Filtro: busca el usuario por su ID
      { projection: { champions: 1, _id: 0 } }, // Proyección: trae solo 'pokemon'
    );
    const championsOwneds = result?.champions;

    return championsOwneds;
  }


  static async getUserSkins({ userID }) {
    const userData = await usersCollection.findOne(
      { id: userID },
      { projection: { skins: 1, _id: 0 } },
    );
    if (userData) {
      return userData.skins
        ? userData.skins
        : { error: "El usuario aun no cuenta con items" };
    } else {
      return { error: "No se ha encontrado el usuario" };
    }
  }

  static async saveSettings({ userId, settings }) {
    let result = await usersCollection.updateOne(
      { id: userId },
      { $set: { settings } },
    );

    return result;
  }
}
