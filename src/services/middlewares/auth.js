const JwtService = require("../jwt");
const Logger = require("../../utils/logger");
const UserRepository = require("../../repository/UserRepository");

function authMiddleware() {
  return async (req, res, next) => {
    const token = JwtService.getFromHeader(req);

    try {
      const user = await UserRepository.me(token);
      if (!user) return res.status(401).json({ logout: true });

      Logger.info("User:", user.id);
      req.user = user;
      next();
    } catch (error) {
      Logger.error(error.message, error);
      return res.status(400).json({ error: error.message });
    }
  };
}

module.exports = authMiddleware;
