import { require } from "../utils.js";
import { database } from "../db.js";

const dataBase = database;
const usersCollection = dataBase.collection("users");

//await growthCollection.insertMany(growthRates)

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
