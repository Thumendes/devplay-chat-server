const { sleep } = require("../../utils/general");

function latencyMiddleware(ms) {
  return async (req, res, next) => {
    await sleep(ms);
    next();
  };
}

module.exports = latencyMiddleware;
