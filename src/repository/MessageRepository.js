const prisma = require("../services/database");
const Logger = require("../utils/logger");

const MessageRepository = {
  async findAll() {},

  async create(data) {
    Logger.info("Creating message", data);

    const room = await prisma.room.findFirst({
      where: { code: data.roomCode },
    });

    const newMessage = await prisma.message.create({
      data: {
        content: data.content,
        userId: data.userId,
        roomId: room.id,
      },
      select: {
        id: true,
        roomId: true,
        content: true,
        userId: true,
        user: true,
        createdAt: true,
      },
    });

    return newMessage;
  },
};

module.exports = MessageRepository;
