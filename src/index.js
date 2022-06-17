require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const createSocketServer = require("./socket");
const route = require("./routes");
const prisma = require("./services/database");
const { staticEndpoint, uploadsPath } = require("./data/constants");
const latencyMiddleware = require("./services/middlewares/latency");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(latencyMiddleware(500));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(route);
app.use(staticEndpoint, express.static(uploadsPath));

createSocketServer(server);

server.listen(port, async () => {
  await prisma.$connect();
  console.log(`Server is running on port ${port}`);
});
