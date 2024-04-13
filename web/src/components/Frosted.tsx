
export default function Frosted({ children = null, className = "", style = {} }) {
    return (
        <div className={`backdrop-blur-xl shadow-xl rounded-sm z-20 ${className} ring-2 ring-black/10`}
            style={style}
        >
            {children}
        </div>
    )
}