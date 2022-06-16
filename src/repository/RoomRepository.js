const prisma = require("../services/database");
const { createRandomCode } = require("../utils/general");

const RoomRepository = {
  async findAll() {
    return await prisma.room.findMany();
  },

  async findOne(id) {
    return await prisma.room.findFirst({ where: { id } });
  },

  async findByCode(code) {
    return await prisma.room.findFirst({ where: { code } });
  },

  async create(data) {
    if (!data.name) throw new Error("Nome é obrigatório!");

    // Create unique code
    while (true) {
      data.code = createRandomCode().numbers().lowerLetters().generate(6);
      const room = await prisma.room.findFirst({ where: { code: data.code } });
      if (!room) break;
    }

    return await prisma.room.create({ data });
  },

  async update(id, data) {
    return await prisma.room.update({ where: { id }, data });
  },

  async delete(id) {
    return await prisma.room.delete({ where: { id } });
  },

  async findRoomUsers(id) {
    const users = await prisma.user.findMany({
      where: { rooms: { some: { roomId: id } } },
    });

    return users;
  },

  async findRoomMessagesByCode(code) {
    const messages = await prisma.message.findMany({
      where: { room: { code } },
      include: { user: { select: { id: true, avatar: true, name: true } } },
    });

    return messages;
  },
};

module.exports = RoomRepository;
