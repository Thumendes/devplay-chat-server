const { Router } = require("express");
const RoomsController = require("./rooms.controller");

const roomsRouter = Router();

roomsRouter.get("/:code/messages", RoomsController.findRoomMessagesByCode);
roomsRouter.get("/:id/users", RoomsController.findRoomUsers);
roomsRouter.get("/", RoomsController.findAll);
roomsRouter.get("/:id", RoomsController.findOne);
roomsRouter.post("/", RoomsController.create);
roomsRouter.put("/:id", RoomsController.update);
roomsRouter.delete("/:id", RoomsController.delete);

module.exports = roomsRouter;
