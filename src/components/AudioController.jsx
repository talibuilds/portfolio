import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AudioController = ({ audio }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setVolume(audio.volume);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('volumechange', handleVolumeChange);

    // Initial sync
    setIsPlaying(!audio.paused);
    setVolume(audio.volume);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [audio]);

  const togglePlayback = useCallback(() => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => console.log("Audio playback failed: ", err));
    }
  }, [audio, isPlaying]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 400); // Small delay before hiding so it doesn't vanish instantly
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '30px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(10, 10, 12, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '8px 14px',
        borderRadius: '28px',
        color: 'var(--text-primary)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        overflow: 'hidden', // to hide the slider when collapsed
      }}
    >
      {/* Waveform Bars */}
      <div
        aria-hidden="true"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '2.5px',
          height: '16px',
          width: '20px',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {[0, 0.15, 0.3, 0.45].map((delay, index) => (
          <motion.div
            key={index}
            animate={
              isPlaying
                ? { height: ['4px', '14px', '6px', '16px', '4px'] }
                : { height: '3px' }
            }
            transition={
              isPlaying
                ? { repeat: Infinity, duration: 0.8, delay, ease: 'easeInOut' }
                : { duration: 0.3 }
            }
            style={{
              width: '3px',
              backgroundColor: isPlaying ? 'var(--accent)' : '#555',
              borderRadius: '2px',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </div>

      {/* Volume Slider (Expands on hover) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '80px', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              style={{
                width: '70px',
                height: '4px',
                WebkitAppearance: 'none',
                background: `linear-gradient(to right, var(--accent) ${volume * 100}%, #444 ${volume * 100}%)`,
                borderRadius: '2px',
                outline: 'none',
                cursor: 'pointer',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={togglePlayback}
        style={{
          background: 'none',
          border: 'none',
          color: isPlaying ? 'var(--text-primary)' : '#666',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          outline: 'none',
          transition: 'color 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = isPlaying ? 'var(--text-primary)' : '#666')
        }
        title={isPlaying ? 'Mute Music' : 'Play Music'}
        aria-label={isPlaying ? 'Mute Music' : 'Play Music'}
      >
        {isPlaying && volume > 0 ? <Volume2 size={17} /> : <VolumeX size={17} />}
      </button>

      {/* Basic style for the range slider thumb to look good */}
      <style dangerouslySetInnerHTML={{__html: `
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: var(--text-primary);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
        input[type=range]::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: var(--text-primary);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
      `}} />
    </motion.div>
  );
};

export default AudioController;
