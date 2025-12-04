import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, ChevronRight, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PlayerSetup({ onStartGame }) {
  const [playerCount, setPlayerCount] = useState(1);
  const [playerNames, setPlayerNames] = useState(['']);
  const [step, setStep] = useState(1); // 1: count, 2: names

  const handleCountChange = (delta) => {
    const newCount = Math.max(1, Math.min(4, playerCount + delta));
    setPlayerCount(newCount);
    
    // Adjust names array
    if (newCount > playerNames.length) {
      setPlayerNames([...playerNames, ...Array(newCount - playerNames.length).fill('')]);
    } else {
      setPlayerNames(playerNames.slice(0, newCount));
    }
  };

  const handleNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleNext = () => {
    if (step === 1) {
      setPlayerNames(Array(playerCount).fill(''));
      setStep(2);
    }
  };

  const handleStartGame = () => {
    // Use default names if empty
    const finalNames = playerNames.map((name, i) => 
      name.trim() || `Player ${i + 1}`
    );
    onStartGame(finalNames);
  };

  const allNamesValid = playerNames.every((name, i) => name.trim() || true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5D1A2D] via-[#722F37] to-[#8B1538] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-white mb-2">
            {step === 1 ? 'How Many Players?' : 'Enter Player Names'}
          </h2>
          <p className="text-yellow-200/80 text-sm">
            {step === 1 
              ? 'Choose 1-4 players to compete' 
              : 'Who will prove their Bible knowledge?'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="count"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              {/* Player count selector */}
              <div className="flex items-center justify-center gap-8 mb-8">
                <Button
                  onClick={() => handleCountChange(-1)}
                  disabled={playerCount <= 1}
                  variant="outline"
                  size="icon"
                  className="w-14 h-14 rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 disabled:opacity-30"
                >
                  <Minus className="w-6 h-6" />
                </Button>

                <motion.div
                  key={playerCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-7xl font-bold text-yellow-400">
                    {playerCount}
                  </span>
                  <span className="text-white/70 text-sm mt-1">
                    {playerCount === 1 ? 'Player' : 'Players'}
                  </span>
                </motion.div>

                <Button
                  onClick={() => handleCountChange(1)}
                  disabled={playerCount >= 4}
                  variant="outline"
                  size="icon"
                  className="w-14 h-14 rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 disabled:opacity-30"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </div>

              {/* Player icons */}
              <div className="flex justify-center gap-3 mb-8">
                {[1, 2, 3, 4].map((num) => (
                  <motion.div
                    key={num}
                    animate={{
                      scale: num <= playerCount ? 1 : 0.8,
                      opacity: num <= playerCount ? 1 : 0.3,
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      num <= playerCount 
                        ? 'bg-yellow-500 text-[#3D2317]' 
                        : 'bg-white/10 text-white/30'
                    }`}
                  >
                    <User className="w-6 h-6" />
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-[#3D2317] font-bold py-6 rounded-xl"
              >
                Next <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="names"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <div className="space-y-4 mb-8">
                {playerNames.map((name, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <label className="text-white/80 text-sm mb-1 block">
                      Player {index + 1}
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder={`Enter name...`}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/40 focus:border-yellow-500 focus:ring-yellow-500/20 h-12 text-lg"
                      maxLength={15}
                    />
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10 py-6"
                >
                  Back
                </Button>
                <Button
                  onClick={handleStartGame}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-[#3D2317] font-bold py-6 rounded-xl"
                >
                  START GAME
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
