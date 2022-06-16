const { Router } = require("express");

const roomsRouter = require("./controllers/rooms/rooms.routes");
const usersRouter = require("./controllers/users/users.routes");

const route = Router();

route.use("/users", usersRouter);
route.use("/rooms", roomsRouter);

module.exports = route;
