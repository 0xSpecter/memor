import { io } from "socket.io-client";


export async function createRoom(playerCount : number, roomName : string) {
    return fetch("http://localhost:8000/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            playerCount: playerCount,
            roomName: roomName,
        })
    })
}

export async function exists(roomCode : string) {
    return fetch(`http://localhost:8000/status/${roomCode}`)
}
