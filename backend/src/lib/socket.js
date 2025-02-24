import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

export function getRecieverSocketId(userId){

    return userSocketMap[userId];

}

const userSocketMap = {};

io.on("connection", (socket) => { // Fixed typo here
    console.log("User connected", socket.id);

    const userId = socket.handshake.query.userId;

    if(userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers" ,Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers" , Object.keys(userSocketMap));
    });
});

