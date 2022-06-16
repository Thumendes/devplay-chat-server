const jwt = require("jsonwebtoken");

const JwtService = {
  async sign(payload) {
    const token = jwt.sign(payload, process.env.SECRET_KEY);

    return token;
  },

  async verify(token) {
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    return payload;
  },

  getFromHeader(req) {
    const authorization = req.headers.authorization || "";
    const [scheme, token] = authorization.split(" ");

    return token;
  },
};

module.exports = JwtService;
