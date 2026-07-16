import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ViewCounter = () => {
  const [views, setViews] = useState(null);
  const [hasIncremented, setHasIncremented] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevViews = useRef(null);

  useEffect(() => {
    const incrementView = async () => {
      try {
        const res = await fetch('/api/views', { method: 'POST' });
        const data = await res.json();
        setViews(data.views);
        setHasIncremented(true);
        prevViews.current = data.views;
      } catch {
        // Fallback — show base count
        setViews(100);
        setHasIncremented(true);
      }
    };

    incrementView();
  }, []);

  // Subtle pulse when the number first appears
  useEffect(() => {
    if (hasIncremented) {
      setIsAnimating(true);
      const t = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(t);
    }
  }, [hasIncremented]);

  // Format number with commas
  const formatNumber = (num) => {
    if (num === null) return '---';
    return num.toLocaleString();
  };

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
        }

        .view-eye-pupil {
          fill: rgba(255, 255, 255, 0.5);
        }

        .view-counter:hover .view-eye-path {
          stroke: rgba(255, 255, 255, 0.7);
          transition: stroke 0.3s ease;
        }

        .view-counter:hover .view-eye-pupil {
          fill: rgba(255, 255, 255, 0.85);
          transition: fill 0.3s ease;
        }

        .view-count-text {
          font-family: 'Fira Code', 'SF Mono', monospace;
          font-size: 10px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.5px;
          line-height: 1;
          transition: color 0.3s ease;
        }

        .view-counter:hover .view-count-text {
          color: rgba(255, 255, 255, 0.7);
        }

        .view-pulse {
          animation: viewPulse 600ms ease-out;
        }

        @keyframes viewPulse {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div className="view-counter" title={`${formatNumber(views)} views`}>
        {/* Eye Icon — SVG so it blends with the TK logo aesthetic */}
        <div className={`view-eye ${isAnimating ? 'view-pulse' : ''}`}>
          <svg viewBox="0 0 24 24">
            {/* Eye outline */}
            <path
              className="view-eye-path"
              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
            />
            {/* Pupil */}
            <circle
              className="view-eye-pupil"
              cx="12"
              cy="12"
              r="3"
            />
          </svg>
        </div>

        {/* Count */}
        <motion.span
          className="view-count-text"
          key={views}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {formatNumber(views)}
        </motion.span>
      </div>
    </>
  );
};

export default ViewCounter;
