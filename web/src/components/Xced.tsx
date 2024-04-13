import { motion, useMotionValue } from "framer-motion"
import { useEffect } from "react"

export default function Xced({ color, strokeWidth = 4 }) {
    return (
        <motion.svg className="w-3/5 h-3/5 z-10"
            viewBox="0 0 100 100"
        >
            <motion.line
                x1="30"
                y1="30"
                x2="70"
                y2="70"
                
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1}}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut"}}

                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap={"round"}
            />
            <motion.line 
                x1="30"
                y1="70"
                x2="70"
                y2="30"
                
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1}}
                exit={{ pathLength: 0, opacity: 0}}
                transition={{ duration: 1.5, ease: "easeInOut" }}

                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap={"round"}
            />
        </motion.svg>
    )
}