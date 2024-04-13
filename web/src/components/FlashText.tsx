"use client"
import { motion, useMotionValue, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function FlashText({ x }) {
    const [displayText, setDisplayText] = useState(null)
    
    useMotionValueEvent(x, "change", () => {
        if (x.get() > 120) {
            setDisplayText(true)
        } else if (x.get() < -120) {
            setDisplayText(false)
        } else {
            setDisplayText(null)
        }
    })

    return (
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
    )
}