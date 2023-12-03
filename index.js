const express = require("express");
const http = require("http");
const { PrismaClient } = require("@prisma/client");
const PORT = process.env.PORT || 3000;
require("dotenv").config();

const admin = require("./controller/adminController");
const service = require("./controller/servicesController");
const contact = require("./controller/contactController");
const content = require("./controller/contentController");

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

async function syncRoutes() {
  try {
    if (admin && content && contact && service) {
      console.log("routes synced successfully!");
    }
  } catch (error) {
    console.error("Error syncing routes:", error);
  }
}

syncRoutes();
connectToDb();
async function listControllers() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("Server started running on: " + " " + "http://localhost:" + PORT);
});
