import { Socket } from "socket.io";
import http from "http";
import express from 'express';
import { Server } from 'socket.io';
import { UserManager } from "./managers/UserManger";

const app = express();
const server = http.createServer(http);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const userManager = new UserManager();

io.on("connection", (socket: Socket) => {
  const gender = socket.handshake.query.gender as string; // Retrieve gender from query
  console.log("A user connected with gender:", gender);

  userManager.addUser("randomName", socket, "male");

  socket.on("disconnect", () => {
    console.log("User disconnected");
    userManager.removeUser(socket.id, gender);
  });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});