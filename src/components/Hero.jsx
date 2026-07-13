import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mouse } from 'lucide-react';

const texts = ['Hello, I am', 'Namaste, I am', 'Hola, I am'];

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer = setTimeout(() => {
      handleTyping();
    }, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum]);

  const handleTyping = () => {
    const i = loopNum % texts.length;
    const fullText = texts[i];

    setDisplayText(
      isDeleting
        ? fullText.substring(0, displayText.length - 1)
        : fullText.substring(0, displayText.length + 1)
    );

    setTypingSpeed(isDeleting ? 30 : 100);

    if (!isDeleting && displayText === fullText) {
      setTimeout(() => setIsDeleting(true), 1500); // pause at full text
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setTypingSpeed(500); // pause before starting new phrase
    }
  };

  return (
    <section id="hero" aria-label="Hero — Talib Khan Full Stack Developer" style={{
      height: '100vh',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
      background: '#000000'
    }}>
      {/* Main Content Layout */}
      <div className="hero-content" style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Centered content
        padding: '0 6rem',
      }}>
        <motion.div
          className="hero-text-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Centered items
            textAlign: 'center'
          }}
        >
          {/* Animated Greeting (Typing Effect) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', height: '2rem' }}>
            <span style={{
              fontSize: '1.5rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              fontFamily: 'Fira Code, monospace',
            }}>
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ display: 'inline-block', width: '2px', height: '1.5rem', backgroundColor: 'var(--text-secondary)', marginLeft: '4px', verticalAlign: 'middle' }}
              />
            </span>
          </div>

          {/* Big Name */}
          <h1 style={{
            fontSize: 'clamp(3rem, 12vw, 11rem)',
            fontWeight: 900,
            letterSpacing: '-3px',
            lineHeight: 1,
            marginBottom: '2rem',
            fontFamily: 'Outfit, sans-serif',
            color: '#fff',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            WebkitTextStroke: '3px #fff' // Added to make it look even bolder
          }}>
            Talib Khan.
          </h1>

          {/* Subtitle */}
          <p className="hero-desc" style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            fontWeight: 400,
            letterSpacing: '0.5px',
            marginBottom: '3.5rem',
            lineHeight: 1.6,
            maxWidth: '500px',
            fontFamily: 'Inter, sans-serif',
          }}>
            I build things that are fast, sharp, and actually enjoyable to use.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
