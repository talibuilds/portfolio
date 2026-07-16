import React, { useEffect, useState, useRef } from 'react';
import CanvasSnake from './CanvasSnake';
import TKLogo from './TKLogo';
import ViewCounter from './ViewCounter';

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const SideNav = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const containerRef = useRef(null);
  const itemRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -70% 0px',
      }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="side-nav desktop-only">
      {/* Logo at top */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '2.5rem', 
          left: '4rem', 
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            const subject = encodeURIComponent('Hey Talib — Let\'s Connect');
            const body = encodeURIComponent('Hi Talib,\n\nI wanted to reach out regarding...');
            window.open(
              `https://mail.google.com/mail/?view=cm&to=talibslab@gmail.com&su=${subject}&body=${body}`,
              '_blank'
            );
          }}
        >
          <TKLogo />
        </div>
        <ViewCounter />
      </div>

      <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
        <CanvasSnake navItems={navItems} activeSection={activeSection} containerRef={containerRef} itemRefs={itemRefs} />

        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              ref={el => itemRefs.current[item.id] = el}
              href={`#${item.id}`}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                width: 'fit-content', // Prevents stretching full width
                textDecoration: 'none',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                fontFamily: 'Outfit, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                transition: 'all 0.3s ease',
              }}
            >
              <span style={{ 
                display: 'inline-block',
                width: isActive ? '20px' : '0px',
                height: '1px',
                background: '#fff',
                marginRight: isActive ? '10px' : '0px',
                transition: 'all 0.3s ease',
                opacity: isActive ? 1 : 0
              }} />
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default SideNav;
