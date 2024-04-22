import { motion } from "framer-motion"

export default function Frosted({ children = null, className = "", style = {}, animate = {}, transition = {} }) {
    return (
        <motion.div className={`backdrop-blur-xl shadow-xl rounded-sm z-20 ${className} ring-2 ring-black/10`}
            style={style}

            animate={animate}
            transition={transition}
        >
            {children}
        </motion.div>
    )
}