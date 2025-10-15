import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart, FaInstagram, FaFacebook } from 'react-icons/fa';
import { useDarkMode } from './DarkModeContext';
import './Footer.css';

function Footer({ onNavigate }) {
  const { isDarkMode } = useDarkMode();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <img 
              src={isDarkMode ? '/logohvit.png' : '/logosort.png'} 
              alt="Trenly Logo" 
              className="footer-logo-img"
            />
            <h3>Trenly</h3>
          </div>
          <p className="footer-tagline">
            Din personlige AI-trener som forstår deg. Få skreddersydde treningsplaner, kostholdsplaner og progresjonssporing.
          </p>
          <div className="social-links">
            <motion.a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub />
            </motion.a>
            <motion.a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaLinkedin />
            </motion.a>
            <motion.a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Twitter"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTwitter />
            </motion.a>
            <motion.a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaInstagram />
            </motion.a>
            <motion.a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFacebook />
            </motion.a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Funksjoner</h4>
          <ul className="footer-links">
            <motion.li 
              onClick={() => onNavigate && onNavigate('workout')}
              whileHover={{ x: 5 }}
            >
              Treningsplanlegger
            </motion.li>
            <motion.li 
              onClick={() => onNavigate && onNavigate('nutrition')}
              whileHover={{ x: 5 }}
            >
              Kostholdsplanlegger
            </motion.li>
            <motion.li 
              onClick={() => onNavigate && onNavigate('progression')}
              whileHover={{ x: 5 }}
            >
              Progresjonssporing
            </motion.li>
            <motion.li 
              onClick={() => onNavigate && onNavigate('bmi')}
              whileHover={{ x: 5 }}
            >
              BMI Kalkulator
            </motion.li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Informasjon</h4>
          <ul className="footer-links">
            <motion.li 
              onClick={() => onNavigate && onNavigate('about')}
              whileHover={{ x: 5 }}
            >
              Om oss
            </motion.li>
            <motion.li 
              onClick={() => onNavigate && onNavigate('faq')}
              whileHover={{ x: 5 }}
            >
              Ofte stilte spørsmål
            </motion.li>
            <motion.li 
              onClick={() => onNavigate && onNavigate('contact')}
              whileHover={{ x: 5 }}
            >
              Kontakt oss
            </motion.li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Kontakt</h4>
          <ul className="footer-links">
            <li className="footer-contact-item">
              <FaEnvelope className="footer-icon" />
              <span>support@trenly.no</span>
            </li>
          </ul>
          <h4 style={{ marginTop: '1.5rem' }}>Juridisk</h4>
          <ul className="footer-links">
            <motion.li 
              onClick={() => onNavigate && onNavigate('privacy')}
              whileHover={{ x: 5 }}
            >
              Personvern
            </motion.li>
            <motion.li 
              onClick={() => onNavigate && onNavigate('terms')}
              whileHover={{ x: 5 }}
            >
              Vilkår
            </motion.li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-divider"></div>
        <div className="footer-copyright">
          <p>
            © {currentYear} Trenly. Alle rettigheter reservert.
          </p>
          <p className="footer-made-with">
            Laget med <FaHeart className="heart-icon" /> i Norge
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

