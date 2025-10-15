import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaDumbbell, FaUtensils, FaChartLine, FaRocket, FaShieldAlt, FaQuestionCircle } from 'react-icons/fa';
import { useDarkMode } from './DarkModeContext';
import './LandingPage.css';

function LandingPage({ onGetStarted, onContact, onPricing }) {
  const { isDarkMode } = useDarkMode();
  const features = [
    {
      icon: <FaBrain />,
      title: "AI-drevet treningsplaner",
      description: "Få personlige treningsplaner skapt av avansert AI basert på dine mål, nivå og utstyr",
      color: "var(--primary)"
    },
    {
      icon: <FaUtensils />,
      title: "Intelligent kostholdsplanlegging",
      description: "Måltidsplaner tilpasset dine treningsmål med varierte og næringsrike oppskrifter",
      color: "var(--secondary)"
    },
    {
      icon: <FaChartLine />,
      title: "Progresjonssporing",
      description: "Følg fremgangen din over tid med detaljerte analyser og anbefalinger",
      color: "var(--accent)"
    },
    {
      icon: <FaShieldAlt />,
      title: "Skadesikker trening",
      description: "AI-en unngår øvelser som kan forverre eksisterende skader og gir sikre alternativer",
      color: "var(--primary-light)"
    }
  ];

  const benefits = [
    {
      number: "10x",
      title: "Raskere resultater",
      description: "Med AI-optimaliserte planer oppnår du målene dine 10x raskere enn tradisjonell trening"
    },
    {
      number: "24/7",
      title: "Personlig trener",
      description: "Få ekspertveiledning når som helst, hvor som helst - din AI-trener er alltid tilgjengelig"
    },
    {
      number: "100%",
      title: "Tilpasset deg",
      description: "Hver plan er 100% tilpasset dine behov, mål og forutsetninger"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Fitness-entusiast",
      text: "Jeg har aldri hatt en treningsplan som passet så perfekt! AI-en forstår virkelig mine behov.",
      rating: 5
    },
    {
      name: "Marcus L.",
      role: "Profesjonell atlet",
      text: "Kostholdsplanleggeren har revolusjonert min ernæring. Jeg ser resultater jeg aldri trodde var mulig.",
      rating: 5
    },
    {
      name: "Emma K.",
      role: "Nybegynner",
      text: "Som nybegynner var jeg redd for å trene feil. AI-en gir meg trygghet og perfekt veiledning.",
      rating: 5
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-logo">
              <motion.img 
                src={isDarkMode ? '/logoteksthvit.png' : '/logotekstsort.png'} 
                alt="Trenly Logo" 
                className="hero-logo-img"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </div>

            <div className="hero-badge">
              <FaRocket />
              <span>Revolusjoner din trening med AI</span>
            </div>
            
            <h1 className="hero-title">
              Din personlige <span className="gradient-text">AI-trener</span> som forstår deg
            </h1>
            
            <p className="hero-description">
              Trenly gir deg treningsplaner og kostholdsplaner skapt av avansert AI som tilpasser seg dine mål, 
              nivå og forutsetninger. Oppnå resultater 10x raskere med ekspertveiledning 24/7.
            </p>
            
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Fornøyde brukere</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Oppnår sine mål</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.9/5</span>
                <span className="stat-label">Brukervurdering</span>
              </div>
            </div>
            
            <div className="hero-actions">
              <motion.button
                className="cta-button"
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaRocket />
                <span>Start din AI-trening nå</span>
              </motion.button>
              <motion.button
                className="cta-button secondary"
                onClick={onPricing || (() => {})}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Se priser</span>
              </motion.button>
              <motion.button
                className="cta-button secondary"
                onClick={onContact}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaQuestionCircle />
                <span>Kontakt oss</span>
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="floating-cards">
              <div className="floating-card card-1">
                <FaDumbbell />
                <span>Treningsplan</span>
              </div>
              <div className="floating-card card-2">
                <FaUtensils />
                <span>Kostholdsplan</span>
              </div>
              <div className="floating-card card-3">
                <FaChartLine />
                <span>Progresjon</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Hvorfor velge Trenly?</h2>
            <p>Vi kombinerer avansert AI-teknologi med ekspertkunnskap for å gi deg den beste treningserfaringen</p>
          </motion.div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="feature-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Resultater som snakker for seg selv</h2>
            <p>Våre brukere oppnår eksepsjonelle resultater med AI-drevet trening</p>
          </motion.div>
          
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="benefit-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="benefit-number">{benefit.number}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Hva våre brukere sier</h2>
            <p>Lær hvordan AI Treningsplanlegger har forandret livene til tusenvis av mennesker</p>
          </motion.div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <p>"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Klar til å revolusjonere din trening?</h2>
            <p>Bli en del av fremtiden innen personlig trening. Start din AI-drevne treningsreise i dag.</p>
            
            <motion.button
              className="cta-button large"
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaRocket />
              <span>Start gratis i dag</span>
            </motion.button>
            
            <div className="cta-guarantee">
              <FaShieldAlt />
              <span>30-dagers pengene-tilbake-garanti</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
