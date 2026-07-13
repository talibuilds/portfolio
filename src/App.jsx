import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import Hero from './components/Hero';
import SideNav from './components/SideNav';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <>
      <Analytics />
      
      <div className="app-layout" style={{ position: 'relative', zIndex: 10 }}>
        <SideNav />
        
        {/* The actual content */}
        <main
          className="main-content"
          aria-label="Talib Khan — Full Stack Developer Portfolio"
        >
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Footer />
        </main>
      </div>
    </>
  );
}

export default App;


