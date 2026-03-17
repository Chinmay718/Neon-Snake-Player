import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Gamepad2, Music, Trophy } from 'lucide-react';

export default function App() {
  const [highScore, setHighScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  const handleScoreChange = (score: number) => {
    setCurrentScore(score);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <main className="relative z-10 container mx-auto px-6 py-8 h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Gamepad2 className="text-black" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter uppercase italic leading-none text-white">Neon Snake</h1>
              <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em]">Arcade Edition</span>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">High Score</span>
              <div className="flex items-center gap-2">
                <Trophy size={14} className="text-amber-500" />
                <span className="text-lg font-mono text-amber-500">{highScore.toString().padStart(4, '0')}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Stats/Info (Desktop) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-6">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="p-6 bg-zinc-900/40 border border-white/5 rounded-3xl"
            >
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Controls</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center">
                  <span className="text-zinc-400">Move</span>
                  <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] font-mono">ARROWS</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-zinc-400">Pause</span>
                  <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] font-mono">SPACE</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-zinc-900/40 border border-white/5 rounded-3xl"
            >
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Game Stats</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                    <span>Speed</span>
                    <span>1.0x</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-1/3" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                    <span>Difficulty</span>
                    <span>Normal</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-fuchsia-500 w-1/2" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Center: Game Area */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <SnakeGame onScoreChange={handleScoreChange} />
            </motion.div>
          </div>

          {/* Right Side: Music Player */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end gap-6">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4 px-4 lg:px-0">
                <Music size={16} className="text-fuchsia-500" />
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Now Playing</h2>
              </div>
              <MusicPlayer />
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block w-full max-w-md p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl"
            >
              <p className="text-xs text-emerald-500/60 leading-relaxed italic">
                "The rhythm of the synth guides the serpent through the digital void. Stay sharp, stay focused."
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto py-6 flex justify-between items-center border-t border-white/5">
          <span className="text-[10px] text-zinc-600 uppercase tracking-widest">© 2026 NEON ARCADE</span>
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">System Online</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
