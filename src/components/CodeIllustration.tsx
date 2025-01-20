'use client';

import { motion } from 'framer-motion';

const codeLines = [
  { width: "70%", delay: 0 },
  { width: "40%", delay: 0.2 },
  { width: "85%", delay: 0.4 },
  { width: "60%", delay: 0.6 },
  { width: "75%", delay: 0.8 },
];

export default function CodeIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-md mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 relative z-10">
        {/* Window Controls */}
        <div className="flex gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>

        {/* Code Lines */}
        <div className="space-y-2">
          {codeLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: line.delay, duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <motion.span
                className="text-gray-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: line.delay + 0.2 }}
              >
                {index + 1}
              </motion.span>
              <motion.div
                className="h-2 rounded bg-gradient-to-r from-blue-500/30 to-purple-500/30"
                style={{ width: line.width }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: line.delay, duration: 0.5 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Typing Cursor */}
        <motion.div
          className="absolute bottom-4 right-4 w-2 h-4 bg-blue-500"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500/20 rounded-full blur-lg" />
      <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-purple-500/20 rounded-full blur-lg" />
    </motion.div>
  );
}
