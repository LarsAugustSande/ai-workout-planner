import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaBrain, FaHeart, FaUsers, FaLightbulb, FaShieldAlt, FaChartLine, FaCode } from 'react-icons/fa';
import './AboutUs.css';

function AboutUs({ onBack }) {
  const values = [
    {
      icon: <FaBrain />,
      title: 'AI-drevet innovasjon',
      description: 'Vi bruker den nyeste AI-teknologien for å skape personlige treningsopplevelser som tidligere var forbeholdt profesjonelle atleter.'
    },
    {
      icon: <FaHeart />,
      title: 'Brukerfokus',
      description: 'Alt vi gjør starter med brukeren. Vi lytter, lærer og forbedrer kontinuerlig for å gi deg den beste opplevelsen.'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Sikkerhet først',
      description: 'Dine data og helse er vår høyeste prioritet. Vi tar ansvar for både din digitale sikkerhet og fysiske velvære.'
    },
    {
      icon: <FaLightbulb />,
      title: 'Kontinuerlig læring',
      description: 'Vi holder oss oppdatert på treningsvitenskap og teknologi for å alltid gi deg de beste, forskningsbaserte rådene.'
    }
  ];

  const features = [
    {
      icon: <FaBrain />,
      title: 'Avansert AI',
      description: 'Vi bruker OpenAI\'s GPT-4o-mini for å generere intelligente, personlige trenings- og kostholdsplaner som tilpasser seg dine behov.'
    },
    {
      icon: <FaChartLine />,
      title: 'Datadrevet',
      description: 'Våre planer er basert på beprøvde treningsprinsipper, ernæringsvitenskap og analyser av tusenvis av suksesshistorier.'
    },
    {
      icon: <FaUsers />,
      title: 'For alle',
      description: 'Fra nybegynner til avansert, fra hjemmetrening til gym - vi har noe for alle nivåer og mål.'
    },
    {
      icon: <FaCode />,
      title: 'Moderne teknologi',
      description: 'Bygget med React, Node.js og moderne webteknologier for en rask, responsiv og pålitelig opplevelse.'
    }
  ];

  const timeline = [
    {
      year: '2024',
      title: 'Idéfasen',
      description: 'Alt startet med en ide om å demokratisere tilgang til personlig trening gjennom AI.'
    },
    {
      year: '2025',
            title: 'Lansering',
            description: 'Trenly ble lansert med treningsplangenerering, kostholdsplanlegging og progresjonssporing.'
    },
    {
      year: 'Fremtiden',
      title: 'Kontinuerlig utvikling',
      description: 'Vi jobber konstant med nye funksjoner som bevegelsesanalyse med computer vision, sosiale funksjoner og enda mer personalisering.'
    }
  ];

  return (
    <div className="about-page">
      <div className="about-container">
        {/* Hero Section */}
        <motion.div
          className="about-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="about-hero-icon">
            <FaRocket />
          </div>
          <h1>Om Trenly</h1>
          <p className="about-hero-tagline">
            Vi demokratiserer tilgang til personlig trening gjennom kunstig intelligens
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          className="about-section mission-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="section-content">
            <h2>Vår Visjon</h2>
            <p>
              Vi tror at alle fortjener tilgang til personlig, profesjonell treningsveiledning - uavhengig av budsjett, 
              lokasjon eller erfaring. Ved å kombinere avansert AI-teknologi med beprøvd treningsvitenskap, gjør vi 
              verdensklasse treningsplanlegging tilgjengelig for alle.
            </p>
            <p>
              Trenly er mer enn bare en app - det er din personlige treningspartner som forstår dine 
              mål, respekterer dine begrensninger og feirer dine fremskritt. Vi bruker kunstig intelligens ikke for å 
              erstatte menneskelig ekspertise, men for å gjøre den tilgjengelig for alle, når som helst, hvor som helst.
            </p>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          className="about-section values-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2>Våre Verdier</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="value-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="about-section features-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2>Hva gjør oss unike?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          className="about-section timeline-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2>Vår Reise</h2>
          <div className="timeline">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                className="timeline-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Section */}
        <motion.div
          className="about-section tech-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <h2>Teknologien bak</h2>
          <div className="tech-content">
            <div className="tech-stack">
              <h3>Frontend</h3>
              <ul>
                <li><strong>React 18</strong> - Moderne komponentbasert UI</li>
                <li><strong>Framer Motion</strong> - Flytende animasjoner</li>
                <li><strong>React Icons</strong> - Omfattende ikonbibliotek</li>
              </ul>
            </div>
            <div className="tech-stack">
              <h3>Backend</h3>
              <ul>
                <li><strong>Node.js & Express</strong> - Robust server</li>
                <li><strong>OpenAI GPT-4o-mini</strong> - AI-generering</li>
                <li><strong>RESTful API</strong> - Moderne arkitektur</li>
              </ul>
            </div>
            <div className="tech-stack">
              <h3>Sikkerhet & Personvern</h3>
              <ul>
                <li><strong>SSL/TLS kryptering</strong> - Sikker dataoverføring</li>
                <li><strong>GDPR-compliance</strong> - Personvernbeskyttelse</li>
                <li><strong>Sikker API-kommunikasjon</strong> - Beskyttede endepunkter</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="about-section cta-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h2>Klar til å starte din treningsreise?</h2>
          <p>
            Bli en del av tusenvis av fornøyde brukere som allerede har revolusjonert sin trening med AI.
          </p>
          <div className="cta-stats">
            <div className="stat">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Aktive brukere</div>
            </div>
            <div className="stat">
              <div className="stat-number">50,000+</div>
              <div className="stat-label">Genererte planer</div>
            </div>
            <div className="stat">
              <div className="stat-number">95%</div>
              <div className="stat-label">Fornøyde brukere</div>
            </div>
          </div>
        </motion.div>

        {onBack && (
          <motion.button
            className="back-button"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Tilbake
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default AboutUs;

