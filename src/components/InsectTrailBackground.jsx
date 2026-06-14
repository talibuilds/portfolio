import React, { useEffect, useRef } from 'react';

const InsectTrailBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let mouse = { x: -1000, y: -1000, isActive: false };
    
    // Trail points for the insect body
    const trailLength = 15;
    const trail = [];
    for (let i = 0; i < trailLength; i++) {
      trail.push({ x: -1000, y: -1000 });
    }

    let time = 0;
    let targetOpacity = 0;
    let currentOpacity = 0;

    const getDocHeight = () => Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      window.innerHeight
    );

    // Neon Dragonflies array
    const fireflies = Array.from({ length: 25 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * getDocHeight(),
      vx: 0,
      vy: 0,
      size: Math.random() * 2 + 5,
      phase: Math.random() * Math.PI * 2,
      hoverTime: Math.random() * 100,
      angle: Math.random() * Math.PI * 2
    }));

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let timeoutId;
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isActive = true;
      targetOpacity = 1;
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        mouse.isActive = false;
        targetOpacity = 0;
      }, 500); // Disappear after 500ms of no movement
    };
    
    const handleMouseOut = () => {
      mouse.isActive = false;
      targetOpacity = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.15;
      
      // Smooth fade in/out
      currentOpacity += (targetOpacity - currentOpacity) * 0.1;

      const docHeight = getDocHeight();
      const scrollY = window.scrollY;

      ctx.save();
      ctx.translate(0, -scrollY);

      // --- Draw and update Neon Dragonflies ---
      ctx.globalAlpha = 1;
      fireflies.forEach(f => {
        // Dragonfly dart-and-hover mechanics
        f.hoverTime -= 1;
        if (f.hoverTime <= 0) {
          // Dart!
          f.vx += (Math.random() - 0.5) * 6;
          f.vy += (Math.random() - 0.5) * 6;
          f.hoverTime = 40 + Math.random() * 80;
        } else {
          // Hover (friction)
          f.vx *= 0.92;
          f.vy *= 0.92;
        }
        
        const speed = Math.hypot(f.vx, f.vy);
        if (speed > 5) {
          f.vx = (f.vx / speed) * 5;
          f.vy = (f.vy / speed) * 5;
        }

        // Scatter from mouse/insect
        if (currentOpacity > 0.01) {
          const dx = f.x - trail[0].x;
          const dy = f.y - trail[0].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 250) {
            const force = (250 - dist) / 250;
            f.vx += (dx / dist) * force * 3;
            f.vy += (dy / dist) * force * 3;
          }
        }

        f.x += f.vx;
        f.y += f.vy;

        // Wrap around screen edges smoothly
        if (f.x < -50) f.x = canvas.width + 50;
        if (f.x > canvas.width + 50) f.x = -50;
        if (f.y < -50) f.y = docHeight + 50;
        if (f.y > docHeight + 50) f.y = -50;

        // Smooth rotation
        if (speed > 0.5) {
          let targetAngle = Math.atan2(f.vy, f.vx);
          let diff = targetAngle - f.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          f.angle += diff * 0.15;
        }

        // Dragonflies flap slightly slower and more realistic
        f.phase += 0.4 + speed * 0.1; 

        // Cull rendering if outside the current viewport
        const drawY = f.y - scrollY;
        if (drawY < -100 || drawY > window.innerHeight + 100) return;

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.angle);
        
        // --- Body: Elongated plasma core gradient ---
        const bodyGrad = ctx.createLinearGradient(-f.size, 0, f.size * 2, 0);
        bodyGrad.addColorStop(0, '#ff007f'); // Hot pink tail
        bodyGrad.addColorStop(0.5, '#7f00ff'); // Deep violet center
        bodyGrad.addColorStop(1, '#00ff00'); // Neon green head

        ctx.beginPath();
        ctx.ellipse(f.size * 0.5, 0, f.size * 2, f.size * 0.25, 0, 0, Math.PI * 2);
        ctx.fillStyle = bodyGrad;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffff';
        ctx.fill();

        // --- Head & Compound Eyes ---
        ctx.beginPath();
        ctx.arc(f.size * 2.2, -f.size * 0.2, f.size * 0.4, 0, Math.PI * 2); // left eye
        ctx.arc(f.size * 2.2, f.size * 0.2, f.size * 0.4, 0, Math.PI * 2); // right eye
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        ctx.fill();

        // --- Translucent iridescent wireframe wings ---
        const flap = Math.sin(f.phase) * 0.6;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 255, 255, 0.6)';
        
        const drawWing = (x, y, scaleY, rotation, flapMod) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation + flapMod);
            
            // Wing outline
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-f.size * 1.5, -f.size * 3 * scaleY); // Sweeps back and out
            ctx.lineTo(-f.size * 3.5, -f.size * 1 * scaleY); // Tip
            ctx.lineTo(0, 0);
            
            // Iridescent fill
            ctx.fillStyle = 'rgba(0, 255, 255, 0.15)';
            ctx.fill();
            
            // Wireframe vein structure
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = '#00ffff'; // Electric cyan
            ctx.stroke();
            
            // Inner veins
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-f.size * 2.5, -f.size * 1.5 * scaleY);
            ctx.moveTo(-f.size * 1.5, -f.size * 3 * scaleY);
            ctx.lineTo(-f.size * 2.5, -f.size * 1.5 * scaleY);
            ctx.stroke();
            
            ctx.restore();
        };

        // Front wings (near head)
        drawWing(f.size * 1.5, 0, 1, -0.2, flap); // Top Left
        drawWing(f.size * 1.5, 0, -1, 0.2, -flap); // Bottom Left

        // Back wings (near center)
        drawWing(f.size * 0.2, 0, 1.2, -0.4, flap * 1.2); // Top Right
        drawWing(f.size * 0.2, 0, -1.2, 0.4, -flap * 1.2); // Bottom Right
        
        ctx.restore();
      });

      if (currentOpacity > 0.01) {
        ctx.globalAlpha = currentOpacity;
        
        // Head follows mouse + scroll offset for document coords
        const targetX = mouse.x;
        const targetY = mouse.y + scrollY;
        
        trail[0].x += (targetX - trail[0].x) * 0.4;
        trail[0].y += (targetY - trail[0].y) * 0.4;

        for (let i = 1; i < trailLength; i++) {
          const dx = trail[i - 1].x - trail[i].x;
          const dy = trail[i - 1].y - trail[i].y;
          trail[i].x += dx * 0.45;
          trail[i].y += dy * 0.45;
        }

        // Draw segmented tail
        for (let i = trailLength - 1; i > 0; i--) {
          ctx.beginPath();
          ctx.arc(trail[i].x, trail[i].y, (trailLength - i) * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${0.1 + ((trailLength - i) / trailLength) * 0.5})`;
          ctx.fill();
        }

        // Calculate angle of movement for wings
        const dx = trail[0].x - trail[1].x;
        const dy = trail[0].y - trail[1].y;
        const angle = Math.atan2(dy, dx);

        // Draw Wings
        ctx.save();
        ctx.translate(trail[0].x, trail[0].y);
        ctx.rotate(angle);
        
        const wingFlap = Math.sin(time) * 0.8;
        
        // Left Wing
        ctx.beginPath();
        ctx.ellipse(-2, -5 + wingFlap, 6, 2, Math.PI / 4 + wingFlap, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
        
        // Right Wing
        ctx.beginPath();
        ctx.ellipse(-2, 5 - wingFlap, 6, 2, -Math.PI / 4 - wingFlap, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
        ctx.restore();

        // Draw the insect head
        ctx.beginPath();
        ctx.arc(trail[0].x, trail[0].y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#d4af37';
        ctx.fill();
        ctx.shadowBlur = 0; // reset
        
        ctx.globalAlpha = 1;
      }
      
      ctx.restore(); // <--- CRITICAL FIX: Restore the global scroll translation
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default InsectTrailBackground;
