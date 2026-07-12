import React, { useState } from 'react';
import { Mail, ChevronUp } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/api/contact`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
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
    <footer id="contact" className="footer-container" aria-label="Contact Talib Khan" style={{
      paddingTop: '80px',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      position: 'relative',
      zIndex: 10,
      background: 'rgba(0, 0, 0, 0.3)',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2.5rem',
        padding: '0 5vw',
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
            data-swarm-shape="curly"
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
              onMouseEnter={(e) => { if (status !== 'submitting') e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { if (status !== 'submitting') e.currentTarget.style.transform = 'translateY(0)' }}
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
            { icon: <FaInstagram size={20} />, link: 'https://www.instagram.com/talibimist' }
          ].map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
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

      {/* Massive Typography Footer Section */}
      <div style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '18rem'
      }}>
        {/* Huge Text Box */}
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');
          `}
        </style>
        <div style={{
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          lineHeight: 0.75,
        }}>
          <h1 style={{
            fontSize: '29vw', // Adjusted sizing so it doesn't get cut off on the sides
            fontWeight: 900,
            margin: 0,
            padding: 0,
            color: '#ffffff',
            fontFamily: "'Archivo Black', sans-serif", // A much thicker, solid, and bold font
            letterSpacing: '-1vw', // Adjusted spacing for the new font
            textTransform: 'uppercase',
            display: 'inline-block',
            // Heavy bottom-weighted shadows for that ambient occlusion / grounded look
            textShadow: '0px 15px 15px rgba(0,0,0,0.6), 0px 40px 40px rgba(0,0,0,0.8), 0px 80px 100px rgba(0,0,0,1)',
            position: 'relative',
            zIndex: 1,
            transform: 'translateY(1.5vw)' // Brought it up a bit compared to before
          }}>
            TALIB
          </h1>
          {/* Subtle gradient overlay to enhance the ground cut-off illusion */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '35%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
            zIndex: 2,
            pointerEvents: 'none'
          }}></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
