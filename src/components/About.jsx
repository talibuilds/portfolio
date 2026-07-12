import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  // Syntax Highlighting Colors (One Dark Pro theme inspired)
  const colors = {
    keyword: '#c678dd',
    variable: '#e5c07b',
    operator: '#56b6c2',
    key: '#e06c75',
    string: '#98c379',
    punctuation: '#abb2bf',
    comment: '#7f848e'
  };

  return (
    <section id="about" aria-label="About Talib Khan" style={{
      padding: '120px 6rem 60px 6rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: 'var(--bg-color)',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            fontFamily: 'Outfit, sans-serif',
            marginBottom: '3rem',
            textAlign: 'center'
          }}>
            About <span style={{ color: 'var(--accent)' }}>Me</span>
          </h2>

          {/* IDE Window Mockup */}
          <div data-swarm-shape="curly" style={{
            maxWidth: '900px', // Restricts the width to remove empty space on the right
            margin: '0 auto', // Centers the IDE window
            background: '#1e1e1e', // VS Code dark background
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            fontFamily: 'Fira Code, Consolas, monospace',
            fontSize: '1.1rem',
            lineHeight: '1.8',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            {/* Top Window Bar */}
            <div style={{
              background: '#252526',
              padding: '0.8rem 1.2rem',
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
              </div>
              <div style={{ margin: '0 auto', fontSize: '0.9rem', color: '#969696', fontFamily: 'Inter, sans-serif' }}>
                about.tsx
              </div>
            </div>

            {/* Code Content */}
            <div className="about-ide-content" style={{ padding: '3rem 1.5rem', display: 'flex', overflowX: 'auto' }}>
              {/* Line Numbers */}
              <div style={{
                paddingRight: '2rem',
                color: '#858585',
                textAlign: 'right',
                userSelect: 'none',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {Array.from({ length: 8 }).map((_, i) => <span key={i}>{i + 1}</span>)}
              </div>

              {/* Comment Block */}
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', display: 'flex', flexDirection: 'column', color: '#ffffff' }}>
                <span style={{ color: '#7f848e' }}>/*</span>
                <span> I'm Talib Khan, a Full Stack Developer and Computer Science student who loves building</span>
                <span> fast, scalable, and visually engaging digital products. My focus lies in backend</span>
                <span> engineering, automation, AI-powered solutions, and crafting intuitive user experiences.</span>
                <span> </span>
                <span> I believe great software is built through clean architecture, thoughtful design,</span>
                <span> and continuous learning.</span>
                <span style={{ color: '#7f848e' }}> */</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
