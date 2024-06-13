import { Server, Socket } from "socket.io";
import { createServer } from "node:http";
import cors from "cors"
import express from "express"

const PORT = 8000;

const app = express();
app.use(cors())
app.use(express.json())
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

const rooms = {}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/doc.html")
})

io.on("connection", socket => {
    socket.on("join", player => {
        socket.join(player.room_id)
        const alreadyJoined = rooms[player.room_id].users.findIndex(user => user[1] === player.identity[1])
        if (alreadyJoined === -1) {
            rooms[player.room_id].users.push(player.identity)
        } else {
            rooms[player.room_id].users[alreadyJoined] = player.identity
        }

        socket.emit("update", rooms[player.room_id])
    })

    socket.on("disconnect", () => {
        console.log("User disconnected \nPart of rooms: " + socket.rooms.forEach(room => console.log(room)))
    })
})

app.get("/status/:room", (req, res) => {
    const room = req.params.room

    if (!(room in rooms)) {
        return res.send({exists: false, full: false}).status(200)
    }

    return res.send({
        exists: true,
        full: rooms[room].users.length - 1 >= rooms[room].playerCount,
        maxPlayers: rooms[room].playerCount,
        currentPlayers: rooms[room].users.length,
        users: rooms[room].users,
        name: rooms[room].roomName,
    }).status(200)
})

app.get("/rooms", (req, res) => {return res.send(rooms).status(200)})

app.post("/create", (req, res) => {
    const playerCount = req.body.playerCount
    const roomName = req.body.roomName

    const roomCode = Array.from({length: 4}, () => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join("")

    rooms[roomCode] = {
        playerCount: playerCount,
        users: [],
        roomName: roomName,
        gamestate: null
    }

    res.send(roomCode).status(200)
})

app.get("/update/:room", (req, res) => {
    const room = req.params.room
    io.to(room).emit("update", "pelease update you guys")
    res.send("updated").status(200)
})

app.get("/room/:room", (req, res) => {
    if (!(req.params.room in rooms)) { 
        res.send("room not found").status(404)
    } else {
        res.send(rooms[req.params.room]).status(200)
    }
})

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})