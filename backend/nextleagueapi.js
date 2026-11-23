import express from "express";
import { userRouter } from "./routes/user.js";
import { authRouter } from "./routes/auth.js";
import { storeRouter } from "./routes/store.js";
import { dataRouter } from "./routes/data.js";
import { connectionRouter } from "./routes/connection.js"
import { corsMiddleware } from "./middlewares/cors.js";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { v4 as uuidv4 } from "uuid";
import { connectDatabase, client } from "./db.js";
import { v4 as uuid } from 'uuid'

const app = express();
app.use(corsMiddleware());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://next-league-client.vercel.app", "https://next-league.vercel.app", "http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
  connectionStateRecovery: {},
});

async function run() {
  try {
    await connectDatabase();
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (error) {
    throw new Error( error || "No se pudo conectar a la base de datos" );
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.use(logger("dev"));
app.use(express.json());
app.use("/api/v1/data", dataRouter);
app.use("/api/v1/store", storeRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/connection", connectionRouter);

app.get(["/health", "/api/v1/health"], (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime(), timestamp: Date.now() });
});

const adminUser = {
  alias: "Jonathan Lazarte",
  tag: "LAS",
  title: "Dev",
  status: "offline",
  messages: [],
  level: 1,
  rank: {
    name: "Gold",
    level: 2,
    points: 1000,
  },
  profile_icon: "6668",
  profile_background: "Shen_49",
  profile_border: 7,
  id: "mockedid",
};
const connectedUsers = [adminUser];
const usersChat = [];
const rooms = {};
const activeQueues = [];

const isValidToken = (token) => {
  return true;
};

// Middleware de autenticación
/*io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (isValidToken(token)) {
    // Si es válido, permitimos la conexión
    next();
  } else {
    // Si no es válido, rechazamos la conexión con un error
    const err = new Error("No autorizado");
    err.data = { content: "Por favor, inicia sesión de nuevo" };
    next(err);
  }
});*/

io.on("connection", (socket) => {
  const dataBase = client.db("LeagueOfLegendsInterface");
  const usersCollection = dataBase.collection("users");
  const userToken = socket.handshake.auth.token;

  const authenticate = async () => {
    const isAlreadyLogged = connectedUsers.findIndex(
      (connectedUser) => connectedUser.id === userToken,
    );

    const userData = await usersCollection.findOne({
      id: userToken,
    });

    if (isAlreadyLogged == 1 || !userData) {
      return;
    }

    const {
      alias,
      tag,
      title,
      level,
      rank,
      profile_icon,
      profile_background,
      status,
      id,
    } = userData;
    const newConnectedUser = {
      socketId: socket.id,
      alias,
      tag,
      title,
      level,
      rank,
      profile_icon,
      profile_background,
      status,
      id,
    };
    connectedUsers.push(newConnectedUser);

    io.emit("user-list", connectedUsers);
  };
  userToken && authenticate();

  socket.on("chat-message", (msg) => {
    const foundUser = connectedUsers.find((cu) => cu.alias == msg.to);
    usersChat.push(msg);
    usersCollection.updateMany(
      { alias: { $in: [foundUser?.alias, msg.from] } }, // Filtro para seleccionar múltiples usuarios
      { $push: { messages: msg } }, // Operación para añadir el mensaje a cada usuario
    );
    io.to([foundUser?.socketId]).emit("chat-message", msg);
  });
  socket.on('party:create', ({ queue }) => {
    const newId = uuid()
    const ownUser = connectedUsers.find(cu => cu.socketId === socket.id)

    socket.join(newId)

    rooms[newId] = {
      queue,
      members: [ownUser],
    }

    socket.emit('party:set', {
      partyId: newId,
      queue,
      partyOwner: ownUser
    })
  })
  socket.on("party:join", (msg) => {
    const { roomId } = msg
    const existingRooms = Object.keys(rooms).filter((room) =>
      rooms[room].includes(socket.id),
    );
    if (existingRooms.length > 0) {
      console.log("error", "Ya estás en una sala");
      return;
    }
    socket.join(roomId);
    socket.data.partyId = partyId;

    rooms[roomId] = rooms[roomId] || [];
    rooms[roomId].members.push(socket.id);
    const userJoined = connectedUsers.find((cu) => cu.socketID == socket.id);

    io.to(roomId).emit("USER JOINED", {
      room: rooms[roomId],
      roomId: roomId,
      userJoined,
    });

  });
  socket.on("party:leave", () => {
    /*const existingRoom = Object.keys(rooms).filter((room) =>
      rooms[room].members.some(m => socket.id === m.socketId),
    );
    const indexInRoom = rooms[existingRoom]?.members.findIndex(
      (stringindex) => stringindex == socket.id,
    );
    rooms[existingRoom]?.members.splice(indexInRoom, 1);
    const newRoom = rooms[existingRoom];*/
    const partyId = socket.data.partyId;
    if (!partyId || rooms[partyId]) return

    const playerIndex = rooms[partyId]?.members.findIndex(
      (stringindex) => stringindex == socket.id,
    );

    io.to(partyId).emit("party:player-left", { player: rooms[partyId].members[playerIndex] });

    rooms[partyId].members.splice(playerIndex, 1);
    socket.leave(partyId)
    delete socket.data.partyId

    if (rooms[partyId].members.lenght === 0) {
      delete rooms[partyId]
    }

  });

  socket.on("disconnect", () => {
    // Eliminamos al usuario cuando se desconecta
    const newConnectedUsers = connectedUsers.findIndex(
      (user) => user.socketId == socket.id,
    );
    newConnectedUsers != -1 && connectedUsers.splice(newConnectedUsers, 1);
    io.emit("user-list", connectedUsers);
    socket.leave();

    const existingRooms = Object.keys(rooms).filter((room) =>
      rooms[room].members.includes(socket.id),
    );
    //const roomIndexInRooms = rooms[existingRooms].findIndex(existingRooms)
    const indexInRoom = rooms[existingRooms]?.findIndex(
      (stringindex) => stringindex == socket.id,
    );
    rooms[existingRooms]?.splice(indexInRoom, 1);
    const newRoom = rooms[existingRooms];
    //console.log("room: " + rooms[existingRooms])
    //console.log("newroom: " + newRoom)
    io.to(existingRooms).emit("USER-OUT", { newRoom });

    const imAlreadyInQueque = activeQueues.findIndex((q) => q.id == socket.id);
    activeQueues.splice(imAlreadyInQueque, 1);
    imAlreadyInQueque != -1
      ? console.log("has sido desplazado del index: " + imAlreadyInQueque)
      : "No estabas en una cola";
  });

  /*socket.on("find-opponent", (msg) => {
    const imAlreadyInQueque = activeQueues.find((q) => q.id == socket.id);
    imAlreadyInQueque
      ? console.log("Ya estas en una cola")
      : activeQueues.push({ id: socket.id });
    if (activeQueues.length >= 2) {
      const roomId = uuidv4();
      io.to([socket.id, activeQueues[0].id]).emit("find-opponent", {
        roomId: roomId,
      });
      const playerIndex = activeQueues.findIndex((player) => player.id == socket.id);
      activeQueues.splice(playerIndex, 1);
      activeQueues.splice(0, 1);
      //io.to(queque[0]).emit('find-opponent', {roomId})
    } else {
      console.log("Has entrado en la cola");
    }
  });*/

  socket.on('queue:start', ({ partyId }) => {
    const queueData = {
      startedAt: Date.now(),
      estimatedTime: 45
    };

    activeQueues.push({ partyId, queueData })


    io.to(partyId).emit('queue:updated', {
      status: 'searching',
      ...queueData,
    })
  })

  socket.on('queue:cancel', ({ partyId }) => {
    const queueIndex = activeQueues.findIndex(aq => aq.partyId === partyId);
    activeQueues.splice(1, queueIndex)
    io.to(partyId).emit('queue:updated', { status: 'idle', startedAt: null, estimatedTime: null });
  })


});

const PORT = process.env.PORT ?? 3050;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
