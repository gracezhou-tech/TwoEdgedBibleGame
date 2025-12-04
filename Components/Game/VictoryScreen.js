import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Share2, RotateCcw, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import moment from 'moment';

export default function VictoryScreen({ players, onPlayAgain }) {
  const [showConfetti, setShowConfetti] = useState(true);

  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const isTie = sortedPlayers.filter(p => p.score === winner.score).length > 1;
  const otherPlayers = players.filter(p => p.name !== winner.name);

  // Play victory trumpet sound
  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const playNote = (frequency, startTime, duration, type = 'sine') => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gainNode.gain.setValueAtTime(0.3, startTime + duration - 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    // Trumpet fanfare
    const now = audioContext.currentTime;
    // First phrase
    playNote(392, now, 0.2, 'sawtooth'); // G4
    playNote(392, now + 0.2, 0.2, 'sawtooth'); // G4
    playNote(392, now + 0.4, 0.2, 'sawtooth'); // G4
    playNote(311.13, now + 0.6, 0.4, 'sawtooth'); // Eb4
    playNote(466.16, now + 1.0, 0.15, 'sawtooth'); // Bb4
    playNote(392, now + 1.15, 0.25, 'sawtooth'); // G4
    playNote(311.13, now + 1.4, 0.2, 'sawtooth'); // Eb4
    playNote(392, now + 1.6, 0.6, 'sawtooth'); // G4

    // Confetti timeout
    setTimeout(() => setShowConfetti(false), 5000);
  }, []);

  const handleShare = async () => {
    const today = moment().format('D MMMM YYYY');
    let shareText = '';
    
    if (players.length > 1) {
      const opponents = otherPlayers.map(p => p.name).join(', ');
      shareText = `🏆 I won on TwoEdged Bible Game on ${today} against ${opponents} with a score of ${winner.score}! Can you beat me?`;
    } else {
      shareText = `📖 I scored ${winner.score} points on TwoEdged Bible Game on ${today}! Test your Bible knowledge too!`;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TwoEdged Bible Game',
          text: shareText,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          await navigator.clipboard.writeText(shareText);
          toast.success('Score copied to clipboard!');
        }
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success('Score copied to clipboard!');
    }
  };

  // Generate confetti pieces
  const confettiColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7', '#3B82F6', '#EC4899', '#10B981'];
  const confettiPieces = [...Array(50)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    color: confettiColors[i % confettiColors.length],
    size: 8 + Math.random() * 8,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5D1A2D] via-[#722F37] to-[#8B1538] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute"
              style={{
                left: `${piece.x}%`,
                top: -20,
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '0%',
              }}
              initial={{ y: -20, rotate: 0 }}
              animate={{
                y: window.innerHeight + 50,
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                x: [0, 30, -30, 0],
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      {/* Stars background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          </motion.div>
        ))}
      </div>

      {/* Crown */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="mb-4"
      >
        <Crown className="w-20 h-20 text-yellow-400 fill-yellow-500" />
      </motion.div>

      {/* Winner announcement */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', bounce: 0.4 }}
        className="text-center mb-8"
      >
        <motion.h1
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="text-5xl md:text-7xl font-bold mb-4"
          style={{
            background: 'linear-gradient(90deg, #FFD700, #FFA500, #FF6B6B, #A855F7, #3B82F6, #10B981, #FFD700)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'rainbow 3s linear infinite',
          }}
        >
          {isTie ? 'IT\'S A TIE!' : `${winner.name.toUpperCase()} WINS!`}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-3"
        >
          <Trophy className="w-8 h-8 text-yellow-400" />
          <span className="text-4xl font-bold text-white">{winner.score} Points</span>
        </motion.div>
      </motion.div>

      {/* All scores */}
      {players.length > 1 && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 w-full max-w-sm"
        >
          <h3 className="text-white/70 text-center text-sm mb-4 uppercase tracking-wider">
            Final Scores
          </h3>
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  index === 0 ? 'bg-yellow-500/20 border border-yellow-500/50' : 'bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-[#3D2317]' : 
                    index === 1 ? 'bg-gray-400 text-gray-800' :
                    index === 2 ? 'bg-amber-600 text-white' : 'bg-white/20 text-white'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-white font-medium">{player.name}</span>
                </div>
                <span className="text-xl font-bold text-white">{player.score}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-sm"
      >
        <Button
          onClick={handleShare}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-bold py-6 rounded-xl"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share Victory
        </Button>
        <Button
          onClick={onPlayAgain}
          variant="outline"
          className="flex-1 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 py-6 rounded-xl"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Play Again
        </Button>
      </motion.div>

      {/* Rainbow animation keyframes */}
      <style>{`
        @keyframes rainbow {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
