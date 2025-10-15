import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBrain, FaUtensils, FaDumbbell, FaChartLine, FaQuestionCircle, FaCalculator, FaHome, FaBars, FaTimes, FaMoon, FaSun, FaUser, FaSignOutAlt, FaTags } from 'react-icons/fa';
import { useDarkMode } from './DarkModeContext';
import { useAuth } from './AuthContext';
import './Navigation.css';

const Navigation = ({ currentPage, onPageChange, isVisible = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();

  const navigationItems = [
    { id: 'landing', label: 'Hjem', icon: <FaHome />, color: 'var(--primary)' },
    { id: 'workout', label: 'Treningsplan', icon: <FaDumbbell />, color: 'var(--secondary)' },
    { id: 'nutrition', label: 'Kosthold', icon: <FaUtensils />, color: 'var(--accent)' },
    { id: 'progression', label: 'Progresjon', icon: <FaChartLine />, color: 'var(--tertiary)' },
    { id: 'pricing', label: 'Priser', icon: <FaTags />, color: 'var(--gold)' },
    { id: 'bmi', label: 'BMI Kalkulator', icon: <FaCalculator />, color: 'var(--primary-light)' },
    { id: 'contact', label: 'Kontakt', icon: <FaQuestionCircle />, color: 'var(--secondary-light)' }
  ];

  const handleNavClick = (pageId) => {
    onPageChange(pageId);
    setIsMobileMenuOpen(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="mobile-menu-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </motion.button>

      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        <div className="nav-brand" onClick={() => handleNavClick('landing')} style={{ cursor: 'pointer' }}>
          <img 
            src={isDarkMode ? '/logohvit.png' : '/logosort.png'} 
            alt="Trenly Logo" 
            className="brand-logo"
          />
          <span className="brand-text">Trenly</span>
        </div>
        <div className="nav-items">
          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{ '--item-color': item.color }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </motion.button>
          ))}
          
          {/* Dark Mode Toggle */}
          <motion.button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isDarkMode ? 'Bytt til lys modus' : 'Bytt til mørk modus'}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </motion.button>

          {/* User Profile */}
          {user && (
            <div className="user-profile">
              <FaUser className="user-icon" />
              <span className="user-name">{user.name}</span>
              <motion.button
                className="logout-btn"
                onClick={logout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Logg ut"
              >
                <FaSignOutAlt />
              </motion.button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.nav
              className="mobile-nav"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-nav-header">
                <div className="nav-brand">
                  <img 
                    src={isDarkMode ? '/logohvit.png' : '/logosort.png'} 
                    alt="Trenly Logo" 
                    className="brand-logo"
                  />
                  <span className="brand-text">Trenly</span>
                </div>
                <button
                  className="close-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="mobile-nav-items">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    className={`mobile-nav-item ${currentPage === item.id ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ '--item-color': item.color }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </motion.button>
                ))}
                
                <div className="mobile-divider"></div>
                
                {/* Dark Mode Toggle */}
                <motion.button
                  className="mobile-nav-item mobile-dark-toggle"
                  onClick={toggleDarkMode}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ '--item-color': 'var(--primary)' }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navigationItems.length * 0.1 }}
                >
                  <span className="nav-icon">{isDarkMode ? <FaSun /> : <FaMoon />}</span>
                  <span className="nav-label">{isDarkMode ? 'Lys modus' : 'Mørk modus'}</span>
                </motion.button>

                {/* User info & Logout */}
                {user && (
                  <>
                    <div className="mobile-user-info">
                      <FaUser className="mobile-user-icon" />
                      <span className="mobile-user-name">{user.name}</span>
                    </div>
                    <motion.button
                      className="mobile-nav-item mobile-logout"
                      onClick={logout}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ '--item-color': 'var(--error)' }}
                    >
                      <span className="nav-icon"><FaSignOutAlt /></span>
                      <span className="nav-label">Logg ut</span>
                    </motion.button>
                  </>
                )}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
