import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch("https://formsubmit.co/ajax/talibslab@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <footer id="contact" style={{ 
      padding: '80px 5vw 3rem 5vw', 
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      position: 'relative',
      zIndex: 10,
      background: 'rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '2.5rem', 
        marginBottom: '4rem',
        textAlign: 'center'
      }}>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '1rem' }}>
            Let's <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Build</span> something crazy.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
            Have an idea? Fill out the form below and let's make it happen.
          </p>
        </motion.div>

        {/* Small Contact Form or Success Message */}
        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              width: '100%', 
              maxWidth: '400px', 
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '16px',
              padding: '2rem 1.5rem',
              border: '1px solid var(--accent)',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.1)'
            }} 
          >
            <h3 style={{ color: 'var(--accent)', fontSize: '1.2rem', fontFamily: 'Fira Code, monospace' }}>
              &gt; transmission_successful
            </h3>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
              Connection established. I'll ping you back shortly.
            </p>
          </motion.div>
        ) : (
          <motion.form 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              width: '100%', 
              maxWidth: '400px', 
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }} 
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="_captcha" value="false" />
            <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                name="name"
                required
                placeholder="Name" 
                style={{
                  flex: 1,
                  width: '100%',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '0.8rem 1rem',
                  color: 'var(--text-primary)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <input 
                type="email" 
                name="email"
                required
                placeholder="Email" 
                style={{
                  flex: 1,
                  width: '100%',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '0.8rem 1rem',
                  color: 'var(--text-primary)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
            <textarea 
              name="message"
              required
              placeholder="Message" 
              rows="3"
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '0.8rem 1rem',
                color: 'var(--text-primary)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'none'
              }}
            />
            <button 
              type="submit"
              disabled={status === 'submitting'}
              style={{
                width: '100%',
                padding: '0.8rem',
                background: 'var(--accent)',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.3s ease',
                cursor: status === 'submitting' ? 'wait' : 'pointer',
                opacity: status === 'submitting' ? 0.7 : 1
              }}
              onMouseEnter={(e) => { if(status !== 'submitting') e.currentTarget.style.transform = 'translateY(-2px)'}}
              onMouseLeave={(e) => { if(status !== 'submitting') e.currentTarget.style.transform = 'translateY(0)'}}
            >
              {status === 'submitting' ? 'UPLOADING...' : (status === 'error' ? 'ERROR! TRY AGAIN' : 'CONNECT')}
            </button>
          </motion.form>
        )}

        {/* Social Links */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}
        >
          {[
            { icon: <FaGithub size={20} />, link: 'https://github.com/talibuilds' },
            { icon: <Mail size={20} />, link: 'mailto:talibslab@gmail.com' },
            { icon: <FaLinkedin size={20} />, link: 'https://www.linkedin.com/in/m-talib-khan/' },
            { icon: <FaInstagram size={20} />, link: 'https://www.instagram.com/talibk.ai' }
          ].map((item, index) => (
            <a 
              key={index} 
              href={item.link} 
              target="_blank" 
              rel="noreferrer"
              style={{
                color: 'var(--text-secondary)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {item.icon}
            </a>
          ))}
        </motion.div>
      </div>

      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '2rem' }}>
        <p>© {new Date().getFullYear()} All rights reserved.</p>
        <p>Built with ❤️ by <a href="https://github.com/talibuilds" target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'underline', textDecorationColor: 'var(--accent)', textUnderlineOffset: '4px' }}>Talibuilds</a></p>
      </div>
    </footer>
  );
};

export default Footer;
