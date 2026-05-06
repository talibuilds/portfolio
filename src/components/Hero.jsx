import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei';

const AbstractGraphic = () => {
  return (
    <>
      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} scale={1.8}>
          <MeshDistortMaterial
            color="#d4af37"
            attach="material"
            distort={0.4}
            speed={1.5}
            roughness={0.2}
            metalness={0.9}
          />
        </Sphere>
      </Float>
    </>
  );
};

const Hero = () => {
  return (
    <section id="hero" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {/* 3D Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, opacity: 0.6 }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#d4af37" />
          <AbstractGraphic />
        </Canvas>
      </div>

      {/* Floating Decorators */}
      <motion.div 
        className="desktop-only"
        animate={{ y: [0, -15, 0] }} 
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        style={{ position: 'absolute', top: '25%', left: '15%', zIndex: 5, padding: '0.5rem 1.5rem', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '30px', color: 'var(--text-secondary)', fontSize: '0.9rem', letterSpacing: '1px' }}
      >
        <span style={{ color: 'var(--accent)' }}>✦</span> Creative Coding
      </motion.div>

      <motion.div 
        className="desktop-only"
        animate={{ y: [0, 15, 0] }} 
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
        style={{ position: 'absolute', bottom: '30%', right: '15%', zIndex: 5, padding: '0.5rem 1.5rem', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '30px', color: 'var(--text-secondary)', fontSize: '0.9rem', letterSpacing: '1px' }}
      >
        <span style={{ color: 'var(--accent)' }}>✦</span> Full Stack Architecture
      </motion.div>

      <motion.div 
        className="desktop-only"
        animate={{ y: [0, -10, 0] }} 
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 2 }}
        style={{ position: 'absolute', top: '15%', right: '20%', zIndex: 5, padding: '0.5rem 1.5rem', background: 'rgba(212, 175, 55, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '30px', color: 'var(--accent)', fontSize: '0.8rem', letterSpacing: '1px' }}
      >
        System Automation
      </motion.div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ zIndex: 10, textAlign: 'center', marginTop: '5vh', padding: '0 20px' }}
      >
        <p style={{ fontSize: '1rem', color: 'var(--accent)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>
          Welcome to the Future
        </p>
        <h1 style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', fontWeight: 800, letterSpacing: '-2px', color: 'var(--text-primary)', lineHeight: 1 }}>
          Talib Khan<span style={{ color: 'var(--accent)' }}>.</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 300, letterSpacing: '1px', marginTop: '1.5rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
          I build things that are fast, sharp, and actually enjoyable to use. From the backend logic to the pixel on screen.
        </p>
        
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <a href="#projects" style={{ padding: '1rem 2.5rem', background: 'var(--text-primary)', color: 'var(--bg-color)', borderRadius: '30px', fontWeight: 600, transition: 'all 0.3s' }}
             onMouseEnter={(e) => { e.target.style.background = 'var(--accent)'; e.target.style.transform = 'translateY(-3px)'; }}
             onMouseLeave={(e) => { e.target.style.background = 'var(--text-primary)'; e.target.style.transform = 'translateY(0)'; }}
          >
            View Projects
          </a>
        </div>
      </motion.div>

      <motion.a 
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        style={{ position: 'absolute', bottom: '5%', zIndex: 10, color: 'var(--text-secondary)' }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.a>
    </section>
  );
};

export default Hero;
