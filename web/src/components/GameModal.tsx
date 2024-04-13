"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export default function GameModal({ isDraggable, mode }) {
    const [onlineType, setOnlineType] = useState(true)
    const [roomCode, setRoomCode] = useState("")
    
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
                                    onChange={e => e.target.value.length < 5 && setRoomCode(e.target.value)}
                                />
                                <AnimatePresence>
                                    <motion.button className="text-2xl ring-2 ring-white p-1 rounded-md"
                                        onClick={() => {
                                            if (roomCode.length !== 4) {
                                                alert("Room code must be 4 characters")
                                                return 
                                            }
                                            window.location.href = `/room/${roomCode}`
                                        }}
                                    >
                                        JOIN
                                    </motion.button>
                                </AnimatePresence>
                            </div> 
                        </div>
                    :
                        <div/>
                    }
                </motion.div>
            )}
        </>
    )
}