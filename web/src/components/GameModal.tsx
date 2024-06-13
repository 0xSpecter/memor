"use client"
import { createRoom, exists } from "@/api"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { uuid } from "uuidv4"

export default function GameModal({ isDraggable, mode, nickname }) {
    const [onlineType, setOnlineType] = useState(true) // true for join, false for create
    const [roomCode, setRoomCode] = useState("")
    
    const [playerCount, setPlayerCount] = useState(2)
    const [roomName, setRoomName] = useState("")

    async function handleNewRoom() {
        if (roomName.length === 0) {
            alert("Room name cannot be empty")
            return
        }

        if (localStorage.getItem("user_id") === null) {
            localStorage.setItem("user_id", uuid())
        }

        createRoom(
            playerCount, 
            roomName
        )
            .then(res => res.text())
            .then(roomCode => window.location.href = `/room/${roomCode}`)

            .catch(err => {
                alert(err)
            })
    }
    
    return (
        <>
            { !isDraggable && (mode === "local" ?
                <motion.div className="absolute bottom-20 right-40 w-2/5 h-2/5 shadow-2xl rounded-md z-30 ring-2 ring-black/5 backdrop-blur-xl bg-white/0 hue-rotate-[10deg] p-5 text-xl font-semibold"
                    initial={{ y: 300, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut"}}
                >
                    <div>localplay</div>
                </motion.div>
            : mode === "online" &&
                <motion.div className="absolute bottom-20 left-40 w-2/5 h-2/5 shadow-2xl rounded-md z-30 ring-2 ring-black/5 backdrop-blur-xl bg-white/0 hue-rotate-[10deg] p-5 text-xl font-semibold"
                    initial={{ y: 300, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut"}}
                >
                    <div className="w-full h-1/3 flex items-center justify-around">
                        <motion.button className="text-4xl ring-4 ring-white px-2 py-5 rounded-md w-1/3 "
                            onClick={() => setOnlineType(true)}
                            style={{ background: onlineType ? "rgba(255, 255, 255, 0.2)" : "transparent" }}
                        >
                            JOIN
                        </motion.button>

                        <motion.button className="text-4xl ring-4 ring-white px-2 py-5 rounded-md w-1/3 "
                            onClick={() => setOnlineType(false)}
                            style={{ background: !onlineType ? "rgba(255, 255, 255, 0.2)" : "transparent" }}
                        >
                            CREATE
                        </motion.button>
                    </div>

                    { onlineType ?
                        <div className="relative w-full h-2/3 px-2 flex items-center justify-around">
                            <div className="flex flex-row gap-2 items-center justify-center">
                                <span> Room Code </span>
                                <input className="outline-none bg-white/20 text-center rounded-md py-2 px-1 w-1/3" 
                                    type="text"
                                    value={roomCode}
                                    onChange={e => e.target.value.length < 5 && setRoomCode(e.target.value.toUpperCase())}
                                />
                                <AnimatePresence>
                                    <motion.button className="relative text-2xl ring-2 ring-white p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => {
                                            if (roomCode.length !== 4) {
                                                alert("Room code must be 4 characters")
                                                return 
                                            }

                                            exists(roomCode)
                                                .then(res => res.json())
                                                .then(res => {
                                                    if (!res.exists) {
                                                        alert("Room does not exist")
                                                        return
                                                    }
                                                    if (res.full) {
                                                        alert("Room is full")
                                                        return
                                                    }
                                                    window.location.href = `/room/${roomCode}`
                                                })
                                        }}

                                        disabled={nickname.length === 0 || roomCode.length !== 4}
                                    >
                                        JOIN
                                    </motion.button>
                                </AnimatePresence>
                            </div> 
                        </div>
                    :
                        <div className="relative w-full h-2/3 px-2 flex flex-col items-start justify-around">
                            <div className="flex flex-col gap-2 items-center justify-center px-10">
                                <div className="flex flex-row gap-2 items-center jusitfy-center">
                                    <span>
                                        Player Count
                                    </span>
                                    <input className="outline-none bg-white/20 text-center rounded-md py-2 px-1 w-20" 
                                        type="number"
                                        value={playerCount}
                                        onChange={e => {
                                            let val = parseInt(e.target.value)

                                            if (val > 8) val = 8
                                            else if (val < 2) val = 2

                                            setPlayerCount(val)
                                        }}/>
                                </div>

                                <div className="flex flex-row gap-2 items-center jusitfy-center">
                                    <span>
                                        Room name
                                    </span>
                                    <input className="outline-none bg-white/20 text-center rounded-md py-2 px-1 w-1/2" 
                                        type="text"
                                        value={roomName}
                                        onChange={e => setRoomName(e.target.value)}/>
                                </div>

                                <motion.button className="relative text-2xl ring-2 ring-white p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => handleNewRoom()}
                                    >
                                        CREATE
                                </motion.button>
                            </div> 
                        </div>
                    }
                </motion.div>
            )}
        </>
    )
}