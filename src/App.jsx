import React from 'react';
import InsectTrailBackground from './components/InsectTrailBackground';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <>
      <InsectTrailBackground />
      <main style={{ position: 'relative', zIndex: 10 }}>
        <Hero />
        <About />
        <Projects />
        <Footer />
      </main>
    </>
  );
}

export default App;
