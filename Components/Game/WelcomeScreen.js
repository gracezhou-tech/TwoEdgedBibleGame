import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WelcomeScreen({ onStart }) {
  const [hasInteracted, setHasInteracted] = useState(false);

  const playStartSound = () => {
    if (!hasInteracted) {
      // Create a pleasant chime sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const playNote = (frequency, startTime, duration) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      
      // Play a pleasant ascending chord
      const now = audioContext.currentTime;
      playNote(523.25, now, 0.8); // C5
      playNote(659.25, now + 0.1, 0.7); // E5
      playNote(783.99, now + 0.2, 0.6); // G5
      playNote(1046.50, now + 0.3, 0.8); // C6
      
      setHasInteracted(true);
    }
  };

  const handleStart = () => {
    playStartSound();
    setTimeout(() => onStart(), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5D1A2D] via-[#722F37] to-[#8B1538] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-2 tracking-wide">
          TwoEdged
        </h1>
        <p className="text-xl md:text-2xl text-yellow-200 font-light tracking-widest">
          BIBLE GAME
        </p>
      </motion.div>

      {/* Glowing Bible */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative mb-12"
      >
        {/* Outer glow */}
        <motion.div
          className="absolute inset-0 bg-yellow-400 rounded-3xl blur-3xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Middle glow */}
        <motion.div
          className="absolute inset-0 bg-yellow-300 rounded-2xl blur-xl opacity-40"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />

        {/* Bible container */}
        <motion.div
          className="relative bg-gradient-to-br from-[#2C1810] via-[#3D2317] to-[#2C1810] p-8 md:p-12 rounded-2xl border-4 border-yellow-600 shadow-2xl"
          animate={{
            boxShadow: [
              "0 0 30px rgba(251, 191, 36, 0.3)",
              "0 0 60px rgba(251, 191, 36, 0.5)",
              "0 0 30px rgba(251, 191, 36, 0.3)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Cross decoration */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-yellow-500 rounded-full" />
            <div className="absolute top-3 left-0 w-full h-2 bg-yellow-500 rounded-full" />
          </div>

          <BookOpen className="w-24 h-24 md:w-32 md:h-32 text-yellow-400 mt-4" strokeWidth={1.5} />
          
          {/* Sparkle effects */}
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </motion.div>
          <motion.div
            className="absolute -bottom-2 -left-2"
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-yellow-200" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scripture */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="text-white/80 text-center text-sm md:text-base max-w-md mb-8 italic font-serif"
      >
        "For the word of God is quick, and powerful, and sharper than any twoedged sword..."
        <span className="block mt-1 text-yellow-200 not-italic">— Hebrews 4:12 KJV</span>
      </motion.p>

      {/* Start Button */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Button
          onClick={handleStart}
          size="lg"
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-[#3D2317] font-bold text-xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Play className="w-6 h-6 mr-2" />
          ENTER
        </Button>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 text-white/50 text-sm"
      >
        Come one, come all!
      </motion.p>
    </div>
  );
}
