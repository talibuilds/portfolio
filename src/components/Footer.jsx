import React, { useState, useEffect, useRef } from 'react';
import { Mail, ChevronUp } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import PhysicsText from './PhysicsText';

const Footer = () => {
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Ensure the animation plays for at least 2 seconds
    const startTime = Date.now();

    try {
      const response = await fetch(`/api/contact`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 2000 - elapsed);

      await new Promise(resolve => setTimeout(resolve, remaining));

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 2000 - elapsed);
      await new Promise(resolve => setTimeout(resolve, remaining));
      setStatus('error');
    }
  };

  // On error, show message briefly then redirect to Gmail
  useEffect(() => {
    if (status === 'error') {
      const timer = setTimeout(() => {
        const subject = encodeURIComponent('Hey Talib — Let\'s Connect');
        const body = encodeURIComponent('Hi Talib,\n\nI wanted to reach out regarding...');
        window.open(
          `https://mail.google.com/mail/?view=cm&to=talibslab@gmail.com&su=${subject}&body=${body}`,
          '_blank'
        );
        // Reset form after redirect
        setTimeout(() => setStatus('idle'), 500);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Inline animated TK logo for the button
  const SubmitButtonContent = () => {
    if (status === 'submitting') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            width: '100%',
            height: '100%'
          }}
        >
          {/* Spinning TK mini logo */}
          <motion.svg
            viewBox="0 0 1000 1000"
            style={{ width: 22, height: 22 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          >
            <polygon points="210,270 690,270 600,350 520,350 520,910 430,910 430,350 210,350" fill="#000" />
            <polygon points="492.5,574.4 932.5,234.4 987.5,305.6 547.5,645.6" fill="#000" />
            <polygon points="547.5,574.4 987.5,914.4 932.5,985.6 492.5,645.6" fill="#000" />
          </motion.svg>
          <span style={{ letterSpacing: '2px' }}>TRANSMITTING...</span>
        </motion.div>
      );
    }

    if (status === 'error') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%'
          }}
        >
          <span style={{ fontSize: '1rem' }}>✕</span>
          <span>FAILED — OPENING GMAIL...</span>
        </motion.div>
      );
    }

    if (status === 'success') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%'
          }}
        >
          <span style={{ fontSize: '1rem' }}>✓</span>
          <span>DELIVERED</span>
        </motion.div>
      );
    }

    return 'CONNECT';
  };

  return (
    <footer id="contact" className="footer-container" aria-label="Contact Talib Khan" style={{
      paddingTop: '80px',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      position: 'relative',
      zIndex: 10,
      background: 'transparent',
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

        {/* Small Contact Form */}
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
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)'
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
            ref={formRef}
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
                disabled={status === 'submitting'}
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
                disabled={status === 'submitting'}
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
              disabled={status === 'submitting'}
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
              disabled={status === 'submitting' || status === 'error'}
              style={{
                width: '100%',
                padding: '0.8rem',
                background: status === 'error'
                  ? '#e53e3e'
                  : status === 'success'
                    ? '#38a169'
                    : 'var(--accent)',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.3s ease',
                cursor: (status === 'submitting' || status === 'error') ? 'wait' : 'pointer',
                opacity: 1,
                overflow: 'hidden',
                position: 'relative',
                minHeight: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => { if (status === 'idle') e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { if (status === 'idle') e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <SubmitButtonContent />
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
          <PhysicsText text="TALIB" />
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

