import { database } from "../db.js";

const dataBase = database;
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
