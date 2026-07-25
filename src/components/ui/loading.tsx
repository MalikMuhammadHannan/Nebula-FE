import { motion } from "motion/react"

import { cn } from "@/lib/utils"

const RIPPLE_COUNT = 3
const DURATION = 2

export interface LoadingProps {
    className?: string
    size?: number
}

function Loading({ className, size = 100 }: LoadingProps) {
    return (
        <div
            className={cn("flex h-full min-h-[calc(100svh-12rem)] min-w-full items-center justify-center ", className)}
            role="status"
            aria-label="Loading"
        >
            <div className="relative" style={{ width: size, height: size }}>
                {Array.from({ length: RIPPLE_COUNT }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border-[5px] border-primary"
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1, opacity: 0 }}
                        transition={{
                            duration: DURATION,
                            ease: "easeOut",
                            repeat: Infinity,
                            delay: (i * DURATION) / RIPPLE_COUNT,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export { Loading }
