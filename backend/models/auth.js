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


export class authModel {
  static async registerUser({ body }) {
    const foundUser = await usersCollection.findOne({
      userName: body.userName,
    });

    if (foundUser) {
      return {
        sucess: false,
        error: "Usuario actualmente registrado"
      }
    }
    await usersCollection.insertOne(body);

    return {
      success: true,
      data: { user: body, token: body.id }
    };
  }

  static async loginUser({ body }) {
    //const foundUser = usersDB.find(user => user.userName == body.userName && user.password == body.password)
    const user = await usersCollection.findOne(
      { userName: body.userName },
      { projection: { pokemon: 0, items: 0 } },
    );
    const { userName: username, password } = body;

    // Buscar usuario en la base de datos
    if (!user) {
      return {
        success: false,
        error:
          "tus credenciales de inicio de sesión no coinciden con una cuenta en nuestro sistema",
      };
    }
    const verifyPassword = (inputPassword, userPassword) =>
      inputPassword === userPassword;
    // Verificar contraseña
    const isPasswordValid = await verifyPassword(password, user.password); // Función ficticia
    if (!isPasswordValid) {
      return {
        success: false,
        error:
          "tus credenciales de inicio de sesión no coinciden con una cuenta en nuestro sistema",
      };
    }
    const generateToken = (inputUser) => inputUser.id;
    // Si todo es correcto
    return {
      success: true,
      data: {
        user: user,
        token: generateToken(user), // mocked function para generar token
      },
    };
  }

  static async verifyToken({ token }) {
    const user = await usersCollection.findOne({ id: token }, { projection: { pokemon: 0, items: 0 } })
    if (!user) return {
      success: false,
      error: "Ningun usuario coincide con el token"
    }
    return {
      success: true,
      data: {
        user,
        token
      }
    };
  }
}
