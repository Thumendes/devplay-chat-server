const { Server } = require("socket.io");
const MessageRepository = require("./repository/MessageRepository");
const RoomRepository = require("./repository/RoomRepository");
const UserRepository = require("./repository/UserRepository");
const Logger = require("./utils/logger");

function createSocketServer(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    Logger.info("Nova conexão criada!", socket.id);

    const userState = new Map();

    socket.on("join-room", async ({ user, room: roomCode }, callback) => {
      Logger.info("Joining room", user, roomCode);

      const userRoom = userState.get("room");
      if (userRoom) {
        if (userRoom.code === roomCode) return callback({ room: userRoom });

        socket.leave(userRoom.code);
      }

      try {
        const room = await UserRepository.findUserRoom(user.id, roomCode);
        if (!room) {
          Logger.error("Room not found", room);
          return callback({ error: "Room not found" });
        }

        socket.join(room.code);
        socket.to(room.code).emit("user-joined", user);
        userState.set("room", room);

        return callback({ room });
      } catch (error) {
        Logger.error("Error joining room", error);
        return callback({ error: "Error joining room" });
      }
    });

    socket.on("send-message", async ({ user, room, message }, callback) => {
      const newMessage = await MessageRepository.create({
        content: message,
        roomCode: room,
        userId: user,
      });

      Logger.info(`Sending to "${room}"`), newMessage;
      socket.to(room).emit("receive-message", newMessage);

      return callback({ message: newMessage });
    });

    socket.on("leave-room", ({ user, room }) => {
      socket.leave(room);
      socket.to(room).emit("user-left", user);
    });

    socket.on("disconnect", () => {
      console.log("Conexão finalizada!", socket.id);
    });
  });
}

module.exports = createSocketServer;
