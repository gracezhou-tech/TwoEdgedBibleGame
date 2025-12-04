import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function QuestionCard({ 
  question, 
  currentPlayer, 
  onSubmit, 
  questionNumber,
  totalQuestions 
}) {
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset timer and answer when question changes
  useEffect(() => {
    setTimeLeft(30);
    setAnswer('');
    setIsSubmitting(false);
  }, [question]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    onSubmit(answer.trim());
  }, [answer, isSubmitting, onSubmit]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && answer.trim()) {
      handleSubmit();
    }
  };

  const timerColor = timeLeft > 15 ? 'text-green-400' : timeLeft > 5 ? 'text-yellow-400' : 'text-red-400';
  const timerBgColor = timeLeft > 15 ? 'bg-green-500' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6">
      {/* Question info header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white/70">
          <User className="w-4 h-4" />
          <span className="text-sm">{currentPlayer}'s turn</span>
        </div>
        <span className="text-white/50 text-sm">
          Question {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Timer */}
      <div className="flex justify-center mb-6">
        <motion.div
          animate={{
            scale: timeLeft <= 5 ? [1, 1.1, 1] : 1,
          }}
          transition={{
            repeat: timeLeft <= 5 ? Infinity : 0,
            duration: 0.5,
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full bg-[#3D2317] border-2 ${
            timeLeft <= 5 ? 'border-red-500' : 'border-yellow-600/50'
          }`}
        >
          <Clock className={`w-6 h-6 ${timerColor}`} />
          <span className={`text-3xl font-bold ${timerColor}`}>
            {timeLeft}
          </span>
        </motion.div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-2 bg-white/10 rounded-full mb-8 overflow-hidden">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / 30) * 100}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full ${timerBgColor} rounded-full`}
        />
      </div>

      {/* Question card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 rounded-2xl p-6 md:p-8 shadow-2xl mb-6"
      >
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-[#722F37] text-white text-xs rounded-full mb-4 uppercase tracking-wider">
            {question.category}
          </span>
          <h3 className="text-xl md:text-2xl font-serif text-[#3D2317] leading-relaxed">
            {question.question}
          </h3>
        </div>
      </motion.div>

      {/* Answer input */}
      <div className="space-y-4">
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your answer..."
          disabled={isSubmitting}
          className="w-full h-14 bg-white/10 border-2 border-white/30 text-white text-lg placeholder:text-white/40 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl"
          autoFocus
        />
        
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-[#3D2317] font-bold text-lg rounded-xl"
        >
          <Send className="w-5 h-5 mr-2" />
          SUBMIT ANSWER
        </Button>
      </div>
    </div>
  );
}
