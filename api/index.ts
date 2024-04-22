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
    socket.on("join", room_id => {
        console.log(room_id)
        socket.join(room_id)
    })

    socket.on("disconnect", () => {
        console.log("User disconnected \nPart of rooms: " + socket.rooms.forEach(room => console.log(room)))
    })
})

app.get("/status/:room", (req, res) => {
    if (!(req.params.room in rooms)) {
        return res.send({exists: false, full: false}).status(200)
    }

    return res.send({
        exists: true,
        full: rooms[req.params.room].users.length - 1 >= rooms[req.params.room].playerCount
    }).status(200)
})

app.get("/rooms", (req, res) => {return res.send(rooms).status(200)})

app.post("/create", (req, res) => {
    const playerCount = req.body.playerCount
    const roomName = req.body.roomName
    const user_id = req.body.user_id

    const roomCode = Array.from({length: 4}, () => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join("")

    rooms[roomCode] = {
        playerCount: playerCount,
        users: [user_id],
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