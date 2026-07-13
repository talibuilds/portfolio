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
    image: '/personal_portfolio.png'
  },
  {
    name: 'StudySphere',
    description: 'A comprehensive study platform for managing tasks, resources, and enhancing learning efficiency. Features robust state management and seamless collaborative environments.',
    language: 'JavaScript / React',
    link: 'https://github.com/talibuilds/studyshpere',
    live: 'https://studyspheres.vercel.app/',
    tags: ['React', 'Education', 'Web App'],
    image: '/studysphere_ui.jpg'
  },
  {
    name: 'Planetto',
    description: 'A mobile app built for students who don\'t just set goals — they complete them. Gamified tracking, intelligent reminders, and sleek analytics.',
    language: 'React Native',
    link: 'https://github.com/talibuilds/Planetto',
    live: 'https://expo.dev/accounts/talibuilds/projects/Planetto/builds/d9c526cd-7eca-46df-9ef2-d1c188160616',
    tags: ['React Native', 'Mobile', 'Productivity'],
    image: '/planetto_ui.jpg'
  },
  {
    name: 'CivicEye',
    description: 'A zero-friction civic platform using computer vision to detect, classify, and prioritize urban hazards in real-time. Designed for massive scalability and immediate response routing.',
    language: 'TypeScript',
    link: 'https://github.com/talibuilds/civikeye',
    tags: ['Computer Vision', 'TypeScript', 'Real-time'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'QRomize',
    description: 'Custom QR code generator with logo/text embedding, pattern selection, color customization, and instant PNG export. Built with focus on client-side generation for maximum privacy.',
    language: 'JavaScript / React',
    link: 'https://github.com/talibuilds/QRomize',
    live: 'https://qromize.vercel.app',
    tags: ['React', 'Vite', 'Tailwind', 'QR Code'],
    image: '/qromize_ui.png'
  },
  {
    name: 'Removo',
    description: 'Premium AI background removal tool featuring zero-halo edge cleaning, 4K upscaling, and a custom hybrid architecture utilizing Hugging Face models.',
    language: 'Python / JS',
    link: 'https://github.com/talibuilds/removo',
    live: 'https://bgremovo.vercel.app',
    tags: ['FastAPI', 'AI', 'Hugging Face', 'Vercel'],
    image: '/removo_ui.png'
  }
];

const Projects = () => {
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) return;

    const timer = setInterval(() => {
      setHoveredIndex((prev) => (prev + 1) % projectsList.length);
    }, 5000); // 10 seconds

    return () => clearInterval(timer);
  }, [isHovering]);

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
        style={{ position: 'relative', display: 'flex', gap: '4rem' }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >

        {/* Project List */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {projectsList.map((project, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                style={{
                  padding: '1.5rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  opacity: !isHovered ? 0.4 : 1
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h3 style={{
                    fontSize: '2rem',
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

                <div style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'center',
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateX(0)' : 'translateX(-15px)',
                  transition: 'all 0.4s ease'
                }}>
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
                      <ArrowUpRight size={28} />
                    </a>
                  )}
                  <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
                    <FaGithub size={28} />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Image Preview Area */}
        <div className="desktop-only" style={{
          width: '500px',
          height: '600px',
          position: 'sticky',
          top: '20vh',
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '350px', width: '100%', overflow: 'hidden' }}>
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
              <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '1.5rem', color: '#fff', fontFamily: 'Outfit, sans-serif', marginBottom: '1rem' }}>
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
