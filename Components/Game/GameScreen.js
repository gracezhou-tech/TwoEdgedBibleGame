import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ScoreBoard from './ScoreBoard';
import QuestionCard from './QuestionCard';
import ResultModal from './ResultModal';
import ContinueModal from './ContinueModal';
import { getRandomQuestions, checkAnswer } from './bibleQuestions';

export default function GameScreen({ players: initialPlayers, onGameEnd }) {
  const [players, setPlayers] = useState(
    initialPlayers.map(name => ({ name, score: 0 }))
  );
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [questions, setQuestions] = useState(() => getRandomQuestions(7));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestionsAsked, setTotalQuestionsAsked] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isSinglePlayer = players.length === 1;

  const handleAnswer = useCallback((answer) => {
    const isCorrect = checkAnswer(answer, currentQuestion);
    setLastAnswerCorrect(isCorrect);

    if (isCorrect) {
      setPlayers(prev => prev.map((player, idx) => 
        idx === currentPlayerIndex 
          ? { ...player, score: player.score + 1 }
          : player
      ));
    }

    setShowResult(true);
    setTotalQuestionsAsked(prev => prev + 1);
  }, [currentQuestion, currentPlayerIndex]);

  const handleResultClose = useCallback(() => {
    setShowResult(false);

    // Check if we've completed 7 questions
    const questionsInRound = (totalQuestionsAsked + 1) % 7;
    if (questionsInRound === 0 && totalQuestionsAsked > 0) {
      setShowContinueModal(true);
      return;
    }

    // Move to next question/player
    moveToNext();
  }, [totalQuestionsAsked]);

  const moveToNext = () => {
    // Move to next player
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayerIndex);

    // If we've gone through all players, move to next question
    if (nextPlayerIndex === 0 || isSinglePlayer) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Need more questions
        const newQuestions = getRandomQuestions(7);
        setQuestions(newQuestions);
        setCurrentQuestionIndex(0);
      }
    }
  };

  const handleContinue = () => {
    setShowContinueModal(false);
    const newQuestions = getRandomQuestions(7);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
  };

  const handleEndGame = () => {
    setShowContinueModal(false);
    onGameEnd(players);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5D1A2D] via-[#722F37] to-[#8B1538] flex flex-col">
      {/* Score board */}
      <ScoreBoard 
        players={players} 
        currentPlayerIndex={currentPlayerIndex} 
      />

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center">
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            currentPlayer={players[currentPlayerIndex].name}
            onSubmit={handleAnswer}
            questionNumber={totalQuestionsAsked + 1}
            totalQuestions={Math.ceil((totalQuestionsAsked + 1) / 7) * 7}
          />
        )}
      </div>

      {/* Result modal */}
      <AnimatePresence>
        {showResult && (
          <ResultModal
            isCorrect={lastAnswerCorrect}
            correctAnswer={currentQuestion.answer}
            onClose={handleResultClose}
          />
        )}
      </AnimatePresence>

      {/* Continue modal */}
      <AnimatePresence>
        {showContinueModal && (
          <ContinueModal
            players={players}
            onContinue={handleContinue}
            onEnd={handleEndGame}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
