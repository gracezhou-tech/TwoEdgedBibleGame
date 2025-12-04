import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Plus, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContinueModal({ players, onContinue, onEnd }) {
  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-[#3D2317] to-[#2C1810] rounded-3xl p-8 max-w-md w-full border-2 border-yellow-600/50"
      >
        <div className="text-center mb-6">
          <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <h2 className="text-2xl font-serif font-bold text-white mb-2">
            7 Questions Complete!
          </h2>
          <p className="text-white/70">Current Standings</p>
        </div>

        {/* Current scores */}
        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <div className="space-y-2">
            {sortedPlayers.map((player, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  index === 0 ? 'bg-yellow-500/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${
                    index === 0 ? 'text-yellow-400' : 'text-white/70'
                  }`}>
                    {index + 1}.
                  </span>
                  <span className="text-white font-medium">{player.name}</span>
                </div>
                <span className={`text-xl font-bold ${
                  index === 0 ? 'text-yellow-400' : 'text-white'
                }`}>
                  {player.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-white/80 mb-6">
          Would you like to continue with 7 more questions?
        </p>

        <div className="flex gap-3">
          <Button
            onClick={onEnd}
            variant="outline"
            className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10 py-6"
          >
            <Flag className="w-5 h-5 mr-2" />
            End Game
          </Button>
          <Button
            onClick={onContinue}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-[#3D2317] font-bold py-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            Continue
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
