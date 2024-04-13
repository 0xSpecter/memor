"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";


export default function Page({ params }) {
    const [socket, setSocket] = useState(null)
    const room = useMemo(() => params.room, [params.room])

    useEffect(() => {
        const socket = io("http://localhost:8000")
        setSocket(socket)
    }, [])

    useEffect(() => {
        if (!socket) return

        socket.emit("join", room)

        socket.on("update", data => {
            console.log(data)
        })
    }, [socket, room])

    return (
        <main className="relative w-screen h-screen text-white bg-zinc-900 rounded-md flex flex-row items-center justify-around">
            <span className="absolute  text-4xl font-bold"
                onClick={() => {
                    fetch(`http://localhost:8000/update/${room}`)
                }}
            >
                You are in room: {room}
            </span>
        </main>
    );
}


