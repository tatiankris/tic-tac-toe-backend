const express = require('express')
const dotenv = require('dotenv')
const socket = require('socket.io');
dotenv.config()

const PORT = 5000;
const INDEX = '/index.html';

const app = express()
const server = app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}...`));

app.use((_req, res) => res.sendFile(INDEX, { root: __dirname }))

const io = socket(server, {
    cors: {
        origin: 'https://tic-tac-toe-client-sigma.vercel.app'
    }
});

io.on('connection', (socket) => {
    socket.on('reqTurn', (data) => {
        const room = JSON.parse(data).room
        io.to(room).emit('playerTurn', data)
    })

    socket.on('create', room => {
        socket.join(room)
    })

    socket.on('join', room => {
        socket.join(room)
        io.to(room).emit('opponent_joined')
    })

    socket.on('reqRestart', (data) => {
        const room = JSON.parse(data).room
        io.to(room).emit('restart')
    })
});

