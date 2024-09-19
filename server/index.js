import express from 'express';
import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const port = process.env.PORT || 4000;

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_DEVELOPMENT_NGROK_URL
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_DEVELOPMENT_NGROK_URL
    }
});

let rooms = {};

io.on('connection', (socket) => {
    socket.on('join', (roomId) => {
        if (rooms[roomId]) {
            if (rooms[roomId].socketIds.length < 2) {
                rooms[roomId].socketIds.push(socket.id);
                socket.join(roomId);
                io.to(roomId).emit('2nd-user-joined', 'start');
                rooms[roomId].candidates?.forEach(candidate => {
                    socket.emit('ice', candidate);
                });
                rooms[roomId].candidates = [];
                console.log(rooms)
            }
        } else {
            rooms[roomId] = {
                socketIds: [],
                candidates: []
            };
            rooms[roomId].socketIds.push(socket.id)
            socket.join(roomId);
        }
        console.log(socket.id)
    });

    socket.on('offer', (offer, roomId) => {
        socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', (answer, roomId) => {
        socket.to(roomId).emit('answer', answer);
    });

    socket.on('iceCandidate', (candidate, roomId) => {
        if (rooms[roomId]) {
            if (rooms[roomId].socketIds.length === 2) {
                socket.to(roomId).emit('ice', candidate);
            } else {
                rooms[roomId].candidates.push(candidate);
            }
        }
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Hi from server'
    });
});

server.listen(port, () => {
    console.log('Server is running on port ' + port);
});