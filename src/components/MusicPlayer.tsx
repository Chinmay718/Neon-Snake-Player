import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "SynthWave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#10b981"
  },
  {
    id: 2,
    title: "Cyber City",
    artist: "Glitch Core",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#d946ef"
  },
  {
    id: 3,
    title: "Digital Rain",
    artist: "Lo-Fi Bot",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#06b6d4"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-24 h-24 flex-shrink-0">
          <div 
            className="absolute inset-0 rounded-2xl blur-xl opacity-20 animate-pulse"
            style={{ backgroundColor: currentTrack.color }}
          />
          <div className="relative w-full h-full bg-zinc-800 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrack.id}
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotate: 10 }}
                className="text-zinc-400"
              >
                <Music2 size={40} style={{ color: currentTrack.color }} />
              </motion.div>
            </AnimatePresence>
            
            {isPlaying && (
              <div className="absolute bottom-2 flex gap-1 items-end h-4">
                {[1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 12, 6, 16, 4] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1 bg-white/40 rounded-full"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
            >
              <h3 className="text-xl font-bold text-white truncate tracking-tight">{currentTrack.title}</h3>
              <p className="text-zinc-500 text-sm font-medium">{currentTrack.artist}</p>
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-4 flex items-center gap-2 text-zinc-600">
            <Volume2 size={14} />
            <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-zinc-600 w-2/3 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-1.5 w-full bg-zinc-800 rounded-full cursor-pointer group relative">
          <motion.div 
            className="h-full rounded-full relative"
            style={{ 
              width: `${progress}%`,
              backgroundColor: currentTrack.color,
              boxShadow: `0 0 10px ${currentTrack.color}40`
            }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
          </motion.div>
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          <span>0:00</span>
          <span>3:45</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8">
        <button 
          onClick={skipBackward}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <SkipBack size={24} fill="currentColor" />
        </button>

        <button 
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
        </button>

        <button 
          onClick={skipForward}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <SkipForward size={24} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
