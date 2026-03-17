import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on snake
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    return newFood;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if ate food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameOver, isPaused]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div 
        className="relative bg-zinc-900 border-2 border-emerald-500/30 rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.1)] overflow-hidden"
        style={{ 
          width: 'min(80vw, 400px)', 
          height: 'min(80vw, 400px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none opacity-5">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-emerald-500" />
          ))}
        </div>

        {/* Food */}
        <div 
          className="bg-fuchsia-500 rounded-full shadow-[0_0_10px_rgba(217,70,239,0.8)] animate-pulse"
          style={{ 
            gridColumnStart: food.x + 1, 
            gridRowStart: food.y + 1 
          }}
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div 
            key={i}
            className={`${i === 0 ? 'bg-emerald-400' : 'bg-emerald-500/80'} rounded-sm shadow-[0_0_8px_rgba(16,185,129,0.5)]`}
            style={{ 
              gridColumnStart: segment.x + 1, 
              gridRowStart: segment.y + 1,
              zIndex: 10 - i
            }}
          />
        ))}

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <h2 className="text-4xl font-bold text-fuchsia-500 mb-4 tracking-tighter uppercase italic">Game Over</h2>
            <p className="text-zinc-400 mb-6">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-emerald-500 text-black font-bold rounded-full hover:bg-emerald-400 transition-colors uppercase text-sm tracking-widest"
            >
              Restart
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-40">
            <button 
              onClick={() => setIsPaused(false)}
              className="group flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full border-2 border-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 transition-all">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-emerald-500 border-b-[10px] border-b-transparent ml-1 group-hover:border-l-black" />
              </div>
              <span className="text-emerald-500 font-mono text-xs tracking-[0.3em] uppercase">Press Space to Start</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md flex flex-col items-center min-w-[100px]">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Score</span>
          <span className="text-2xl font-mono text-emerald-400 leading-none">{score.toString().padStart(4, '0')}</span>
        </div>
      </div>
    </div>
  );
}
