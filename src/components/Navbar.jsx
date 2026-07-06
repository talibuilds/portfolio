import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navLinks = ['Home', 'Projects', 'About', 'Skills', 'Contact'];

  return (
    <motion.nav
      className="navbar-container"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '2.5rem 4rem',
        display: 'flex',
        justifyContent: 'center', // Center everything now that the logo is gone
        alignItems: 'center',
        background: 'transparent',
        zIndex: 100,
        gap: '4rem' // Add some gap between the links and the button
      }}
    >
      {/* Center Links */}
      <div className="nav-links-container" style={{
        display: 'flex',
        gap: '2.5rem',
        alignItems: 'center'
      }}>
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            style={{
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#fff',
              opacity: 0.8,
              transition: 'opacity 0.3s ease',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '1'}
            onMouseLeave={(e) => e.target.style.opacity = '0.8'}
          >
            {link}
          </a>
        ))}
      </div>

      {/* Right Button */}
      <a href="#contact" style={{
        padding: '0.6rem 1.8rem',
        borderRadius: '30px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        color: '#fff',
        fontSize: '0.85rem',
        fontWeight: 500,
        fontFamily: 'Inter, sans-serif',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = '#fff';
        e.target.style.color = '#000';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'transparent';
        e.target.style.color = '#fff';
      }}
      >
        Let's Connect
      </a>
    </motion.nav>
  );
};

export default Navbar;
