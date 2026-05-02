import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function Splash({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div className="flex h-screen items-center justify-center overflow-hidden bg-black">
      <motion.img
        src="/logo-neon.png"
        alt=""
        initial={{ opacity: 0, scale: 0.6, filter: 'blur(10px)' }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.6, 1.1, 1, 1.4],
          filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(12px)'],
        }}
        transition={{
          duration: 2.5,
          times: [0, 0.3, 0.7, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
        className="h-56 w-auto max-w-[min(92vw,480px)] object-contain drop-shadow-[0_0_28px_#ff00cc] will-change-transform md:h-72 md:max-w-[min(92vw,560px)]"
      />
    </div>
  )
}
