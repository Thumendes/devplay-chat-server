const chalk = require("chalk");

class Logger {
  static log(...logs) {
    console.log(...logs);
  }

  static error(...logs) {
    Logger.log(chalk.red("[ERROR]"), ...logs);
  }

  static success(...logs) {
    Logger.log(chalk.green("[SUCCESS]"), ...logs);
  }

  static warn(...logs) {
    Logger.log(chalk.yellow("[WARN]"), ...logs);
  }

  static info(...logs) {
    Logger.log(chalk.blue("[INFO]"), ...logs);
  }
}

module.exports = Logger;
