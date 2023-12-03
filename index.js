const express = require("express");
const http = require("http");
const { PrismaClient } = require("@prisma/client");
const PORT = process.env.PORT || 3000;
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

const routes = require("./routes/routes");

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.json({
    status: "running...",
    message: "docs API can be found at /api-docs",
  });
});

async function connectToDb() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

connectToDb();

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("Server started running on: " + " " + "http://localhost:" + PORT);
});
