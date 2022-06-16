const RoomRepository = require("../../repository/RoomRepository");

const RoomsController = {
  async findAll(req, res) {
    const rooms = await RoomRepository.findAll();

    return res.json(rooms);
  },

  async findOne({ params }, res) {
    const room = await RoomRepository.findOne(params.id);

    return res.json(room);
  },

  async create({ body }, res) {
    try {
      const room = await RoomRepository.create(body);

      return res.json({ room });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async update({ params, body }, res) {
    try {
      const room = await RoomRepository.update(params.id, body);

      return res.json({ room });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async delete({ params }, res) {
    try {
      const room = await RoomRepository.delete(params.id);

      return res.json({ room });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async findRoomMessagesByCode({ params }, res) {
    const messages = await RoomRepository.findRoomMessagesByCode(params.code);

    return res.json(messages);
  },

  async findRoomUsers({ params }, res) {
    const users = await RoomRepository.findRoomUsers(params.id);

    return users;
  },
};

module.exports = RoomsController;
