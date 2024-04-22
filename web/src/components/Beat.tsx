"use client"
import { useEffect } from "react"
import { motion, useMotionValue } from "framer-motion"

export default function Beat({ x, polltime, callback = null }) {
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
    
    useEffect(() => {const inter = setInterval(() => {
        borderWidth.set(borderWidth.get() + 0.3)
        width.set(width.get() + 5)
        height.set(height.get() + 5)
        opacity.set(opacity.get() - 0.008)
    }, 10); return () => clearInterval(inter)} ,[])

    return (
        <div className="absolute w-screen h-screen pointer-events-none overflow-hidden flex items-center justify-center">
            <motion.div className="absolute m-auto mb-48 md:mb-0 border-2 border-white rounded-full w-1 h-1 bg-white/30"
                style={{ width, height, opacity, borderWidth }}
            >

            </motion.div>
        </div>
    )
}