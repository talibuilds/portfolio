import React, { useEffect, useRef } from 'react';

// Padding around each nav item text to form the bounding rectangle
const BOX_PAD_X = 14;
const BOX_PAD_Y = 6;

// Extra padding around the entire canvas so the snake never clips at edges
const CANVAS_PAD = 30;

const TRAIL_LENGTH = 55; // px
const SPEED = 0.08; // px per ms — slow and deliberate

const CanvasSnake = ({ navItems, activeSection, containerRef, itemRefs }) => {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let animId;

    // ─── helpers ───────────────────────────────────────────────
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = container.offsetWidth + CANVAS_PAD * 2;
      const h = container.offsetHeight + CANVAS_PAD * 2;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const measureBoxes = () => {
      const cr = container.getBoundingClientRect();
      return navItems.map(item => {
        const el = itemRefs.current[item.id];
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          id: item.id,
          // coordinates in canvas-local space (shifted by CANVAS_PAD)
          left:   r.left   - cr.left - BOX_PAD_X + CANVAS_PAD,
          top:    r.top    - cr.top  - BOX_PAD_Y + CANVAS_PAD,
          right:  r.right  - cr.left + BOX_PAD_X + CANVAS_PAD,
          bottom: r.bottom - cr.top  + BOX_PAD_Y + CANVAS_PAD,
        };
      }).filter(Boolean);
    };

    // corners: 0=TL  1=TR  2=BR  3=BL   (clockwise order)
    const corner = (box, i) => {
      switch (i) {
        case 0: return { x: box.left,  y: box.top };
        case 1: return { x: box.right, y: box.top };
        case 2: return { x: box.right, y: box.bottom };
        case 3: return { x: box.left,  y: box.bottom };
        default: return { x: box.left, y: box.top };
      }
    };

    const nearCorner = (box, pos) => {
      for (let i = 0; i < 4; i++) {
        const c = corner(box, i);
        if (Math.abs(pos.x - c.x) < 2 && Math.abs(pos.y - c.y) < 2) return i;
      }
      return -1;
    };

    // ─── state ─────────────────────────────────────────────────
    const s = {
      pos: null,          // current head position {x,y}
      path: [],           // history of corner points the head has passed through
      queue: [],          // upcoming waypoints
      boxIdx: 0,          // index into boxes[] for the box we're currently orbiting
      cw: 1,              // rotation: +1 = CW, -1 = CCW
      cornerIdx: 0,       // which corner we're currently at (0-3)
      boxes: [],
      activeBoxIdx: 0,
    };
    stateRef.current = s;

    // ─── routing ───────────────────────────────────────────────
    const enqueueLoop = (nCorners) => {
      const box = s.boxes[s.boxIdx];
      let ci = s.cornerIdx;
      for (let i = 0; i < nCorners; i++) {
        ci = (ci + s.cw + 4) % 4;
        s.queue.push(corner(box, ci));
      }
    };

    const enqueueJump = (targetIdx) => {
      const srcBox = s.boxes[s.boxIdx];
      const dstBox = s.boxes[targetIdx];

      // Step 1: walk to the left edge (TL or BL) of current box
      const leftCorners = s.cw === 1
        ? [0, 3] // CW: next left corners from any position
        : [3, 0];

      // find shortest path to a left-side corner
      let ci = s.cornerIdx;
      while (ci !== 0 && ci !== 3) {
        ci = (ci + s.cw + 4) % 4;
        s.queue.push(corner(srcBox, ci));
      }

      // Step 2: jump vertically along the rail to the target box
      const goingDown = targetIdx > s.boxIdx;
      const destCornerIdx = goingDown ? 0 : 3; // TL if going down, BL if going up
      s.queue.push(corner(dstBox, destCornerIdx));

      // Update state
      s.boxIdx = targetIdx;
      s.cornerIdx = destCornerIdx;
      s.cw = Math.random() < 0.5 ? 1 : -1;
    };

    const generateNext = () => {
      if (s.boxes.length === 0) return;

      // Bias: prefer active section
      const r = Math.random();

      if (r < 0.15 && s.boxes.length > 1) {
        // 15% — jump to a different section
        let target;
        if (s.boxIdx !== s.activeBoxIdx && Math.random() < 0.65) {
          target = s.activeBoxIdx;
        } else {
          const candidates = [];
          for (let i = 0; i < s.boxes.length; i++) if (i !== s.boxIdx) candidates.push(i);
          target = candidates[Math.floor(Math.random() * candidates.length)];
        }
        enqueueJump(target);
      } else if (r < 0.45) {
        // 30% — partial trace (1-2 corners)
        enqueueLoop(Math.random() < 0.5 ? 1 : 2);
      } else {
        // 55% — full loop
        enqueueLoop(4);
      }
    };

    // ─── drawing ───────────────────────────────────────────────
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!s.pos || s.path.length === 0) return;

      // Build trail points from head backwards through path history
      let totalDist = 0;
      const pts = [{ x: s.pos.x, y: s.pos.y }];

      for (let i = s.path.length - 1; i >= 0; i--) {
        const prev = pts[pts.length - 1];
        const p = s.path[i];
        const d = Math.abs(p.x - prev.x) + Math.abs(p.y - prev.y); // manhattan since orthogonal
        if (d < 0.5) continue;

        if (totalDist + d >= TRAIL_LENGTH) {
          const need = TRAIL_LENGTH - totalDist;
          const ratio = need / d;
          pts.push({
            x: prev.x + (p.x - prev.x) * ratio,
            y: prev.y + (p.y - prev.y) * ratio,
          });
          totalDist = TRAIL_LENGTH;
          break;
        }
        pts.push({ x: p.x, y: p.y });
        totalDist += d;
      }

      if (pts.length < 2) return;

      // Resample trail into many small sub-points for smooth tapering
      const resampled = [];
      const STEP = 1.5; // px between sub-points
      resampled.push({ ...pts[0] });
      let carry = 0;

      for (let i = 1; i < pts.length; i++) {
        const ax = pts[i - 1].x, ay = pts[i - 1].y;
        const bx = pts[i].x, by = pts[i].y;
        const segLen = Math.abs(bx - ax) + Math.abs(by - ay);
        if (segLen < 0.1) continue;

        let walked = carry;
        while (walked < segLen) {
          const t = walked / segLen;
          resampled.push({ x: ax + (bx - ax) * t, y: ay + (by - ay) * t });
          walked += STEP;
        }
        carry = walked - segLen;
      }
      resampled.push({ ...pts[pts.length - 1] });

      if (resampled.length < 2) return;

      // Draw each sub-segment with tapered width — sharp needle points at both ends
      const MAX_WIDTH = 0.8;
      const TAPER = 8; // px from each end where the taper happens

      for (let i = 0; i < resampled.length - 1; i++) {
        const progress = i / (resampled.length - 1); // 0 = head, 1 = tail

        // Distance from head (in resampled steps)
        const distFromHead = i * STEP;
        const distFromTail = (resampled.length - 1 - i) * STEP;

        // Taper factor: 0 at tip, 1 in the body
        const headTaper = Math.min(1, distFromHead / TAPER);
        const tailTaper = Math.min(1, distFromTail / TAPER);
        const width = MAX_WIDTH * headTaper * tailTaper;

        if (width < 0.05) continue;

        ctx.beginPath();
        ctx.moveTo(resampled[i].x, resampled[i].y);
        ctx.lineTo(resampled[i + 1].x, resampled[i + 1].y);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = width;
        ctx.lineCap = 'butt';
        ctx.stroke();
      }
    };

    // ─── init ──────────────────────────────────────────────────
    resize();
    window.addEventListener('resize', () => { resize(); s.boxes = measureBoxes(); });

    const init = () => {
      s.boxes = measureBoxes();
      if (s.boxes.length === 0) {
        // items not rendered yet, retry
        requestAnimationFrame(init);
        return;
      }
      s.activeBoxIdx = Math.max(0, s.boxes.findIndex(b => b.id === activeSection));
      s.boxIdx = s.activeBoxIdx;
      s.cw = 1;
      s.cornerIdx = 0;

      const startCorner = corner(s.boxes[s.boxIdx], 0);
      s.pos = { ...startCorner };
      s.path = [{ ...startCorner }];
      s.queue = [];
      generateNext();

      let lastT = performance.now();

      const tick = (t) => {
        const dt = Math.min(t - lastT, 50); // cap dt to avoid huge jumps
        lastT = t;

        // Update active section index
        const newActiveIdx = s.boxes.findIndex(b => b.id === activeSection);
        if (newActiveIdx >= 0) s.activeBoxIdx = newActiveIdx;

        // Need more waypoints?
        if (s.queue.length === 0) {
          // Re-measure boxes periodically
          s.boxes = measureBoxes();
          generateNext();
        }

        // Move head towards next waypoint
        if (s.queue.length > 0) {
          let budget = SPEED * dt;

          while (budget > 0.01 && s.queue.length > 0) {
            const target = s.queue[0];
            const dx = target.x - s.pos.x;
            const dy = target.y - s.pos.y;
            const dist = Math.abs(dx) + Math.abs(dy);

            if (dist < 0.5) {
              // Arrived at waypoint
              s.pos.x = target.x;
              s.pos.y = target.y;
              s.path.push({ x: s.pos.x, y: s.pos.y });
              s.queue.shift();

              // Update cornerIdx
              const box = s.boxes[s.boxIdx];
              if (box) {
                const ci = nearCorner(box, s.pos);
                if (ci >= 0) s.cornerIdx = ci;
              }

              // Prune old path
              let pLen = 0;
              for (let i = s.path.length - 1; i >= 1; i--) {
                pLen += Math.abs(s.path[i].x - s.path[i-1].x) + Math.abs(s.path[i].y - s.path[i-1].y);
                if (pLen > TRAIL_LENGTH * 2) {
                  s.path = s.path.slice(i);
                  break;
                }
              }
              continue;
            }

            const move = Math.min(budget, dist);
            // Move only along one axis (orthogonal)
            if (Math.abs(dx) > 0.1) {
              s.pos.x += Math.sign(dx) * Math.min(move, Math.abs(dx));
            } else {
              s.pos.y += Math.sign(dy) * Math.min(move, Math.abs(dy));
            }
            budget -= move;
          }
        }

        draw();
        animId = requestAnimationFrame(tick);
      };

      animId = requestAnimationFrame(tick);
    };

    // Small delay to let React render the nav items first
    const initTimer = setTimeout(init, 100);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [navItems, activeSection]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: -CANVAS_PAD,
        left: -CANVAS_PAD,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default CanvasSnake;
