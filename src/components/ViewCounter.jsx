import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const SESSION_KEY = 'portfolio_view_counted';

// Ease-out cubic for that fast-start, slow-end counting feel
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

const ViewCounter = () => {
  const [displayCount, setDisplayCount] = useState(0);
  const [targetCount, setTargetCount] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const rafRef = useRef(null);

  // Animate from 0 → target
  const animateCount = useCallback((target) => {
    const duration = Math.min(2000, 800 + target * 3); // Dynamic duration, caps at 2s
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.round(easedProgress * target);

      setDisplayCount(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayCount(target);
        setIsDone(true);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const fetchAndCount = async () => {
      const alreadyCounted = sessionStorage.getItem(SESSION_KEY);

      try {
        if (alreadyCounted) {
          // Already counted this session — just GET the current count
          const res = await fetch('/api/views', { method: 'GET' });
          const data = await res.json();
          setTargetCount(data.views);
        } else {
          // First visit this session — POST to increment
          const res = await fetch('/api/views', { method: 'POST' });
          const data = await res.json();
          setTargetCount(data.views);
          sessionStorage.setItem(SESSION_KEY, '1');
        }
      } catch {
        setTargetCount(100);
      }
    };

    fetchAndCount();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Start counting animation once we have the target
  useEffect(() => {
    if (targetCount !== null) {
      animateCount(targetCount);
    }
  }, [targetCount, animateCount]);

  // Format number with commas
  const formatNumber = (num) => num.toLocaleString();

  return (
    <>
      <style>{`
        .view-counter {
          display: flex;
          align-items: center;
          gap: 5px;
          opacity: 0;
          animation: viewFadeIn 600ms ease-out 1800ms forwards;
          cursor: default;
          user-select: none;
        }

        @keyframes viewFadeIn {
          0%   { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .view-eye {
          position: relative;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .view-eye svg {
          width: 14px;
          height: 14px;
          overflow: visible;
        }

        .view-eye-path {
          fill: none;
          stroke: rgba(255, 255, 255, 0.35);
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: stroke 0.3s ease;
        }

        .view-eye-pupil {
          fill: rgba(255, 255, 255, 0.5);
          transition: fill 0.3s ease;
        }

        .view-counter:hover .view-eye-path {
          stroke: rgba(255, 255, 255, 0.7);
        }

        .view-counter:hover .view-eye-pupil {
          fill: rgba(255, 255, 255, 0.85);
        }

        .view-count-text {
          font-family: 'Fira Code', 'SF Mono', monospace;
          font-size: 10px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.5px;
          line-height: 1;
          transition: color 0.3s ease;
          min-width: 28px;
        }

        .view-counter:hover .view-count-text {
          color: rgba(255, 255, 255, 0.7);
        }

        .view-count-done {
          animation: viewSettle 400ms ease-out;
        }

        @keyframes viewSettle {
          0%   { transform: scale(1.12); }
          60%  { transform: scale(0.96); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div className="view-counter" title={`${formatNumber(displayCount)} views`}>
        {/* Eye Icon */}
        <div className="view-eye">
          <svg viewBox="0 0 24 24">
            <path
              className="view-eye-path"
              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
            />
            <circle
              className="view-eye-pupil"
              cx="12"
              cy="12"
              r="3"
            />
          </svg>
        </div>

        {/* Animated Count */}
        <span className={`view-count-text ${isDone ? 'view-count-done' : ''}`}>
          {formatNumber(displayCount)}
        </span>
      </div>
    </>
  );
};

export default ViewCounter;
