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

      if (currentOpacity > 0.01) {
        ctx.globalAlpha = currentOpacity;
        
        // Head follows mouse
        const targetX = mouse.x;
        const targetY = mouse.y;
        
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
