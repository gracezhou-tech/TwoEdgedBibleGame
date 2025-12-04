import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WelcomeScreen from '@/components/game/WelcomeScreen';
import PlayerSetup from '@/components/game/PlayerSetup';
import GameScreen from '@/components/game/GameScreen';
import VictoryScreen from '@/components/game/VictoryScreen';

export default function Home() {
  const [gameState, setGameState] = useState('welcome'); // welcome, setup, playing, victory
  const [players, setPlayers] = useState([]);
  const [finalScores, setFinalScores] = useState([]);

  const handleStart = () => {
    setGameState('setup');
  };

  const handleStartGame = (playerNames) => {
    setPlayers(playerNames);
    setGameState('playing');
  };

  const handleGameEnd = (playersWithScores) => {
    setFinalScores(playersWithScores);
    setGameState('victory');
  };

  const handlePlayAgain = () => {
    setPlayers([]);
    setFinalScores([]);
    setGameState('welcome');
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {gameState === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WelcomeScreen onStart={handleStart} />
          </motion.div>
        )}

        {gameState === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PlayerSetup onStartGame={handleStartGame} />
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GameScreen 
              players={players} 
              onGameEnd={handleGameEnd}
            />
          </motion.div>
        )}

        {gameState === 'victory' && (
          <motion.div
            key="victory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <VictoryScreen 
              players={finalScores} 
              onPlayAgain={handlePlayAgain}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
