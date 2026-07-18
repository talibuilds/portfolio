import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const projectsList = [
  {
    name: 'Portfolio Website',
    description: 'A minimalist, highly interactive personal portfolio built with React and Vite. Features a custom dark mountain aesthetic, fluid Framer Motion animations, and a sleek IDE-themed About section.',
    language: 'JavaScript / React',
    link: 'https://github.com/talibuilds/Portfolio',
    tags: ['React', 'Vite', 'Framer Motion', 'CSS'],
    image: '/portfolio.gif',
    duration: 6000
  },
  {
    name: 'StudySphere',
    description: 'A comprehensive study platform for managing tasks, resources, and enhancing learning efficiency. Features robust state management and seamless collaborative environments.',
    language: 'JavaScript / React',
    link: 'https://github.com/talibuilds/studysphere',
    live: 'https://studyspheres.vercel.app/',
    tags: ['React', 'Education', 'Web App'],
    image: '/studysphere.gif',
    duration: 13000
  },
  {
    name: 'Planetto',
    description: 'A mobile app built for students who don\'t just set goals — they complete them. Gamified tracking, intelligent reminders, and sleek analytics.',
    language: 'React Native',
    link: 'https://github.com/talibuilds/Planetto',
    live: 'https://expo.dev/accounts/talibuilds/projects/Planetto/builds/d9c526cd-7eca-46df-9ef2-d1c188160616',
    tags: ['React Native', 'Mobile', 'Productivity'],
    image: '/planetto.gif',
    duration: 11000
  },
  {
    name: 'Off-Mind',
    description: 'A mindfulness and productivity platform designed to help users declutter their thoughts, manage stress, and stay organized through an intuitive interface.',
    language: 'JavaScript / React',
    link: 'https://github.com/talibuilds/Off-Mind',
    live: 'https://off-mind.vercel.app/',
    tags: ['React', 'Next.js', 'Productivity', 'Mindfulness'],
    image: '/offmind.gif',
    duration: 10000
  },
  {
    name: 'QRomize',
    description: 'Custom QR code generator with logo/text embedding, pattern selection, color customization, and instant PNG export. Built with focus on client-side generation for maximum privacy.',
    language: 'JavaScript / React',
    link: 'https://github.com/talibuilds/QRomize',
    live: 'https://qromize.vercel.app',
    tags: ['React', 'Vite', 'Tailwind', 'QR Code'],
    image: '/qromize.gif',
    duration: 12000
  },
  {
    name: 'Removo',
    description: 'Premium AI background removal tool featuring zero-halo edge cleaning, 4K upscaling, and a custom hybrid architecture utilizing Hugging Face models.',
    language: 'Python / JS',
    link: 'https://github.com/talibuilds/removo',
    live: 'https://bgremovo.vercel.app',
    tags: ['FastAPI', 'AI', 'Hugging Face', 'Vercel'],
    image: '/removo.gif',
    duration: 13000
  }
];

const Projects = () => {
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) return;

    // Use specific project duration if available, fallback to 10 seconds
    const currentDuration = projectsList[hoveredIndex].duration || 10000;

    const timer = setTimeout(() => {
      setHoveredIndex((prev) => (prev + 1) % projectsList.length);
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [isHovering, hoveredIndex]);

  return (
    <section id="projects" aria-label="Projects by Talib Khan" style={{
      padding: '120px 6rem',
      background: 'transparent',
      position: 'relative',
      zIndex: 10,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{ marginBottom: '4rem' }}
      >
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 800,
          color: '#fff',
          fontFamily: 'Outfit, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          Selected <span style={{ color: 'var(--text-secondary)' }}>Works</span>
        </h2>
      </motion.div>

      <div
        className="projects-flex-container"
        style={{ position: 'relative', display: 'flex', gap: '4rem', alignItems: 'flex-start' }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >

        {/* Project List */}
        <div style={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {projectsList.map((project, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className="project-item"
                onMouseEnter={() => setHoveredIndex(index)}
                style={{
                  padding: '1.5rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  opacity: !isHovered ? 0.4 : 1
                }}
              >
                {/* Mobile Inline Image */}
                <div className="mobile-only" style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
                  <img src={project.image} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <h3 style={{
                      fontSize: 'clamp(1.5rem, 2vw, 2rem)',
                      fontWeight: 700,
                      color: '#fff',
                      fontFamily: 'Outfit, sans-serif',
                      transition: 'all 0.4s ease',
                      transform: isHovered ? 'translateX(15px)' : 'translateX(0)'
                    }}>
                      {project.name}
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      transition: 'all 0.4s ease',
                      transform: isHovered ? 'translateX(15px)' : 'translateX(0)',
                      opacity: isHovered ? 1 : 0.6
                    }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                        {project.tags.slice(0, 3).join(' • ')}
                      </span>
                    </div>
                  </div>

                  <div className="project-actions" style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateX(0)' : 'translateX(-15px)',
                    transition: 'all 0.4s ease'
                  }}>
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
                        <ArrowUpRight size={24} />
                      </a>
                    )}
                    <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
                      <FaGithub size={24} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Image Preview Area */}
        <div className="desktop-only" style={{
          flex: '1 1 60%',
          maxWidth: '850px',
          position: 'sticky',
          top: '15vh',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={hoveredIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* 16:9 Image Container */}
              <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                <img
                  src={projectsList[hoveredIndex].image}
                  alt={projectsList[hoveredIndex].name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    background: '#0a0a0a'
                  }}
                />
              </div>
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '1.5rem', color: '#fff', fontFamily: 'Outfit, sans-serif', marginBottom: '0.75rem' }}>
                  {projectsList[hoveredIndex].name}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>
                  {projectsList[hoveredIndex].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </section>
  );
};

export default Projects;
