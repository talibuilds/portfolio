import React, { useRef, useEffect, useState, useCallback, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, useTexture, useProgress } from '@react-three/drei';
import * as THREE from 'three';

/* ================================================================
   PERFECTED 20,000-UNIT CHOREOGRAPHY
   - Phase 1: Idle at Z=0. Pitch black space, asteroids, distant Milky Way.
   - Phase 2: Enter button clicked. Accelerate towards Milky Way.
   - Phase 3: Pass through Milky Way (Z=-4000). It fades out.
   - Phase 4: Sun fades in (Z=-10000) and we fly past it.
   - Phase 5: Pass Planets (Z=-14000 to -18000).
   - Phase 6: Arrive at Earth (Z=-20000).
   ================================================================ */

const TEXTURES = {
  galaxy: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=2048&q=80&fm=jpg',
  earthColor: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
  earthSpecular: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
  earthNormal: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
  earthClouds: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
  moon: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg'
};

// ─── Earth Component (Z = -20000) ────────────────────────────
function Earth({ position }) {
  const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
    TEXTURES.earthColor, TEXTURES.earthNormal, TEXTURES.earthSpecular, TEXTURES.earthClouds
  ]);
  const cloudsRef = useRef();
  const earthRef = useRef();
  const glowRef1 = useRef();
  const glowRef2 = useRef();

  useFrame((state) => {
    // Visible movement
    if (earthRef.current) earthRef.current.rotation.y += 0.003;
    if (cloudsRef.current) cloudsRef.current.rotation.y += 0.004;

    // Smoothly fade out the blue atmospheric borders as the camera gets extremely close
    const camZ = state.camera.position.z;
    const earthZ = position[2];
    const dist = Math.abs(camZ - earthZ);
    
    // Start fading when camera is within 200 units, completely invisible by 20 units
    const fade = Math.max(0, Math.min(1, (dist - 20) / 180));
    
    if (glowRef1.current) glowRef1.current.material.opacity = 0.2 * fade;
    if (glowRef2.current) glowRef2.current.material.opacity = 0.08 * fade;
  });

  return (
    <group position={position}>
      {/* Dedicated sunlight for Earth so the high-res textures are perfectly lit */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 5, 20]} intensity={4.5} color="#ffffff" />
      <directionalLight position={[-10, -5, -20]} intensity={2.0} color="#aaccff" />
      
      <mesh ref={earthRef} rotation={[0.2, 2.8, 0]}>
        <sphereGeometry args={[15, 128, 128]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          specularMap={specularMap}
          shininess={25}
        />
      </mesh>
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[15.2, 128, 128]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Intense Glowing Atmosphere */}
      <mesh ref={glowRef1}>
        <sphereGeometry args={[15.6, 64, 64]} />
        <meshBasicMaterial color="#3377ff" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      
      {/* Outer atmospheric glow for far visibility */}
      <mesh ref={glowRef2}>
        <sphereGeometry args={[18, 64, 64]} />
        <meshBasicMaterial color="#4488ff" transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// ─── Realistic Sun with Corona (Z = -12000) ──────────────────
function Sun({ position }) {
  const coreRef = useRef();
  const glowRef = useRef();
  const lightRef = useRef();
  const map = useTexture(TEXTURES.moon);
  
  useFrame((state) => {
    const camZ = state.camera.position.z;
    const fade = camZ > -3000 ? 0 : Math.min(1, (-3000 - camZ) / 3000);
    
    if (coreRef.current) {
      coreRef.current.material.opacity = fade * 0.95;
      coreRef.current.rotation.y -= 0.002;
    }
    if (glowRef.current) glowRef.current.material.opacity = fade * 0.2;
    if (lightRef.current) lightRef.current.intensity = 40 * fade;
  });

  return (
    <group position={position}>
      <pointLight ref={lightRef} intensity={0} distance={15000} decay={1.2} color="#fff4e0" />
      
      {/* 3D Textured Surface to make it feel like a real spherical body */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[180, 64, 64]} />
        <meshStandardMaterial 
          map={map}
          color="#ffaa00"
          emissive="#ffcc44"
          emissiveIntensity={2.5}
          roughness={0.4}
          transparent 
          opacity={0} 
        />
      </mesh>
      
      {/* Soft atmospheric rim similar to the other planets */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[205, 64, 64]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// ─── Galaxy Background (Z = -8000) ───────────────────────────
function GalaxyBackground() {
  const tex = useTexture(TEXTURES.galaxy);
  const matRef = useRef();
  
  useFrame((state) => {
    if (!matRef.current) return;
    const dist = state.camera.position.z - (-8000);
    const fade = Math.max(0, Math.min(1, (dist - 4000) / 2000));
    matRef.current.opacity = 1.0 * fade;
  });

  return (
    <mesh position={[0, 0, -8000]} scale={[24000, 16000, 1]}>
      <planeGeometry />
      <meshBasicMaterial ref={matRef} map={tex} transparent={true} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

// ─── Procedural Asteroid Belt ────────────────────────────────
function AsteroidBelt() {
  const rockTex = useTexture(TEXTURES.moon);
  const meshRef = useRef();
  const count = 700;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const asteroids = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const z = Math.random() * -19500;
      const radius = 80 + Math.random() * 1200;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const rotSpeedX = (Math.random() - 0.5) * 0.04;
      const rotSpeedY = (Math.random() - 0.5) * 0.04;
      const scale = 0.5 + Math.random() * 4;
      temp.push({ x, y, z, rotSpeedX, rotSpeedY, rx: Math.random() * Math.PI, ry: Math.random() * Math.PI, scale });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    asteroids.forEach((ast, i) => {
      ast.rx += ast.rotSpeedX;
      ast.ry += ast.rotSpeedY;
      dummy.position.set(ast.x, ast.y, ast.z);
      dummy.rotation.set(ast.rx, ast.ry, 0);
      dummy.scale.set(ast.scale, ast.scale * 0.7, ast.scale * 1.2);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial map={rockTex} color="#666" roughness={0.9} />
    </instancedMesh>
  );
}

// ─── Visible Planet with self-illumination ───────────────────
function Planet({ position, textureUrl, size, rotationSpeed, color, emissiveColor, emissiveIntensity = 0.3, ringColor, ringSize }) {
  const map = useTexture(textureUrl);
  const ref = useRef();
  
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += rotationSpeed;
  });
  
  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial map={map} roughness={0.7} metalness={0.15} color={color || '#ffffff'} emissive={emissiveColor || color || '#553311'} emissiveIntensity={emissiveIntensity} />
      </mesh>
      <mesh>
        <sphereGeometry args={[size * 1.15, 32, 32]} />
        <meshBasicMaterial color={emissiveColor || color || '#ffffff'} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      {ringColor && (
        <mesh rotation={[Math.PI * 0.4, 0.2, 0]}>
          <ringGeometry args={[size * 1.4, size * (ringSize || 2.2), 64]} />
          <meshBasicMaterial color={ringColor} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

// ─── Nebula Dust Cloud for atmosphere ────────────────────────
function NebulaDust({ position, color, size = 200, opacity = 0.04 }) {
  const ref = useRef();
  
  useFrame((state) => {
    if (!ref.current) return;
    const camZ = state.camera.position.z;
    const dist = Math.abs(camZ - position[2]);
    const vis = dist < 4000 ? Math.max(0, 1 - dist / 4000) : 0;
    ref.current.material.opacity = opacity * vis;
    ref.current.rotation.z += 0.0003;
  });
  
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Camera Smooth Journey Controller ────────────────────────
function CameraController({ phase }) {
  const timeRef = useRef(0);
  
  useFrame((state, delta) => {
    const mouseX = state.pointer.x * 300; 
    const mouseY = state.pointer.y * 300; 
    
    if (phase === 'idle') {
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouseX, 0.05);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouseY, 0.05);
      state.camera.position.z = 0;
      state.camera.lookAt(0, 0, -20000);
      return;
    }

    if (phase !== 'warping') return;

    timeRef.current += delta;
    const t = timeRef.current;
    const duration = 30;
    let p = Math.min(t / duration, 1);
    const spiralRadius = 500 * Math.pow(1 - p, 1.8); 
    const angle = t * 1.5; 
    const easeInOut = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    const targetZ = -19950 * easeInOut;
    
    // Maintain a base influence of 0.2 even at the end of the journey
    const mouseInfluence = Math.pow(1 - p, 2) * 0.8 + 0.2;
    const currentX = Math.sin(angle) * spiralRadius + mouseX * mouseInfluence;
    const currentY = Math.cos(angle) * spiralRadius + mouseY * mouseInfluence;
    const lerpFactor = 0.1 + p * 0.15;
    
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, currentX, lerpFactor);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, currentY, lerpFactor);
    
    let finalZ = targetZ;
    if (t > 30) {
      const extraZoomProgress = Math.min((t - 30) / 4, 1);
      finalZ -= 33 * extraZoomProgress;
    }
    state.camera.position.z = finalZ;
    
    // Look at target also influenced by mouse for parallax
    const lookAtX = mouseX * mouseInfluence * 0.4;
    const lookAtY = mouseY * mouseInfluence * 0.4;
    state.camera.lookAt(lookAtX, lookAtY, -20000);

    // Apply a slight roll (z-rotation) based on horizontal mouse movement to give a "bent" flying sensation
    state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, -(mouseX / 300) * 0.05, 0.1);
  });

  return null;
}

// ─── Main 3D Scene Assembly ──────────────────────────────────
function CosmicScene({ phase }) {
  useTexture(Object.values(TEXTURES));
  return (
    <>
      <CameraController phase={phase} />
      <ambientLight intensity={0.08} color="#ffffff" />
      <Stars radius={300} depth={500} count={12000} factor={4} saturation={0} fade speed={0.5} />
      <GalaxyBackground />
      <Sun position={[600, 300, -12000]} />
      <AsteroidBelt />
      <Planet position={[-300, -60, -14000]} textureUrl={TEXTURES.moon} size={70} rotationSpeed={0.003} color="#cc4422" emissiveColor="#aa3311" emissiveIntensity={0.5} />
      <Planet position={[450, 180, -15200]} textureUrl={TEXTURES.moon} size={120} rotationSpeed={0.004} color="#dd9955" emissiveColor="#bb7733" emissiveIntensity={0.4} />
      <Planet position={[-500, 100, -16200]} textureUrl={TEXTURES.moon} size={90} rotationSpeed={0.002} color="#ddcc88" emissiveColor="#bbaa55" emissiveIntensity={0.4} ringColor="#ccbb77" ringSize={2.5} />
      <Planet position={[200, -150, -17000]} textureUrl={TEXTURES.moon} size={40} rotationSpeed={0.005} color="#884422" emissiveColor="#663311" emissiveIntensity={0.5} />
      <Planet position={[-250, 200, -17800]} textureUrl={TEXTURES.moon} size={55} rotationSpeed={0.0025} color="#4488bb" emissiveColor="#336699" emissiveIntensity={0.45} />
      <Planet position={[350, -80, -18500]} textureUrl={TEXTURES.moon} size={25} rotationSpeed={0.006} color="#887766" emissiveColor="#665544" emissiveIntensity={0.4} />
      <NebulaDust position={[-200, 50, -13500]} color="#ff4400" size={300} opacity={0.03} />
      <NebulaDust position={[300, -100, -15000]} color="#ff6633" size={250} opacity={0.025} />
      <NebulaDust position={[-100, 150, -16800]} color="#3366ff" size={200} opacity={0.02} />
      <NebulaDust position={[150, -50, -18200]} color="#4488cc" size={180} opacity={0.02} />
      <Earth position={[0, 0, -20000]} />
    </>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: 'red', color: 'white', zIndex: 999999, position: 'relative' }}>
          <h2>Something went wrong in SpaceIntro.</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error && this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function SceneStabilizer({ onStable }) {
  const frameCount = useRef(0);
  const signaled = useRef(false);
  useFrame(() => {
    if (signaled.current) return;
    frameCount.current++;
    if (frameCount.current >= 30) {
      signaled.current = true;
      onStable();
    }
  });
  return null;
}

function useImagePreloader(urls) {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const urlList = Object.values(urls);
    let loadedCount = 0;
    const total = urlList.length;
    const onLoad = () => {
      loadedCount++;
      setProgress(Math.round((loadedCount / total) * 100));
      if (loadedCount >= total) setLoaded(true);
    };
    urlList.forEach((url) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = onLoad;
      img.onerror = onLoad;
      img.src = url;
    });
  }, [urls]);
  return { progress, loaded };
}

function LoaderCard({ loadProgress, isLoaded, onEnter, onSkip, audio }) {
  const handleEnter = useCallback(() => {
    if (!isLoaded) return;
    if (audio) audio.play().catch((err) => console.warn('Audio playback failed:', err));
    onEnter();
  }, [onEnter, audio, isLoaded]);

  const handleSkip = useCallback(() => {
    if (audio) audio.play().catch((err) => console.warn('Audio playback failed:', err));
    onSkip();
  }, [onSkip, audio]);

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
      style={{
        pointerEvents: 'auto',
        background: 'rgba(8, 8, 10, 0.55)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(212, 175, 55, 0.12)',
        padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 2.5rem)',
        borderRadius: '24px',
        textAlign: 'center',
        maxWidth: '480px',
        width: '92%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.2rem',
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
        style={{
          width: '64px', height: '64px',
          borderRadius: '50%',
          border: '1.5px solid rgba(212, 175, 55, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', inset: '4px', borderRadius: '50%', border: '1px dashed rgba(212, 175, 55, 0.25)' }} />
        <span style={{ color: '#d4af37', fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>T</span>
      </motion.div>
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, letterSpacing: 'clamp(6px, 1vw, 10px)', color: '#ffffff', margin: 0 }}
        >
          TALIB KHAN<span style={{ color: '#d4af37' }}>.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          style={{ color: '#888888', fontSize: '0.85rem', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 500, marginTop: '0.4rem' }}
        >
          Developer Portfolio
        </motion.p>
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 60 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{ color: '#aaaaaa', fontSize: '0.9rem', lineHeight: 1.7, margin: 0, maxWidth: '380px' }}
      >
        The world is a simulation where every choice writes a new line of code.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <motion.button
          onClick={handleEnter}
          disabled={!isLoaded}
          whileHover={isLoaded ? { scale: 1.06, boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' } : {}}
          whileTap={isLoaded ? { scale: 0.95 } : {}}
          style={{
            padding: '14px 32px',
            background: isLoaded ? 'linear-gradient(135deg, #d4af37 0%, #b8962e 50%, #d4af37 100%)' : '#333',
            backgroundSize: '200% 200%',
            color: isLoaded ? '#030303' : '#888', border: 'none', borderRadius: '32px',
            fontSize: '0.9rem', fontWeight: 700, letterSpacing: '1.5px',
            cursor: isLoaded ? 'pointer' : 'wait',
            boxShadow: isLoaded ? '0 0 24px rgba(212, 175, 55, 0.35)' : 'none',
            fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase',
            transition: 'background 0.3s ease, color 0.3s ease'
          }}
        >
          {isLoaded ? 'Plug into Simulation' : `Loading Universe... ${Math.round(loadProgress)}%`}
        </motion.button>
        {isLoaded && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            onClick={handleSkip}
            whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '14px 24px',
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(8px)',
              color: '#888', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '32px',
              fontSize: '0.82rem', fontWeight: 500, letterSpacing: '1px',
              cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ccc'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; }}
          >
            Skip & Enter
          </motion.button>
        )}
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{ color: '#555555', fontSize: '0.72rem', letterSpacing: '0.5px' }}
      >
        🎹 Interstellar theme will play
      </motion.span>
    </motion.div>
  );
}

const SpaceIntro = ({ onEnter, audio }) => {
  const [phase, setPhase] = useState('idle'); 
  const [canvasMounted, setCanvasMounted] = useState(false);
  const [sceneStable, setSceneStable] = useState(false);
  const { progress: loadProgress, loaded: texturesLoaded } = useImagePreloader(TEXTURES);

  const warpTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (warpTimeoutRef.current) {
        clearTimeout(warpTimeoutRef.current);
      }
    };
  }, []);

  const handleSceneStable = useCallback(() => {
    setTimeout(() => {
      setSceneStable(true);
    }, 400);
  }, []);

  const handleSkip = useCallback(() => {
    onEnter(true); // skipAll = true
  }, [onEnter]);

  const handleStartWarp = useCallback(() => {
    setCanvasMounted(true);
    setPhase('warping');
    warpTimeoutRef.current = setTimeout(() => {
      onEnter();
    }, 34000);
  }, [onEnter]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#000000', overflow: 'hidden',
    }}>
      {canvasMounted && (
        <Canvas 
          camera={{ position: [0, 0, 0], fov: 60, near: 10, far: 25000 }}
          gl={{ 
            antialias: false, 
            powerPreference: "high-performance",
            alpha: false,
          }}
          style={{ background: '#000000' }}
        >
          <Suspense fallback={null}>
            <CosmicScene phase={phase} setPhase={setPhase} />
            <SceneStabilizer onStable={handleSceneStable} />
          </Suspense>
        </Canvas>
      )}

      {/* Opaque black overlay — covers the Canvas until GPU is stable.
          On idle screen this is just black-on-black (invisible).
          After Enter click, it hides the Canvas init, then fades out smoothly. */}
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 40,
          background: '#000000',
          opacity: sceneStable ? 0 : 1,
          transition: 'opacity 1.5s ease-out',
          pointerEvents: sceneStable ? 'none' : 'auto',
        }}
      />

      <AnimatePresence>
        {phase === 'warping' && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 3, duration: 1 }}
            onClick={handleSkip}
            style={{
              position: 'absolute', bottom: '40px', right: '40px', zIndex: 90,
              background: 'rgba(20, 20, 25, 0.6)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)', color: '#aaaaaa',
              padding: '10px 24px', borderRadius: '20px', fontSize: '0.85rem',
              letterSpacing: '1px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
              textTransform: 'uppercase', transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#aaaaaa';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Skip Intro ⏭
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'idle' && (
          <motion.div
            key="card-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(12px)' }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              zIndex: 50, padding: '20px', pointerEvents: 'none',
            }}
          >
            <LoaderCard 
              loadProgress={loadProgress}
              isLoaded={texturesLoaded}
              onEnter={handleStartWarp}
              onSkip={handleSkip}
              audio={audio}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function SpaceIntroWithErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <SpaceIntro {...props} />
    </ErrorBoundary>
  );
}

