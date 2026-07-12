import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const projectsList = [
  {
    name: 'Portfolio Website',
    description: 'A minimalist, highly interactive personal portfolio built with React and Vite. Features a custom dark mountain aesthetic, fluid Framer Motion animations, and a sleek IDE-themed About section.',
    language: 'JavaScript / React',
    link: 'https://github.com/talibuilds/Portfolio',
    tags: ['React', 'Vite', 'Framer Motion', 'CSS'],
    image: '/personal_portfolio.jpg'
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
  return (
    <section id="projects" aria-label="Projects by Talib Khan" style={{ 
      padding: '120px 6rem',
      background: 'var(--bg-color)',
      position: 'relative',
      zIndex: 10
    }}>
      
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{ maxWidth: '1400px', margin: '0 auto', marginBottom: '8rem', textAlign: 'center' }}
      >
        <h2 style={{ 
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
          fontWeight: 800, 
          color: 'var(--text-primary)',
          fontFamily: 'Outfit, sans-serif'
        }}>
          Selected <span style={{ color: 'var(--accent)' }}>Works</span>
        </h2>
      </motion.div>

      {/* Sticky Stacking Cards Container */}
      <div style={{ maxWidth: '1350px', margin: '0 auto', paddingBottom: '10vh' }}>
        {projectsList.map((project, index) => (
          <div 
            key={index}
            className="project-card"
            data-swarm-shape="curly"
            style={{
              position: 'sticky',
              top: `calc(8vh + ${index * 25}px)`, // Adjusted stacking offset to prevent pushing bottom out of screen
              height: 'min(680px, 80vh)', // Bounded height prevents bottom clipping on smaller screens
              backgroundColor: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              marginBottom: '60vh', // Creates the scrolling distance before the next card hits
              display: 'flex',
              overflow: 'hidden',
              boxShadow: '0 -20px 50px rgba(0,0,0,0.8)',
            }}
          >
            {/* Left: Image Preview */}
            <div className="project-image-container" style={{ 
              flex: '1', 
              position: 'relative',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              overflow: 'hidden' // Removed padding and flex centering
            }}>
              <img 
                src={project.image} 
                alt={`${project.name} preview`} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // Will perfectly fit the 1:1 frame
                  objectPosition: 'center',
                }}
              />
            </div>

            {/* Right: Content */}
            <div className="project-content-container" style={{ 
              flex: '1', 
              padding: 'clamp(2rem, 4vw, 4rem)', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center' 
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ 
                  fontSize: '2.5rem', 
                  color: 'var(--text-primary)', 
                  fontWeight: 700,
                  fontFamily: 'Outfit, sans-serif'
                }}>
                  {project.name}
                </h3>

                {/* Links directly beside the title */}
                <div className="project-links" style={{ display: 'flex', gap: '1.2rem' }}>
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" 
                       style={{ color: 'var(--accent)', transition: 'all 0.3s ease' }}
                       onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                       onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                      <ExternalLink size={28} />
                    </a>
                  )}
                  <a href={project.link} target="_blank" rel="noopener noreferrer" 
                     style={{ color: 'var(--text-secondary)', transition: 'all 0.3s ease' }}
                     onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                     onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <FaGithub size={28} />
                  </a>
                </div>
              </div>

              <p style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '1.1rem', 
                lineHeight: 1.8, 
                marginBottom: '3rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                {project.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: 'auto' }}>
                {project.tags.map((tag, i) => (
                  <span key={i} style={{ 
                    fontSize: '0.85rem', 
                    padding: '0.5rem 1.2rem', 
                    border: '1px solid rgba(210, 180, 140, 0.2)', 
                    color: 'var(--accent)',
                    borderRadius: '30px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default Projects;
