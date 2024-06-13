"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";


export default function Page({ params }) {
    const [socket, setSocket] = useState(null)
    const room_id = useMemo(() => params.room, [params.room])
    const [room, setRoom] = useState(null)

    useEffect(() => {
        const socket = io("http://localhost:8000")
        setSocket(socket)

        if (localStorage.getItem("user_id") === null || localStorage.getItem("nickname") === null) window.location.href = `/room/${room_id}/notreged`
    }, [])

    useEffect(() => {
        if (!socket) return
        if (room_id.length !== 4) { window.location.href = `/error?message=${room_id}+is+not+a+room+code`; return }
        fetch(`http://localhost:8000/status/${room_id}`)
            .then(res => res.json())
            .then(status => {
                if (!status.exists) { window.location.href = `/error?message=Room+${room_id}+does+not+exist`; return }
                if (status.full) { window.location.href = `/error?message=Room+${room_id}+is+full`; return }

                if (localStorage.getItem("user_id") === null || localStorage.getItem("nickname") === null) {
                    window.location.href = `/room/${room_id}/notreged`
                    return
                }

                socket.emit("join", {
                    room_id: room_id,
                    identity: [localStorage.getItem("nickname"), localStorage.getItem("user_id")],
                })
        
                socket.on("update", data => {
                    console.log(data)
                    setRoom(data)
                })
            })
            
    }, [socket, room_id])

    return (
        <main className="relative w-screen h-screen text-white bg-zinc-900 rounded-md flex flex-row items-center justify-around">
            <span className="absolute  text-4xl font-bold"
                onClick={() => {
                    fetch(`http://localhost:8000/update/${room_id}`)
                }}
            >
                {
                    room && room.name
                }
                { room &&
                    room.users.map(item => <div key={item[1]}>{item[0]}</div>)
                }
            </span>
        </main>
    );
}


