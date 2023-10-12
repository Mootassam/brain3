import mongoose from "mongoose";
import express, { Application, Request, Response } from "express";

import cors from "cors";
import http from "http";
const app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server, {
  cors: {
    origin: "*", // Replace with the origin of your client
  },
}); // Import the Server class from socket.io
import phoneNumberRoutes from "./routes/phoneNumberRoutes";
const PORT = 8080;
const bodyParser = require("body-parser");

app.use(cors({ origin: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
// Create a new Socket.io server and attach it to your HTTP server
mongoose
  .connect("mongodb://127.0.0.1:27017/phonenumber", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server after successful database connection
    server.listen(PORT, "192.168.70.133", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB", error);
  });
// Add Socket.io event handling here
io.on("connection",  (socket) => {

});
const phoneNumberRoutesWithIO = phoneNumberRoutes(io);
app.use("/api/phone", phoneNumberRoutesWithIO);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the API");
});
