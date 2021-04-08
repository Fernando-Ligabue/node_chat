const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app);
const io = socketIO(server);

//express config
const publicDir = path.join(__dirname, '../public')
app.use(express.static(publicDir))

let users = []

io.on('connection', socket => {

    // login
    socket.on('join', (data, callback) => {

        console.log(socket.id)

        const user = { id: socket.id, username: data.username, room: data.room }
        const room = user.room

        users.push(user)
        socket.join(room)
        socket.emit("chatMessage", { username: "Flag", message: "Bem vindo ao chat!" })
        socket.broadcast.to(room).emit("chatMessage", { username: "Flag", message: `${user.username} juntou-se ao grupo!` })

        //enviar nova lista de utilizadores
        io.to(room).emit("roomUsers", { room, users: users.filter(user => user.room == room) })
        callback()
    })

    socket.on("chatMessage", (message, callback) => {
        const user = users.find(user => user.id == socket.id)
        //socket.broadcast.to(user.room).emit("chatMessage", {username: user.username, message})
        io.to(user.room).emit("chatMessage", { username: user.username, message })
        callback()
    });

    socket.on("disconnect", () => {
        console.log("disconnet --> " + socket.id)
        const user = users.find(user => user.id == socket.id)
        if (user) {
            const room = user.room
            users = users.filter(user => user.id !== socket.id)
            io.to(room).emit("chatMessage", { username: "Flag", message: `${user.username} saíu grupo!` })
            io.to(room).emit("roomUsers", { room, users: users.filter(user => user.room == room) })
        }
    })

});

server.listen(3000, () => console.log(`server is running on: http://localhost:3000`));