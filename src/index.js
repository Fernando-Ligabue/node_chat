const path = require ('path')
const http = require ('http')
const express = require('express')
const socketIo = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//configurações express
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir))

io.on('connection', socket => {

    socket.on("chatMessage", (message, callback)=>{
        console.log(message);
        setTimeout(()=>{
            callback()
        }, 2000)
    });
    
});

server.listen(3000, () => console.log('server is running on: http://localhost:3000'));