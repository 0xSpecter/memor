"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { uuid } from "uuidv4";


export default function Page({ params }) {
    const room_id = useMemo(() => params.room, [params.room])

    const [nickname, setNickname] = useState("")

    useEffect(() => {
        if (localStorage.getItem("nickname") !== null && localStorage.getItem("user_id") !== null) {
            window.location.href = `/room/${room_id}`
            return
        }
    }, [])

    function goBack() {
        localStorage.setItem("user_id", uuid())
        localStorage.setItem("nickname", nickname)
        window.location.href = `/room/${room_id}`
    }

    return (
        <main className="relative w-screen h-screen text-white bg-zinc-900 rounded-md flex flex-col lg:flex-row items-center justify-evenly text-4xl font-bold">
                <div className="">Enter a nickname</div>
                <input className="text-black rounded-md outline-none bg-white/80 px-2 py-2"
                    placeholder="Nickname"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                />
                <button className=""
                    onClick={goBack}

                    disabled={nickname.length === 0}
                >
                    Submit
                </button>
        </main>
    );
}


