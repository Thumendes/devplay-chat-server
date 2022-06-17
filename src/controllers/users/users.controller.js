const UserRepository = require("../../repository/UserRepository");
const { staticEndpoint } = require("../../data/constants");
const { getFullUrl } = require("../../utils/general");
const Logger = require("../../utils/logger");
const JwtService = require("../../services/jwt");

const UsersController = {
  async findAll(req, res) {
    const users = await UserRepository.findAll();

    return res.json(users);
  },

  async findOne({ params }, res) {
    const user = await UserRepository.findOne(params.id);

    return res.json(user);
  },

  async create({ body }, res) {
    try {
      const user = await UserRepository.create(body);

      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async register(req, res) {
    const { body } = req;

    try {
      const { origin, ...userData } = body;
      const user = await UserRepository.register(userData, origin);

      return res.json({ user });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async confirmRegister(req, res) {
    const { body } = req;

    try {
      const user = await UserRepository.confirmRegister(body.email, body.code);
      const token = await UserRepository.createAuthToken(user.id);

      return res.json({ user, token });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async login({ body }, res) {
    try {
      Logger.info("Login:", body);
      const { user, token } = await UserRepository.login(body);

      return res.json({ user, token });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async forgetPassword({ body }, res) {
    try {
      await UserRepository.requestResetPasswordToken(body.email, body.origin);

      return res.sendStatus(200);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async resetPassword({ body }, res) {
    try {
      await UserRepository.confirmResetPassword(body);

      return res.sendStatus(200);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async me(req, res) {
    const token = JwtService.getFromHeader(req);

    try {
      Logger.info("Me:", token);
      const user = await UserRepository.me(token);

      return res.json({ user });
    } catch (error) {
      Logger.error(error.message, error);
      return res.status(400).json({ error: error.message });
    }
  },

  async update({ body, params }, res) {
    try {
      const user = await UserRepository.update(params.id, body);

      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async delete({ params }, res) {
    try {
      const user = await UserRepository.delete(params.id);

      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async findUserRooms({ params, query }, res) {
    const { filter } = query;
    const rooms = await UserRepository.findUserRooms(params.id, filter);

    return res.json(rooms);
  },

  async join({ params }, res) {
    try {
      await UserRepository.addUserToRoom(params.id, params.code);

      return res.sendStatus(200);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async avatar(req, res) {
    const {
      params: { id },
      file,
    } = req;

    const url = getFullUrl(req);
    const avatar = `${url}${staticEndpoint}/${file.filename}`;
    const user = await UserRepository.update(id, { avatar });

    return res.json({ user });
  },

  async changePassword(req, res) {
    const { body, params } = req;

    try {
      const user = await UserRepository.changePassword(params.id, body);

      return res.json({ user });
    } catch (error) {
      Logger.error(error.message, error);
      return res.status(400).json({ error: error.message });
    }
  },
};

module.exports = UsersController;
