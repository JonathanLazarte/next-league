import { database } from "../db.js";

const dataBase = database;
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
