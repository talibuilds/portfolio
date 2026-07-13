import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import Matter from 'matter-js';

const PhysicsText = ({ text = 'TALIB' }) => {
  const containerRef = useRef(null);
  const letterRefs = useRef([]);
  const engineRef = useRef(null);
  const renderLoopRef = useRef(null);
  const [isPhysicsReady, setIsPhysicsReady] = useState(false);
  const [bodiesData, setBodiesData] = useState([]);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    let timeoutId = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }, 300); // Debounce resize to prevent jitter
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Generate massive 3D text shadow for the "real 3D object" feel
  const solid3D = Array.from({ length: 30 }, (_, i) => {
    const shade = Math.max(20, 100 - i * 2.5); // Gradient from #646464 down to near black
    return `0px ${i}px 0px rgb(${shade}, ${shade}, ${shade})`;
  }).join(', ');

  const massive3DShadow = `${solid3D}, 0px 45px 30px rgba(0,0,0,0.7), 0px 80px 80px rgba(0,0,0,0.9)`;

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;

    const engine = Engine.create({
      positionIterations: 10,
      velocityIterations: 10
    });
    engineRef.current = engine;

    // Make gravity feel realistic when dropped
    engine.world.gravity.y = 1.8;

    const containerBounds = containerRef.current.getBoundingClientRect();
    const width = containerBounds.width;
    const height = containerBounds.height;

    // Create bounds
    // We add a floor slightly below the visible area, and massive walls so bodies can't glitch through
    const ground = Bodies.rectangle(width / 2, height + 50, width * 3, 100, {
      isStatic: true,
      restitution: 0.2
    });
    // Massive walls (2000px thick) to prevent tunneling when dragged wildly
    const wallLeft = Bodies.rectangle(-1000, height / 2, 2000, height * 5, { isStatic: true });
    const wallRight = Bodies.rectangle(width + 1000, height / 2, 2000, height * 5, { isStatic: true });

    // Place the ceiling exactly 18rem (288px) above the container, which is the exact height of the Contact form.
    // Height is 2000, so center y is -1288 to make the bottom face sit precisely at -288.
    const ceiling = Bodies.rectangle(width / 2, -1288, width * 5, 2000, {
      isStatic: true,
      restitution: 0.6 // Bouncy ceiling for natural collisions
    });

    Composite.add(engine.world, [ground, wallLeft, wallRight, ceiling]);

    const newBodiesData = [];

    // Measure each letter's initial DOM position and create a physics body for it
    letterRefs.current.forEach((el, index) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();

      // Calculate position relative to container
      const x = rect.left - containerBounds.left + rect.width / 2;
      const y = rect.top - containerBounds.top + rect.height / 2;

      // Spawn them close to their natural resting position so they just gently settle on the ground when scrolled into view
      const startY = y - 20;

      // Create a rigid body matching the letter's dimensions
      const body = Bodies.rectangle(x, startY, rect.width * 0.7, rect.height * 0.75, {
        restitution: 0.4, // Less bouncy, more heavy impact
        friction: 0.2,
        density: 0.2,     // Very heavy feel
        frictionAir: 0.01, // Slight air resistance
        chamfer: { radius: 10 }
      });

      // Give it a tiny bit of random initial velocity so they don't look completely rigid
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 2,
        y: -Math.random() * 2
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);

      Composite.add(engine.world, body);

      newBodiesData.push({
        id: index,
        char: text[index],
        body: body,
        width: rect.width,
        height: rect.height
      });
    });

    setBodiesData(newBodiesData);

    // Add Mouse interaction
    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.8, // High stiffness so it rigidly grabs the exact point clicked (corner, edge, etc)
        angularStiffness: 0.8, // Allows proper rotational torque when lifted from a side
        damping: 0.1,
        render: { visible: false }
      }
    });

    // Fix scroll capture issue (allows page scrolling when not dragging a body)
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    mouse.element.removeEventListener('touchmove', mouse.mousemove);
    mouse.element.removeEventListener('touchstart', mouse.mousedown);
    mouse.element.removeEventListener('touchend', mouse.mouseup);

    // FIX FOR STUCK BUG: Force the mouse to release if the user lifts their finger/mouse button
    // anywhere on the screen (even outside the container).
    const handleGlobalRelease = () => {
      mouse.button = -1;
      mouse.mousedownPosition = null;
    };
    window.addEventListener('mouseup', handleGlobalRelease);
    window.addEventListener('touchend', handleGlobalRelease);

    Composite.add(engine.world, mouseConstraint);

    const runner = Runner.create();
    let observer;

    const startPhysics = () => {
      Runner.run(runner, engine);
      setIsPhysicsReady(true);

      const updateLoop = () => {
        const time = Date.now();

        // Apply waving "breathing" force to letters to make them feel alive
        newBodiesData.forEach(({ body }, i) => {
          if (body.speed < 2) {
            const waveForce = Math.sin(time * 0.002 + i) * 0.005;
            Matter.Body.applyForce(body, body.position, { x: 0, y: -waveForce * body.mass * 0.02 });
            const torque = Math.cos(time * 0.0015 + i) * 0.001 * body.mass;
            body.torque = torque;
          }
        });

        setBodiesData(prev => [...prev]);
        renderLoopRef.current = requestAnimationFrame(updateLoop);
      };

      updateLoop();
    };

    // Only start physics when the footer comes into view
    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startPhysics();
        observer.disconnect();
      }
    }, { threshold: 0.1 }); // Trigger when 10% of the container is visible

    observer.observe(containerRef.current);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('mouseup', handleGlobalRelease);
      window.removeEventListener('touchend', handleGlobalRelease);
      if (renderLoopRef.current) cancelAnimationFrame(renderLoopRef.current);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, [text, windowSize]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '400px', // Fixed height container for physics world
        position: 'relative',
        overflow: 'visible', // Allow dragging upwards
      }}
    >
      {/* 
        Initial Static Render (Used only for measuring dimensions before physics takes over).
        Hidden via opacity.
      */}
      {!isPhysicsReady && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '4vw', // Extra spacing between letters
          width: '100%',
          opacity: 0
        }}>
          {text.split('').map((char, i) => (
            <h1
              key={`static-${i}`}
              ref={el => letterRefs.current[i] = el}
              style={{
                fontSize: '18vw',
                fontWeight: 900,
                margin: 0,
                padding: 0,
                color: '#ffffff',
                fontFamily: "'Archivo Black', sans-serif",
                textTransform: 'uppercase',
                display: 'inline-block',
                lineHeight: 0.75,
                textShadow: massive3DShadow
              }}
            >
              {char}
            </h1>
          ))}
        </div>
      )}

      {/* 
        Physics-driven Dynamic Render
      */}
      {isPhysicsReady && bodiesData.map(({ id, char, body, width, height }) => (
        <h1
          key={`dynamic-${id}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: width,
            height: height,
            fontSize: '18vw',
            fontWeight: 900,
            margin: 0,
            padding: 0,
            color: '#ffffff',
            fontFamily: "'Archivo Black', sans-serif",
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 0.75,
            userSelect: 'none',
            cursor: 'grab',
            zIndex: 10,
            // Core mapping of Matter.js position to CSS transform
            transform: `translate(${body.position.x - width / 2}px, ${body.position.y - height / 2}px) rotate(${body.angle}rad)`,
            // Advanced text shadow for depth (3D extrusion + soft drop shadow)
            textShadow: massive3DShadow
          }}
        >
          {char}
        </h1>
      ))}
    </div>
  );
};

export default PhysicsText;
