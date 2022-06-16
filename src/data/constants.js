const path = require("path");

const uploadsPath = path.resolve(__dirname, "..", "..", "uploads");
const templatesPath = path.resolve(__dirname, "..", "templates");
const staticEndpoint = "/public";

module.exports = { uploadsPath, staticEndpoint, templatesPath };
