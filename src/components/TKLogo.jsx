import React, { useEffect, useRef } from 'react';

const TKLogo = () => {
  const wrapRef = useRef(null);

  useEffect(() => {
    if (wrapRef.current) {
      const els = wrapRef.current.querySelectorAll('.tk-shard, .tk-underline, .tk-solid');
      els.forEach(el => {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = null;
      });
    }
  }, []);

  return (
    <>
      <style>{`
        .tk-logo-wrap svg { width: 100%; height: 100%; display: block; overflow: visible; }

        .tk-shard { opacity: 0; }
        .tk-shard polygon { fill: #ffffff; }

        .tk-s0 { animation: tkFly0 900ms cubic-bezier(.16,.9,.28,1) 200ms forwards; }
        .tk-s1 { animation: tkFly1 900ms cubic-bezier(.16,.9,.28,1) 380ms forwards; }
        .tk-s2 { animation: tkFly2 900ms cubic-bezier(.16,.9,.28,1) 560ms forwards; }
        .tk-s3 { animation: tkFly3 900ms cubic-bezier(.16,.9,.28,1) 740ms forwards; }
        .tk-s4 { animation: tkFly4 900ms cubic-bezier(.16,.9,.28,1) 920ms forwards; }

        @keyframes tkFly0 {
          0%   { opacity: 0; transform: translate(-420px,-360px) rotate(-70deg) scale(.4); }
          70%  { opacity: 1; }
          100% { opacity: 1; transform: translate(0,0) rotate(0) scale(1); }
        }
        @keyframes tkFly1 {
          0%   { opacity: 0; transform: translate(380px,-420px) rotate(60deg) scale(.4); }
          70%  { opacity: 1; }
          100% { opacity: 1; transform: translate(0,0) rotate(0) scale(1); }
        }
        @keyframes tkFly2 {
          0%   { opacity: 0; transform: translate(0,520px) rotate(20deg) scale(.4); }
          70%  { opacity: 1; }
          100% { opacity: 1; transform: translate(0,0) rotate(0) scale(1); }
        }
        @keyframes tkFly3 {
          0%   { opacity: 0; transform: translate(-500px,80px) rotate(-30deg) scale(.4); }
          70%  { opacity: 1; }
          100% { opacity: 1; transform: translate(0,0) rotate(0) scale(1); }
        }
        @keyframes tkFly4 {
          0%   { opacity: 0; transform: translate(500px,120px) rotate(35deg) scale(.4); }
          70%  { opacity: 1; }
          100% { opacity: 1; transform: translate(0,0) rotate(0) scale(1); }
        }

        /* Solid unclipped logo fades in after shards assemble, hiding the cuts */
        .tk-solid {
          opacity: 0;
          animation: tkSolidIn 300ms ease-out 1100ms forwards;
        }
        .tk-solid polygon { fill: #ffffff; }

        @keyframes tkSolidIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }

        .tk-underline {
          stroke: #ffffff;
          stroke-width: 6;
          stroke-linecap: round;
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: tkDraw 500ms ease-out 1250ms forwards;
        }
        @keyframes tkDraw { to { stroke-dashoffset: 0; } }
      `}</style>

      <div ref={wrapRef} className="tk-logo-wrap" style={{
        width: '70px',
        height: '70px',
        position: 'relative',
        overflow: 'visible',
      }}>
        <svg viewBox="0 0 1000 1000">
          <defs>
            <clipPath id="tkClip0"><polygon points="100,0 300,0 200,1000 0,1000"/></clipPath>
            <clipPath id="tkClip1"><polygon points="300,0 500,0 400,1000 200,1000"/></clipPath>
            <clipPath id="tkClip2"><polygon points="500,0 700,0 600,1000 400,1000"/></clipPath>
            <clipPath id="tkClip3"><polygon points="700,0 900,0 800,1000 600,1000"/></clipPath>
            <clipPath id="tkClip4"><polygon points="900,0 1100,0 1000,1000 800,1000"/></clipPath>
          </defs>

          {/* Animated shards (visible during fly-in, hidden once solid appears) */}
          <g className="tk-shard tk-s0" clipPath="url(#tkClip0)">
            <polygon points="210,270 690,270 600,350 520,350 520,910 430,910 430,350 210,350"/>
            <polygon points="492.5,574.4 932.5,234.4 987.5,305.6 547.5,645.6"/>
            <polygon points="547.5,574.4 987.5,914.4 932.5,985.6 492.5,645.6"/>
          </g>
          <g className="tk-shard tk-s1" clipPath="url(#tkClip1)">
            <polygon points="210,270 690,270 600,350 520,350 520,910 430,910 430,350 210,350"/>
            <polygon points="492.5,574.4 932.5,234.4 987.5,305.6 547.5,645.6"/>
            <polygon points="547.5,574.4 987.5,914.4 932.5,985.6 492.5,645.6"/>
          </g>
          <g className="tk-shard tk-s2" clipPath="url(#tkClip2)">
            <polygon points="210,270 690,270 600,350 520,350 520,910 430,910 430,350 210,350"/>
            <polygon points="492.5,574.4 932.5,234.4 987.5,305.6 547.5,645.6"/>
            <polygon points="547.5,574.4 987.5,914.4 932.5,985.6 492.5,645.6"/>
          </g>
          <g className="tk-shard tk-s3" clipPath="url(#tkClip3)">
            <polygon points="210,270 690,270 600,350 520,350 520,910 430,910 430,350 210,350"/>
            <polygon points="492.5,574.4 932.5,234.4 987.5,305.6 547.5,645.6"/>
            <polygon points="547.5,574.4 987.5,914.4 932.5,985.6 492.5,645.6"/>
          </g>
          <g className="tk-shard tk-s4" clipPath="url(#tkClip4)">
            <polygon points="210,270 690,270 600,350 520,350 520,910 430,910 430,350 210,350"/>
            <polygon points="492.5,574.4 932.5,234.4 987.5,305.6 547.5,645.6"/>
            <polygon points="547.5,574.4 987.5,914.4 932.5,985.6 492.5,645.6"/>
          </g>

          {/* Solid unclipped logo — fades in over the shards to hide clip gaps */}
          <g className="tk-solid">
            <polygon points="210,270 690,270 600,350 520,350 520,910 430,910 430,350 210,350"/>
            <polygon points="492.5,574.4 932.5,234.4 987.5,305.6 547.5,645.6"/>
            <polygon points="547.5,574.4 987.5,914.4 932.5,985.6 492.5,645.6"/>
          </g>

          <line className="tk-underline" x1="330" y1="960" x2="700" y2="960"/>
        </svg>
      </div>
    </>
  );
};

export default TKLogo;
