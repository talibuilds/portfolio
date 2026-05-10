import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const projectsList = [
  {
    name: 'QRomize',
    description: 'Custom QR code generator with logo/text embedding, pattern selection, color customization, and instant PNG export.',
    language: 'JavaScript / React',
    link: 'https://github.com/talibuilds/QRomize',
    live: 'https://qromize.vercel.app',
    tags: ['React', 'Vite', 'Tailwind', 'QR Code']
  },
  {
    name: 'CivicEye',
    description: 'A zero-friction civic platform using computer vision to detect, classify, and prioritize urban hazards in real-time.',
    language: 'TypeScript',
    link: 'https://github.com/talibuilds/civikeye',
    tags: ['Computer Vision', 'TypeScript', 'Real-time']
  },
  {
    name: 'Planetto',
    description: 'A mobile app Built for students who dont just set goals — they complete them.',
    language: 'React Native',
    link: 'https://github.com/talibuilds/Planetto',
    tags: ['React Native', 'Mobile', 'Productivity']
  },
  {
    name: 'StudySphere',
    description: 'A comprehensive study platform for managing tasks, resources, and enhancing learning efficiency.',
    language: 'JavaScript / React',
    link: 'https://github.com/talibuilds/studyshpere',
    tags: ['React', 'Education', 'Web App']
  },
  {
    name: 'Chrome-Browser-Automation',
    description: 'A tool to automate your repeating task with human like results through selenium web driver.',
    language: 'Python',
    link: 'https://github.com/talibuilds/Chrome-Browser-Automation',
    tags: ['Python', 'Selenium', 'Automation']
  },
  {
    name: 'Pong Game',
    description: 'A classic retro Pong game implementation showcasing game loop logic and collision detection.',
    language: 'Python',
    link: 'https://github.com/talibuilds/pong-game',
    tags: ['Python', 'Game Dev', 'Retro']
  }
];

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="glass-panel"
      style={{
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-10px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 15px rgba(212, 175, 55, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>{project.name}</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" className="interactive" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
               onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
               onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
              <ExternalLink size={24} />
            </a>
          )}
          <a href={project.link} target="_blank" rel="noreferrer" className="interactive" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
             onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
             onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
            <FaGithub size={24} />
          </a>
        </div>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, flexGrow: 1 }}>
        {project.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: 'auto' }}>
        {project.tags.map((tag, i) => (
          <span key={i} style={{ 
            fontSize: '0.8rem', 
            padding: '0.4rem 1rem', 
            background: 'rgba(212, 175, 55, 0.1)', 
            color: 'var(--accent)',
            borderRadius: '20px',
            fontFamily: 'Outfit, sans-serif'
          }}>
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

const Projects = () => {
  return (
    <section id="projects" style={{ padding: '100px 5vw', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          My <span style={{ color: 'var(--accent)' }}>Works</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '1rem', maxWidth: '600px' }}>
          A collection of projects showcasing my journey in creative development, software engineering, and solving real-world problems.
        </p>
      </motion.div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', 
        gap: '2rem' 
      }}>
        {projectsList.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
