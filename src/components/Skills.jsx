import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaJava, FaNodeJs, FaReact, FaServer, FaGithub, FaLinux, FaDocker, FaTerminal 
} from 'react-icons/fa';
import { 
  SiPython, SiPhp, SiJavascript, SiCplusplus, SiC, 
  SiNextdotjs, SiTailwindcss, SiFastapi, 
  SiPostgresql, SiMongodb, SiPrisma, SiFigma, SiCanva 
} from 'react-icons/si';
import InteractiveSwarm from './InteractiveSwarm';

const skillCategories = [
  {
    title: 'Languages',
    skills: [
      { name: 'Java', icon: <FaJava color="#5382a1" /> },
      { name: 'Python', icon: <SiPython color="#3776AB" /> },
      { name: 'PHP', icon: <SiPhp color="#777BB4" /> },
      { name: 'JavaScript', icon: <SiJavascript color="#F7DF1E" /> },
      { name: 'C++', icon: <SiCplusplus color="#00599C" /> },
      { name: 'C', icon: <SiC color="#A8B9CC" /> }
    ]
  },
  {
    title: 'Frameworks',
    skills: [
      { name: 'Next.js', icon: <SiNextdotjs color="#ffffff" /> },
      { name: 'Node.js', icon: <FaNodeJs color="#339933" /> },
      { name: 'React', icon: <FaReact color="#61DAFB" /> },
      { name: 'Tailwind', icon: <SiTailwindcss color="#06B6D4" /> },
      { name: 'FastAPI', icon: <SiFastapi color="#009688" /> }
    ]
  },
  {
    title: 'Databases & APIs',
    skills: [
      { name: 'PostgreSQL', icon: <SiPostgresql color="#4169E1" /> },
      { name: 'MongoDB', icon: <SiMongodb color="#47A248" /> },
      { name: 'Prisma', icon: <SiPrisma color="#2D3748" /> },
      { name: 'REST APIs', icon: <FaServer color="#ffffff" /> }
    ]
  },
  {
    title: 'Tools & DevOps',
    skills: [
      { name: 'Git/GitHub', icon: <FaGithub color="#ffffff" /> },
      { name: 'Docker', icon: <FaDocker color="#2496ED" /> },
      { name: 'Linux', icon: <FaLinux color="#FCC624" /> },
      { name: 'Shell', icon: <FaTerminal color="#4EAA25" /> },
      { name: 'Figma', icon: <SiFigma color="#F24E1E" /> },
      { name: 'Canva', icon: <SiCanva color="#00C4CC" /> }
    ]
  }
];

const Skills = () => {
  return (
    <section id="skills" aria-label="Technical Skills" style={{ 
      padding: '60px 6rem 120px 6rem',
      background: 'var(--bg-color)',
      position: 'relative',
      zIndex: 10,
      overflow: 'hidden'
    }}>
      
      {/* Localized Dot Animation Background */}
      <InteractiveSwarm />

      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          style={{ marginBottom: '4rem', textAlign: 'center' }}
        >
          <h2 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
            fontWeight: 800, 
            color: 'var(--text-primary)',
            fontFamily: 'Outfit, sans-serif'
          }}>
            Technical <span style={{ color: 'var(--accent)' }}>Arsenal</span>
          </h2>
        </motion.div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '4rem'
        }}>
          {skillCategories.map((category, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h3 style={{ 
                fontSize: '1.2rem', 
                color: 'var(--text-secondary)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                marginBottom: '1.5rem',
                paddingBottom: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                textAlign: 'center'
              }}>
                {category.title}
              </h3>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2.5rem',
                justifyContent: 'center'
              }}>
                {category.skills.map((skill, i) => (
                  <div 
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      opacity: 0.7,
                      transition: 'opacity 0.3s ease, transform 0.3s ease',
                      cursor: 'default'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.opacity = '0.7';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center' }}>
                      {skill.icon}
                    </div>
                    <span style={{
                      color: 'var(--text-primary)',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: '1rem'
                    }}>
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Skills;
