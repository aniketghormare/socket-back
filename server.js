const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
app.use(cors())
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",     // Vite (Local)
            "https://socket-back-2.onrender.com",
            "https://your-frontend.vercel.app", // Vercel (Production)
            "https://your-backend.onrender.com" // Render (Production)
        ],
        methods: ["GET", "POST"],
    },
});


io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on("send_message", (data) => {
        const { room, message, username } = data;
        io.to(room).emit("receive_message", { message, username }); // Broadcast only to that room
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

let PORT=4000 || process.env.PORT;

server.listen(PORT, () => console.log("Server running on port 4000"));
