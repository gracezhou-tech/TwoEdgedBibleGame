import React from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

export default function ScoreBoard({ players, currentPlayerIndex }) {
  // Find the highest score
  const maxScore = Math.max(...players.map(p => p.score));

  return (
    <div className="w-full bg-gradient-to-r from-[#3D2317] via-[#4D2D1D] to-[#3D2317] py-3 px-4 border-b-2 border-yellow-600/30">
      <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
        {players.map((player, index) => {
          const initial = player.name.charAt(0).toUpperCase();
          const isActive = index === currentPlayerIndex;
          const isLeading = player.score === maxScore && maxScore > 0;

          return (
            <motion.div
              key={index}
              animate={{
                scale: isActive ? 1.1 : 1,
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'bg-yellow-500/30 border-2 border-yellow-400' 
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {isLeading && (
                <Crown className="w-4 h-4 text-yellow-400" />
              )}
              <span className={`font-bold text-lg ${
                isActive ? 'text-yellow-400' : 'text-white/80'
              }`}>
                {initial}
              </span>
              <span className="text-white/50">=</span>
              <motion.span
                key={player.score}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className={`font-bold text-xl ${
                  isActive ? 'text-yellow-300' : 'text-white'
                }`}
              >
                {player.score}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
