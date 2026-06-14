import React, { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SpaceTimeGrid = () => {
  const mass1Ref = useRef();
  const mass2Ref = useRef();
  
  const { planeGeo, lineGeo } = useMemo(() => {
    const divisions = 60;
    const geo = new THREE.PlaneGeometry(40, 40, divisions, divisions);
    geo.rotateX(-Math.PI / 2); // Lay flat
    
    // Create custom line segments to remove diagonal triangles
    const edges = new THREE.BufferGeometry();
    const indices = [];
    
    // Horizontal lines
    for (let y = 0; y <= divisions; y++) {
      for (let x = 0; x < divisions; x++) {
        const i1 = y * (divisions + 1) + x;
        indices.push(i1, i1 + 1);
      }
    }
    // Vertical lines
    for (let x = 0; x <= divisions; x++) {
      for (let y = 0; y < divisions; y++) {
        const i1 = y * (divisions + 1) + x;
        const i2 = (y + 1) * (divisions + 1) + x;
        indices.push(i1, i2);
      }
    }
    edges.setAttribute('position', geo.attributes.position); // Share vertex buffer!
    edges.setIndex(indices);
    
    return { planeGeo: geo, lineGeo: edges };
  }, []);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Orbital mechanics: Barycenter physics. 
    // The Sun wobbles slightly in exact opposition to the Earth's orbit.
    const earthAngle = t * 0.8;
    const sunWobbleRadius = 0.6; // Sun's reaction to Earth
    const earthOrbitRadius = 8;
    
    // Sun position (opposite to Earth)
    const m1x = Math.sin(earthAngle + Math.PI) * sunWobbleRadius; 
    const m1z = Math.cos(earthAngle + Math.PI) * sunWobbleRadius;
    
    // Earth position
    const m2x = Math.sin(earthAngle) * earthOrbitRadius;
    const m2z = Math.cos(earthAngle) * earthOrbitRadius;

    const positions = planeGeo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      
      const dist1 = Math.sqrt((x - m1x)**2 + (z - m1z)**2);
      const dist2 = Math.sqrt((x - m2x)**2 + (z - m2z)**2);
      
      let y = 0;
      // Sun gravity well (deep and wide)
      if (dist1 < 12) y += -5.0 * Math.exp(-dist1 * dist1 / 10);
      // Earth gravity well (smaller)
      if (dist2 < 6) y += -1.5 * Math.exp(-dist2 * dist2 / 3);
      
      // Subtle background ripple to make space feel alive
      y += Math.sin(x * 0.5 + t) * 0.05 + Math.cos(z * 0.5 + t) * 0.05;
      
      positions.setY(i, y);
    }
    positions.needsUpdate = true;
    
    // Update spheres to sink perfectly into their own gravity wells
    // We add an offset equal to roughly 80% of their radius so they look like they are physically resting *in* the fabric curve
    if (mass1Ref.current) {
      const d12 = Math.sqrt((m1x - m2x)**2 + (m1z - m2z)**2);
      let bottomOfWell1 = -5.0 - 1.5 * Math.exp(-d12 * d12 / 3);
      mass1Ref.current.position.set(m1x, bottomOfWell1 + 1.0, m1z); // Sun radius is 1.5
    }
    if (mass2Ref.current) {
      const d21 = Math.sqrt((m2x - m1x)**2 + (m2z - m1z)**2);
      let bottomOfWell2 = -1.5 - 5.0 * Math.exp(-d21 * d21 / 10);
      mass2Ref.current.position.set(m2x, bottomOfWell2 + 0.3, m2z); // Earth radius is 0.5
    }
  });

  return (
    <group position={[0, 0.5, -12]} rotation={[0.4, 0, 0]}>
      {/* The Rectangular Space-Time Fabric (No diagonals) */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </lineSegments>
      
      {/* Sun (Heavy, Glowing Center) */}
      <mesh ref={mass1Ref}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ff6600" emissiveIntensity={2} roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Earth (Smaller, Blue/Green Orbiting) */}
      <mesh ref={mass2Ref}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#00aaff" emissive="#004488" emissiveIntensity={0.8} roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  );
};

const Hero = () => {
  return (
    <section id="hero" aria-label="Hero — Talib Khan Full Stack Developer" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {/* 3D Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, opacity: 0.6 }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#d4af37" />
          <SpaceTimeGrid />
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
        style={{ zIndex: 10, textAlign: 'center', marginTop: '-10vh', padding: '0 20px', pointerEvents: 'none' }}
      >
        <p style={{ fontSize: 'clamp(0.8rem, 2vw, 1rem)', color: 'var(--accent)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>
          Welcome to the Future
        </p>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 800, letterSpacing: '-2px', color: 'var(--text-primary)', lineHeight: 1 }}>
          Talib Khan<span style={{ color: 'var(--accent)' }}>.</span>
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', color: 'var(--text-secondary)', fontWeight: 300, letterSpacing: '1px', marginTop: '1.5rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
          I build things that are fast, sharp, and actually enjoyable to use. From the backend logic to the pixel on screen.
        </p>
      </motion.div>

      {/* Action Button - Pinned to bottom to avoid overlapping 3D canvas */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{ position: 'absolute', bottom: '12vh', zIndex: 15 }}
      >
        <a href="#projects" style={{ padding: '1rem 2.5rem', background: 'var(--text-primary)', color: 'var(--bg-color)', borderRadius: '30px', fontWeight: 600, transition: 'all 0.3s', display: 'inline-block' }}
           onMouseEnter={(e) => { e.target.style.background = 'var(--accent)'; e.target.style.transform = 'translateY(-3px)'; }}
           onMouseLeave={(e) => { e.target.style.background = 'var(--text-primary)'; e.target.style.transform = 'translateY(0)'; }}
        >
          View Projects
        </a>
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
