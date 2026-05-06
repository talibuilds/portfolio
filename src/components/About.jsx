import React from 'react';
import { motion } from 'framer-motion';

const skills = [
  {
    category: 'Languages',
    icon: '💻',
    items: ['Java', 'Python', 'PHP', 'JavaScript', 'C++', 'C']
  },
  {
    category: 'Frameworks',
    icon: '⚡',
    items: ['Next.js', 'Node.js', 'Tailwind', 'FastAPI', 'React', 'React Native']
  },
  {
    category: 'Database & APIs',
    icon: '🗄️',
    items: ['PostgreSQL', 'MongoDB', 'REST APIs', 'Prisma']
  },
  {
    category: 'Tools & DevOps',
    icon: '🛠️',
    items: ['Git/GitHub', 'Linux', 'Docker', 'Figma', 'Canva', 'Shell']
  }
];

const About = () => {
  return (
    <section id="about" style={{ minHeight: '100vh', padding: '100px 5vw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          About <span style={{ color: 'var(--accent)' }}>Me</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.1rem' }}>
          My arsenal for building digital experiences.
        </p>
      </motion.div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem', 
        maxWidth: '1200px', 
        margin: '0 auto',
        width: '100%'
      }}>
        
        {/* Bio Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="glass-panel"
          style={{ padding: '3rem', gridColumn: '1 / -1', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--accent)', filter: 'blur(80px)', opacity: 0.2, borderRadius: '50%' }} />
          <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Innovating at the intersection of <span style={{ color: 'var(--accent)' }}>design</span> and <span style={{ color: 'var(--accent)' }}>logic.</span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '800px' }}>
            I am Talib Khan, a passionate developer dedicated to architecting scalable backend systems, automating complex workflows, and crafting stunning, intuitive frontend interfaces. Whether it's training a computer vision model or building a responsive mobile app, I thrive on pushing the boundaries of what's possible in the browser and beyond.
          </p>
        </motion.div>

        {/* Skill Cards */}
        {skills.map((skillGroup, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            viewport={{ once: true }}
            className="glass-panel"
            style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'transform 0.3s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{skillGroup.icon}</span>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {skillGroup.category}
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {skillGroup.items.map((item, i) => (
                <span key={i} style={{
                  padding: '0.4rem 1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-glow)';
                  e.currentTarget.style.color = 'var(--accent)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}>
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}

      </div>
    </section>
  );
};

export default About;
