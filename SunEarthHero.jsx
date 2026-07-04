import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ---------- Shaders ----------

const sunVert = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sunFrag = `
  uniform float time;
  uniform vec3 colorA;
  uniform vec3 colorB;
  uniform vec3 colorHot;
  varying vec3 vNormal;
  varying vec3 vPosition;

  float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719)))*43758.5453); }
  float vnoise(vec3 p){
    vec3 i = floor(p); vec3 f = fract(p);
    f = f*f*(3.0-2.0*f);
    float n000=hash(i), n100=hash(i+vec3(1,0,0)), n010=hash(i+vec3(0,1,0)), n110=hash(i+vec3(1,1,0));
    float n001=hash(i+vec3(0,0,1)), n101=hash(i+vec3(1,0,1)), n011=hash(i+vec3(0,1,1)), n111=hash(i+vec3(1,1,1));
    float nx00=mix(n000,n100,f.x), nx10=mix(n010,n110,f.x), nx01=mix(n001,n101,f.x), nx11=mix(n011,n111,f.x);
    float nxy0=mix(nx00,nx10,f.y), nxy1=mix(nx01,nx11,f.y);
    return mix(nxy0,nxy1,f.z);
  }
  float fbm(vec3 p){
    float v=0.0, amp=0.55;
    for(int i=0;i<5;i++){ v += amp*vnoise(p); p*=2.05; amp*=0.55; }
    return v;
  }

  void main() {
    vec3 p = vPosition * 2.2 + vec3(0.0, 0.0, time * 0.06);
    float n = fbm(p);
    float flicker = fbm(p * 3.0 + time * 0.3);
    vec3 col = mix(colorA, colorB, n);
    col = mix(col, colorHot, pow(flicker, 3.0) * 0.6);
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0,0.0,1.0))), 2.2);
    col += colorHot * fresnel * 0.35;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const glowVert = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFrag = `
  uniform vec3 glowColor;
  uniform float power;
  uniform float intensity;
  varying vec3 vNormal;
  void main() {
    float d = pow(0.55 - dot(vNormal, vec3(0.0,0.0,1.0)), power);
    gl_FragColor = vec4(glowColor, clamp(d,0.0,1.0) * intensity);
  }
`;

const earthVert = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFrag = `
  uniform vec3 lightDir;
  varying vec3 vNormal;
  varying vec3 vPosition;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3,289.1)))*43758.5453); }
  float vnoise(vec2 p){
    vec2 i=floor(p); vec2 f=fract(p);
    f = f*f*(3.0-2.0*f);
    float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
    return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
  }
  float fbm2(vec2 p){
    float v=0.0, amp=0.5;
    for(int i=0;i<4;i++){ v += amp*vnoise(p); p*=2.1; amp*=0.5; }
    return v;
  }

  void main() {
    vec3 n = normalize(vNormal);
    float diff = dot(n, normalize(lightDir));
    float land = fbm2(vPosition.xy * 2.5 + vPosition.z * 1.8);
    vec3 ocean = vec3(0.04, 0.22, 0.5);
    vec3 continent = vec3(0.24, 0.42, 0.18);
    vec3 base = mix(ocean, continent, step(0.53, land));

    float term = smoothstep(-0.15, 0.2, diff);
    float nightGlow = smoothstep(-0.05, -0.3, diff) * 0.06;
    vec3 lit = base * (0.2 + max(diff,0.0) * 1.1);
    vec3 col = mix(base * 0.04 + nightGlow, lit, term);

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ---------- Component ----------

export default function SunEarthHero() {
  const mountRef = useRef(null);
  const stateRef = useRef({});
  const [orbitSpeed, setOrbitSpeed] = useState(0.25);
  const [spinSpeed, setSpinSpeed] = useState(0.6);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 60 + Math.random() * 140;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xd4af37, size: 0.35, transparent: true, opacity: 0.55 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Sun group
    const sunGroup = new THREE.Group();
    sunGroup.position.set(3.2, 0.6, 0);
    scene.add(sunGroup);

    const sunUniforms = {
      time: { value: 0 },
      colorA: { value: new THREE.Color("#8a5a12") },
      colorB: { value: new THREE.Color("#e8c15a") },
      colorHot: { value: new THREE.Color("#fff2c2") },
    };
    const sunGeo = new THREE.SphereGeometry(1.5, 64, 64);
    const sunMat = new THREE.ShaderMaterial({ vertexShader: sunVert, fragmentShader: sunFrag, uniforms: sunUniforms });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sunGroup.add(sun);

    // Corona glow (soft, additive, larger)
    const coronaGeo = new THREE.SphereGeometry(1.85, 64, 64);
    const coronaMat = new THREE.ShaderMaterial({
      vertexShader: glowVert,
      fragmentShader: glowFrag,
      uniforms: { glowColor: { value: new THREE.Color("#d4af37") }, power: { value: 2.0 }, intensity: { value: 1.0 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    sunGroup.add(corona);

    // Outer halo (even softer, bigger)
    const haloGeo = new THREE.SphereGeometry(2.6, 64, 64);
    const haloMat = new THREE.ShaderMaterial({
      vertexShader: glowVert,
      fragmentShader: glowFrag,
      uniforms: { glowColor: { value: new THREE.Color("#8a6a1f") }, power: { value: 3.0 }, intensity: { value: 0.8 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    sunGroup.add(halo);

    // Sun point light (lights the earth)
    const sunLight = new THREE.PointLight(0xfff0c0, 3.2, 50, 1.2);
    sunGroup.add(sunLight);
    scene.add(new THREE.AmbientLight(0x0a0a12, 1.0));

    // Earth
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const earthUniforms = { lightDir: { value: new THREE.Vector3(1, 0, 0) } };
    const earthGeo = new THREE.SphereGeometry(0.55, 64, 64);
    const earthMat = new THREE.ShaderMaterial({ vertexShader: earthVert, fragmentShader: earthFrag, uniforms: earthUniforms });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.rotation.z = 0.41; // axial tilt
    earthGroup.add(earth);

    const atmoGeo = new THREE.SphereGeometry(0.62, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: glowVert,
      fragmentShader: glowFrag,
      uniforms: { glowColor: { value: new THREE.Color("#6fb8ff") }, power: { value: 2.4 }, intensity: { value: 0.9 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const atmo = new THREE.Mesh(atmoGeo, atmoMat);
    earthGroup.add(atmo);

    // Faint orbit ring
    const orbitRadius = 4.6;
    const ringGeo = new THREE.RingGeometry(orbitRadius - 0.006, orbitRadius + 0.006, 128);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.12, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2 + 0.15;
    ring.position.copy(sunGroup.position);
    scene.add(ring);

    // Camera orbit controls (manual, since OrbitControls isn't available in this three build)
    let camAngle = 0.6, camElev = 0.35, camDist = 8.5;
    let dragging = false, lastX = 0, lastY = 0;

    function updateCamera() {
      const x = camDist * Math.cos(camElev) * Math.sin(camAngle);
      const y = camDist * Math.sin(camElev);
      const z = camDist * Math.cos(camElev) * Math.cos(camAngle);
      camera.position.set(x, y, z);
      camera.lookAt(1.5, 0, 0);
    }
    updateCamera();

    const onDown = (e) => { dragging = true; lastX = e.clientX ?? e.touches?.[0].clientX; lastY = e.clientY ?? e.touches?.[0].clientY; };
    const onUp = () => { dragging = false; };
    const onMove = (e) => {
      if (!dragging) return;
      const x = e.clientX ?? e.touches?.[0].clientX;
      const y = e.clientY ?? e.touches?.[0].clientY;
      camAngle -= (x - lastX) * 0.005;
      camElev = Math.max(-0.9, Math.min(0.9, camElev + (y - lastY) * 0.005));
      lastX = x; lastY = y;
      updateCamera();
    };
    const onWheel = (e) => {
      e.preventDefault();
      camDist = Math.max(4, Math.min(16, camDist + e.deltaY * 0.01));
      updateCamera();
    };

    renderer.domElement.addEventListener("mousedown", onDown);
    renderer.domElement.addEventListener("touchstart", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    // Resize
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    stateRef.current = { orbitSpeed, spinSpeed };

    let angle = 0;
    let raf;
    const clock = new THREE.Clock();
    function animate() {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const t = clock.elapsedTime;

      sunUniforms.time.value = t;
      sun.rotation.y += dt * 0.05;

      angle += dt * stateRef.current.orbitSpeed;
      earthGroup.position.set(
        sunGroup.position.x + Math.cos(angle) * orbitRadius,
        sunGroup.position.y,
        sunGroup.position.z + Math.sin(angle) * orbitRadius * Math.cos(0.15)
      );
      earth.rotation.y += dt * stateRef.current.spinSpeed;

      const lightDir = new THREE.Vector3().subVectors(sunGroup.position, earthGroup.position).normalize();
      earthUniforms.lightDir.value.copy(lightDir);

      stars.rotation.y += dt * 0.003;

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("mousedown", onDown);
      renderer.domElement.removeEventListener("touchstart", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      renderer.domElement.removeEventListener("wheel", onWheel);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    stateRef.current.orbitSpeed = orbitSpeed;
    stateRef.current.spinSpeed = spinSpeed;
  }, [orbitSpeed, spinSpeed]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 500, background: "#000" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />
      <div
        style={{
          position: "absolute", bottom: 16, left: 16, display: "flex", gap: 20,
          background: "rgba(15,15,15,0.7)", border: "1px solid rgba(212,175,55,0.3)",
          borderRadius: 10, padding: "10px 16px", fontFamily: "sans-serif", fontSize: 12, color: "#d4af37",
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Orbit speed
          <input type="range" min="0" max="1.2" step="0.01" value={orbitSpeed} onChange={(e) => setOrbitSpeed(parseFloat(e.target.value))} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Earth spin
          <input type="range" min="0" max="2" step="0.01" value={spinSpeed} onChange={(e) => setSpinSpeed(parseFloat(e.target.value))} />
        </label>
      </div>
      <div style={{ position: "absolute", top: 10, right: 16, color: "#555", fontFamily: "sans-serif", fontSize: 11 }}>
        drag to orbit · scroll to zoom
      </div>
    </div>
  );
}
