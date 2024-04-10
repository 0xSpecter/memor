"use client"
import { use, useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, AnimatePresence, useTransform, useMotionValueEvent } from "framer-motion";


export default function Page() {
    const [nickname, setNickname] = useState(() => {
        let temp_nickname
        if (window) {
            temp_nickname = window.localStorage.getItem("nickname")
        }
        
        return temp_nickname || ""
    })

    const x = useMotionValue(0)
    const xInput = [-100, 0, 100];
    const background = useTransform(x, xInput, [
        "linear-gradient(180deg, #ff008c 0%, rgb(211, 9, 225) 100%)",
        "linear-gradient(180deg, #7700ff 0%, rgb(68, 0, 255) 100%)",
        "linear-gradient(180deg, rgb(230, 255, 0) 0%, rgb(3, 209, 0) 100%)"
    ]);
    const borderWidth = useTransform(x, xInput, [40, 4, 40]);
    const color = useTransform(x, xInput, [
        "rgb(211, 9, 225)",
        "rgb(68, 0, 255)",
        "rgb(3, 209, 0)"
    ]);

    const [selectionTooltip, setSelectionTooltip] = useState(false)

    const [displayText, setDisplayText] = useState(null)
    useMotionValueEvent(x, "change", () => {
        if (x.get() > 50) {
            setDisplayText(true)
        } else if (x.get() < -50) {
            setDisplayText(false)
        } else {
            setDisplayText(null)
        }
    })

    useEffect(() => {
        const handlePointerUp = () => {
            if (x.get() > 50) {
                x.set(100) // freeze position (does not work)
                window.location.href = "/online"
            } else if (x.get() < -50) {
                x.set(100) // freeze position
                window.location.href = "/local"
            }
        };

        window.addEventListener('pointerup', handlePointerUp);

        return () => {
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, []);

    return (
        <motion.main className="relative w-screen h-screen bg-zinc-900 text-white  rounded-md flex flex-col md:flex-row items-center justify-around px-16"
            style={{ background }}
        >
            <Frosted className="bg-pink-500/50 w-1/4 h-10 absolute top-10 right-10"
                style={{}}
            >
                <input className="w-full h-full text-center bg-transparent text-lg font-semibold outline-none caret-white"
                    placeholder="Nickname"
                    type="text"
                    value={nickname}
                    onChange={e => {
                        setNickname(e.target.value)
                        window.localStorage.setItem("nickname", e.target.value)
                    }}
                />
            </Frosted>

            <motion.div className="absolute w-32 h-32 rounded-full bg-white shadow-2xl
                                    flex items-center justify-center z-50"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.65}
                style={{ x }}

                onMouseOver={() => setSelectionTooltip(true)}
                onMouseLeave={() => setSelectionTooltip(false)}
            >
                <motion.div className="w-1/2 h-1/2 rounded-full" style={{ borderColor: color, borderWidth: borderWidth }}/>
                <AnimatePresence>
                    { selectionTooltip &&
                        <motion.div className="absolute -top-16 -right-40 w-40 text-sm text-black bg-gradient-to-br from-white to-white/80 backdrop-blur-xl shadow-2xl
                                                border-2 border-white/90 rounded-md p-2 z-50"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 30, opacity: 0 }}
                        >
                            Drag right for local play and left for online play
                        </motion.div>
                    }
                </AnimatePresence>
            </motion.div>
            
            <Beat x={x} polltime={10}/>

            <AnimatePresence>
                { displayText === true ?
                    <motion.div className="absolute text-[8rem] font-bold text-white top-[10%] left-[10%]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        Online
                    </motion.div>
                : displayText === false &&
                    <motion.div className="absolute text-[8rem] font-bold text-white top-[10%] left-[10%]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        Local
                    </motion.div>
                }
            </AnimatePresence>

        </motion.main>
    );
}

function Beat({ x, polltime, callback = null }) {
    // creates a beat effect when the block is at the center every polltime (polltime is in seconds)

    const borderWidth = useMotionValue(1)
    const width = useMotionValue(1)
    const height = useMotionValue(1)
    const opacity = useMotionValue(0) // to prevent beat on startup

    useEffect(() => {
        const inter = setInterval(() => {
            if (x.get() === 0) {
                borderWidth.set(1)
                width.set(1)
                height.set(1)
                opacity.set(1)

                if (callback) callback()
            }
        }, polltime * 1000)

        return () => clearInterval(inter)
    }, [])
    
    useAnimationFrame((time, delta) => {
        borderWidth.set(borderWidth.get() + 3 / delta)
        width.set(width.get() + 75 / delta)
        height.set(height.get() + 75 / delta)
        opacity.set(opacity.get() - 0.15 / delta)
    })

    return (
        <motion.div className="absolute m-auto border-2 border-white rounded-full w-1 h-1 bg-white/30"
            style={{ width, height, opacity, borderWidth }}
        >

        </motion.div>
    )
}

function Frosted({ children = null, className = "", style = {} }) {
    return (
        <div className={`backdrop-blur-xl shadow-xl rounded-sm z-20 ${className} border-2 border-white/30`}
            style={style}
        >
            {children}
        </div>
    )
}

function BounchingBlock({  }) {
    const x = useMotionValue(0)
    const xdir = useMotionValue(Math.random() > 0.5 ? 1 : -1)
    const y = useMotionValue(0)
    const ydir = useMotionValue(Math.random() > 0.5 ? 1 : -1)

    const [bgColor, setBgColor] = useState(null)
    const [bounceCount, setBounceCount] = useState(0)
    const [display, setDisplay] = useState(false)


    const ref = useRef(null)

    useAnimationFrame((time, delta) => {
        x.set(x.get() - (100 * xdir.get()) / delta)
        y.set(y.get() - (100 * ydir.get()) / delta)
        
        console.log(window.innerWidth, window.innerHeight)
        console.log(x.get(), y.get())

        // half the width of the block 
        const half_width = ref.current.offsetWidth / 2
        const half_height = ref.current.offsetWidth / 2
        if (Math.abs(x.get()) + half_width >= window.innerWidth / 2) {xdir.set(-xdir.get()); bounce()}
        if (Math.abs(y.get()) + half_height >= window.innerHeight / 2) {ydir.set(-ydir.get()); bounce()}
    })

    function bounce() {
        setBgColor(`linear-gradient(${Math.random() * 360}deg, rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}), rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}))`)
        setBounceCount(bounces => bounces + 1)
    }

    return (
        <>
            <motion.div className="absolute w-40 h-40 rounded-xl bg-gradient-to-tr from-green-500/80 to-green-400 z-0 shadow-2xl"
                style={{ x, y, background: bgColor }}
                whileHover={{ border: "2px solid rgba(255, 255, 255, 0.8)" }}
                onClick={() => {
                    setDisplay(true)
                    setTimeout(() => setDisplay(false), 5000)
                }}
                ref={ref}
            />

            <AnimatePresence> 
                { display &&
                    <motion.span className="absolute top-10 mx-auto rounded-lg text-2xl p-4 font-bold"
                        initial={{ y : -200 }}
                        animate={{ y : 0 }}
                        exit={{ y : -200 }}
                        transition={{ duration: 1, ease: "easeInOut"}}
                        style={{ background: bgColor }}
                    >
                        Bounces: {bounceCount}
                    </motion.span>
                }
            </AnimatePresence>
        </>
    )
}







