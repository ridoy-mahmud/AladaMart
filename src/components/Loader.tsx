import React from 'react';
import { motion } from 'framer-motion';

export default function Loader({ text = "Loading amazing things..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
      <div className="relative w-20 h-20 mb-6">
        {/* Outer glowing ring */}
        <motion.div 
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/50 opacity-70"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Middle pulsing ring */}
        <motion.div 
          className="absolute inset-2 rounded-full border-4 border-transparent border-b-secondary border-l-secondary/50 opacity-70"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner solid dot */}
        <motion.div 
          className="absolute inset-[35%] bg-primary rounded-full shadow-[0_0_15px_rgba(var(--color-primary),0.5)]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <motion.p 
        className="text-slate-500 font-medium tracking-wide text-sm"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {text}
      </motion.p>
    </div>
  );
}
