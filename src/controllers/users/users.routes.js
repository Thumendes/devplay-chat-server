const { Router } = require("express");
const authMiddleware = require("../../services/middlewares/auth");
const { upload } = require("../../services/upload");
const UsersController = require("./users.controller");

const usersRouter = Router();

usersRouter.post("/register", UsersController.register);
usersRouter.post("/confirm-register", UsersController.confirmRegister);
usersRouter.post("/login", UsersController.login);
usersRouter.post("/forget-password", UsersController.forgetPassword);
usersRouter.post("/reset-password", UsersController.resetPassword);
usersRouter.get("/me", UsersController.me);
usersRouter.get("/", UsersController.findAll);
usersRouter.get("/:id", UsersController.findOne);
usersRouter.post("/", UsersController.create);

usersRouter.use(authMiddleware());
usersRouter.put("/:id/password", UsersController.changePassword);
usersRouter.put("/:id/avatar", upload.single("avatar"), UsersController.avatar);
usersRouter.get("/:id/rooms", UsersController.findUserRooms);
usersRouter.post("/:id/join/:code", UsersController.join);
usersRouter.put("/:id", UsersController.update);
usersRouter.delete("/:id", UsersController.delete);

module.exports = usersRouter;
