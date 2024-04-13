import { motion, useMotionValue, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"

function rnd() {
    return Math.random() * (1.3 - 0.7) + 0.7
}

export default function BounchingBlock({ speedMultiplier = 1 }) {
    const x = useMotionValue(0)
    const xdir = useMotionValue(Math.random() > 0.5 ? 1 : -1)
    const xoffset = useMotionValue(rnd())
    const y = useMotionValue(0)
    const ydir = useMotionValue(Math.random() > 0.5 ? 1 : -1)
    const yoffset = useMotionValue(rnd())

    const [bgColor, setBgColor] = useState(null)
    const [bounceCount, setBounceCount] = useState(0)
    const [display, setDisplay] = useState(false)

    const ref = useRef(null)


    useEffect(() => {const inter = setInterval(() => {
        x.set(x.get() - (Math.round(3 * xdir.get() * xoffset.get() * speedMultiplier)))
        y.set(y.get() - (Math.round(3 * ydir.get() * yoffset.get() * speedMultiplier)))
        
        // half the width of the block 
        const half_width = ref.current.offsetWidth / 2
        const half_height = ref.current.offsetWidth / 2
        if (Math.abs(x.get()) + half_width >= window.innerWidth / 2) {xdir.set(-xdir.get()); bounce()}
        if (Math.abs(y.get()) + half_height >= window.innerHeight / 2) {ydir.set(-ydir.get()); bounce()}
    }, 10); return () => clearInterval(inter)} ,[])

    function bounce() {
        setBgColor(`linear-gradient(${Math.random() * 360}deg, rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}), rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}))`)
        setBounceCount(bounces => bounces + 1)

        x.set(x.get() + (-5 * xdir.get()))
        y.set(y.get() + (-5 * ydir.get()))

        xoffset.set(rnd())
        yoffset.set(rnd())
    }

    return (
        <>
            <motion.div className="absolute w-40 h-40 rounded-xl  z-0 shadow-2xl opacity-35 ring-1 ring-black/10 backdrop-invert bg-transparent"
                style={{ x, y,  }} // background: bgColor
                // whileHover={{ border: "2px solid rgba(255, 255, 255, 0.8)" }}
                onClick={() => {
                    setDisplay(true)
                    setTimeout(() => setDisplay(false), 5000)
                }}
                ref={ref}

                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
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