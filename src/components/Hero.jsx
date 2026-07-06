import React from 'react';
import { motion } from 'framer-motion';
import { Mouse } from 'lucide-react';

const Hero = () => {
  return (
    <section id="hero" aria-label="Hero — Talib Khan Full Stack Developer" style={{ height: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>

      {/* Background specific to Hero */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'url(/home_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'right center', // Focus on the right peak
        transform: 'scale(1.1) translateX(2vw)', // Shift slightly further right without exposing the left edge
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        {/* Stronger gradient to perfectly fade into the black background at the bottom and eliminate the partition line */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 0%, transparent 60%, #050505 98%, #050505 100%)'
        }} />
      </div>

      {/* Main Content Layout */}
      <div className="hero-content" style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 6rem',
        marginTop: '8vh',
      }}>

        {/* Left Column (Text) */}
        <motion.div
          className="hero-text-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ maxWidth: '650px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#fff', 
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              margin: 0
            }}>
              Hi, I'm
            </p>
            <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--accent)', opacity: 0.8 }} />
          </div>

          <h1 style={{
            fontSize: 'clamp(4rem, 8vw, 7rem)',
            fontWeight: 800,
            letterSpacing: '-2px',
            lineHeight: 1.1,
            marginBottom: '2rem',
            fontFamily: 'Outfit, sans-serif'
          }}>
            <span style={{ color: '#fff' }}>Talib </span>
            <span style={{ color: 'var(--accent)' }}>Khan.</span>
          </h1>

          <p className="hero-desc" style={{ 
            fontSize: '1.1rem', 
            color: 'var(--text-secondary)', 
            fontWeight: 400, 
            letterSpacing: '0.2px', 
            marginBottom: '3.5rem', 
            paddingLeft: '1.2rem',
            borderLeft: '2px solid rgba(210, 180, 140, 0.5)', // Subtle gold line
            lineHeight: 1.7,
            maxWidth: '400px',
            fontFamily: 'Inter, sans-serif',
          }}>
            I build things that are fast, sharp,<br/>and actually enjoyable to use.
          </p>

          {/* Action Buttons */}
          <div className="hero-buttons" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <a href="#projects" style={{
              padding: '0.9rem 2.5rem',
              background: 'var(--accent)',
              color: '#000',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 20px var(--accent-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              View Projects <span>→</span>
            </a>

            <a href="#about" style={{
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              textDecoration: 'none',
              transition: 'opacity 0.3s ease',
              opacity: 0.9
            }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.9'}
            >
              About Me
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: '3rem',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 10
      }}>
        <div style={{ width: '100%', maxWidth: '1400px', padding: '0 6rem' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              color: 'var(--text-secondary)'
            }}
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Mouse size={18} />
            </motion.div>
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif'
            }}>
              Scroll Down
            </span>
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
