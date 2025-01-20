'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const CodeBubble = ({ delay = 0 }) => {
  const randomSize = Math.floor(Math.random() * 40) + 20;
  const randomX = Math.floor(Math.random() * 100);
  
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        y: 100,
        x: randomX,
        scale: 0
      }}
      animate={{ 
        opacity: [0, 0.5, 0],
        y: [-100],
        scale: [1, 1.2, 0.8],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute bottom-0"
    >
      <div 
        className="text-blue-500/10 dark:text-blue-400/10 font-mono"
        style={{ fontSize: `${randomSize}px` }}
      >
        {`{ }`}
      </div>
    </motion.div>
  );
};

interface FloatingSymbolProps {
  symbol: string;
  delay?: number;
  left?: string;
  top?: string;
}

const FloatingSymbol = ({ symbol, delay = 0, left = "50%", top = "50%" }: FloatingSymbolProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ 
        opacity: [0, 1, 0],
        y: [100, -20, -100]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
      style={{ position: 'absolute', left, top }}
      className="text-gray-600/20 text-7xl lg:text-8xl"
    >
      <div className="transform -rotate-12">
        {symbol}
      </div>
    </motion.div>
  );
};

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0">
        {/* Code Bubbles */}
        {[...Array(8)].map((_, i) => (
          <CodeBubble key={i} delay={i * 1.5} />
        ))}
        
        {/* Programming Symbols */}
        {[...Array(20)].map((_, i) => {
          const symbols = ['<>', '/>', '()', '{}', '=>', '||', '&&', '++', '--', '**'];
          const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
          const randomLeft = `${Math.random() * 90}%`;
          const randomTop = `${Math.random() * 90}%`;
          return (
            <FloatingSymbol 
              key={i}
              symbol={randomSymbol}
              delay={i * 2}
              left={randomLeft}
              top={randomTop}
            />
          );
        })}
        
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
}
