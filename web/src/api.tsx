import { io } from "socket.io-client";


export async function createRoom(playerCount : number, roomName : string, user_id : string) {
    console.log(playerCount, roomName, user_id)
    return fetch("http://localhost:8000/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            playerCount: playerCount,
            roomName: roomName,
            user_id: user_id
        })
    })
}

export async function exists(roomCode : string) {
    return fetch(`http://localhost:8000/status/${roomCode}`)
}
