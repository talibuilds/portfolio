import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import InsectTrailBackground from './components/InsectTrailBackground';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Footer from './components/Footer';
import SpaceIntro from './components/SpaceIntro';
import AudioController from './components/AudioController';
import './index.css';

function App() {
  // Phases: 'intro' -> 'video' -> 'portfolio'
  const [appPhase, setAppPhase] = useState('intro');
  const videoRef = useRef(null);

  // Initialize the audio with the user's specific MP3 file
  const audio = useMemo(() => {
    const audioObj = new Audio('/intersteller_music.mp3');
    audioObj.loop = true; // Loop the audio continuously
    return audioObj;
  }, []);

  // Reduce volume to a true background level (8%) ONLY when portfolio loads
  useEffect(() => {
    if (appPhase !== 'portfolio' || !audio) return;

    // Smooth fade over ~2 seconds
    const targetVolume = 0.08;
    const steps = 40;
    const stepDuration = 50; // 50ms per step = 2 seconds total
    const startVolume = audio.volume;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      audio.volume = startVolume + (targetVolume - startVolume) * eased;

      if (currentStep >= steps) {
        audio.volume = targetVolume;
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [appPhase, audio]);

  // Ensure video forcefully plays from the beginning when phase switches to video
  useEffect(() => {
    if (appPhase === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.error('Video auto-play blocked:', e));
    }
  }, [appPhase]);

  return (
    <>
      <Analytics />
      <AnimatePresence mode="wait">
        {(appPhase === 'intro' || appPhase === 'video') && (
          <SpaceIntro
            key="intro"
            onEnter={(skipAll) => {
              if (skipAll === true) {
                setAppPhase('portfolio');
              } else {
                setAppPhase('video');
              }
            }}
            audio={audio}
          />
        )}

      {/* Pre-mount the video so it is ready instantly with zero loading delay */}
      {(appPhase === 'intro' || appPhase === 'video') && (
        <div
          key="video-transition"
          style={{
            position: 'fixed', inset: 0,
            zIndex: appPhase === 'video' ? 100000 : -1,
            opacity: appPhase === 'video' ? 1 : 0,
            background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center',
            pointerEvents: appPhase === 'video' ? 'auto' : 'none'
          }}
        >
          <video
            ref={videoRef}
            src="/planetto.mp4"
            muted={true}
            playsInline
            onTimeUpdate={(e) => {
              // Transition exactly at 9 seconds, only if we are in the video phase
              if (appPhase === 'video' && e.target.currentTime >= 9) {
                setAppPhase('portfolio');
              }
            }}
            onEnded={() => {
              if (appPhase === 'video') setAppPhase('portfolio');
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Cinematic Letterbox & Watermark Hider */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '15vh',
            background: 'linear-gradient(to top, #000000 20%, transparent 100%)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '15vh',
            background: 'linear-gradient(to bottom, #000000 20%, transparent 100%)',
            pointerEvents: 'none'
          }} />
        </div>
      )}

      {appPhase === 'portfolio' && (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <AudioController audio={audio} />
          <InsectTrailBackground />
          <main
            aria-label="Talib Khan — Full Stack Developer Portfolio"
            style={{ position: 'relative', zIndex: 10 }}
          >
            <Hero />
            <About />
            <Projects />
            <Footer />
          </main>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}

export default App;
