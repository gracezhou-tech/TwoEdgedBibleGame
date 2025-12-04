import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';

export default function ResultModal({ isCorrect, correctAnswer, onClose }) {
  // Play sound effect
  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (isCorrect) {
      // Victory chord - ascending and bright
      const playNote = (frequency, startTime, duration) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      
      const now = audioContext.currentTime;
      playNote(523.25, now, 0.3); // C5
      playNote(659.25, now + 0.1, 0.3); // E5
      playNote(783.99, now + 0.2, 0.4); // G5
      playNote(1046.50, now + 0.3, 0.5); // C6
    } else {
      // Wrong answer - descending tones
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    }

    // Auto close after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isCorrect, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className={`relative rounded-3xl p-8 md:p-12 text-center max-w-md w-full ${
            isCorrect 
              ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500' 
              : 'bg-gradient-to-br from-red-500 via-rose-500 to-pink-500'
          }`}
        >
          {/* Decorative elements for correct answer */}
          {isCorrect && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ x: 0, y: 0, scale: 0 }}
                  animate={{
                    x: Math.cos((i * 30 * Math.PI) / 180) * 120,
                    y: Math.sin((i * 30 * Math.PI) / 180) * 120,
                    scale: 1,
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                >
                  <Sparkles className={`w-6 h-6 ${
                    ['text-yellow-300', 'text-pink-300', 'text-blue-300', 'text-purple-300'][i % 4]
                  }`} />
                </motion.div>
              ))}
            </>
          )}

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
            className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isCorrect ? 'bg-white/30' : 'bg-white/20'
            }`}
          >
            {isCorrect ? (
              <Check className="w-14 h-14 text-white" strokeWidth={3} />
            ) : (
              <X className="w-14 h-14 text-white" strokeWidth={3} />
            )}
          </motion.div>

          {/* Text */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {isCorrect ? (
              <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent">
                WELL DONE!
              </span>
            ) : (
              'Not Quite!'
            )}
          </motion.h2>

          {!isCorrect && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/20 rounded-xl p-4"
            >
              <p className="text-white/80 text-sm mb-1">The correct answer was:</p>
              <p className="text-white font-bold text-xl">{correctAnswer}</p>
            </motion.div>
          )}

          {/* Timer indicator */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 3, ease: 'linear' }}
            className="absolute bottom-0 left-0 h-1 bg-white/50 rounded-b-3xl"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
