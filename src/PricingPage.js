import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCheck, 
  FaTimes, 
  FaCrown, 
  FaDumbbell, 
  FaBrain, 
  FaUtensils, 
  FaChartLine,
  FaAppleAlt,
  FaHeartbeat,
  FaMobileAlt,
  FaCloudDownloadAlt,
  FaUserFriends,
  FaRocket,
  FaStar
} from 'react-icons/fa';
import './PricingPage.css';

function PricingPage({ onGetStarted }) {
  const [isAnnual, setIsAnnual] = useState(false);

  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: <FaDumbbell />,
      price: isAnnual ? '47,90' : '49,90',
      originalPrice: isAnnual ? '49,90' : null,
      period: isAnnual ? 'kr/måned (betalt årlig)' : 'kr/måned',
      annualTotal: '574,80 kr/år',
      description: 'Perfekt for å komme i gang med AI-drevet trening',
      badge: null,
      color: 'var(--primary)',
      gradient: 'var(--gradient-primary)',
      features: [
        { text: 'AI-genererte treningsplaner', included: true, icon: <FaBrain /> },
        { text: 'Personlig tilpasning', included: true, icon: <FaUserFriends /> },
        { text: 'Grunnleggende kostholdsplaner', included: true, icon: <FaUtensils /> },
        { text: 'BMI kalkulator', included: true, icon: <FaHeartbeat /> },
        { text: 'Progresjonssporing', included: true, icon: <FaChartLine /> },
        { text: 'PDF-nedlasting', included: true, icon: <FaCloudDownloadAlt /> },
        { text: 'Standard kundesupport', included: true, icon: <FaMobileAlt /> },
        { text: 'Integrasjon med treningsklokker', included: false },
        { text: 'Avansert næringsanalyse', included: false },
        { text: 'AI-drevet progresjonsprediksjon', included: false },
        { text: 'Ukentlige videoanalyser', included: false },
        { text: 'Prioritert kundesupport', included: false }
      ],
      cta: 'Kom i gang',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: <FaCrown />,
      price: isAnnual ? '189,90' : '199,00',
      originalPrice: isAnnual ? '199,00' : null,
      period: isAnnual ? 'kr/måned (betalt årlig)' : 'kr/måned',
      annualTotal: '2.278,80 kr/år',
      description: 'For deg som ønsker maksimal progresjon og resultater',
      badge: 'Mest populær',
      color: 'var(--gold)',
      gradient: 'var(--gradient-gold)',
      features: [
        { text: 'Alt fra Basic', included: true, icon: <FaStar />, bold: true },
        { text: 'Integrasjon med Garmin, Strava m.m.', included: true, icon: <FaMobileAlt /> },
        { text: 'Avansert næringsanalyse', included: true, icon: <FaAppleAlt /> },
        { text: 'AI-drevet progresjonsprediksjon', included: true, icon: <FaRocket /> },
        { text: 'Automatisk treningsplanlegging', included: true, icon: <FaBrain /> },
        { text: 'Ukentlige videoanalyser', included: true, icon: <FaChartLine /> },
        { text: 'Prioritert kundesupport 24/7', included: true, icon: <FaHeartbeat /> },
        { text: 'Eksklusive treningsvideoer', included: true, icon: <FaDumbbell /> },
        { text: 'Tilgang til beta-funksjoner', included: true, icon: <FaRocket /> },
        { text: 'Personlig trenerveiledning', included: true, icon: <FaUserFriends /> },
        { text: 'Ubegrenset API-kall', included: true, icon: <FaCloudDownloadAlt /> }
      ],
      cta: 'Oppgrader til Pro',
      popular: true
    }
  ];

  const faqs = [
    {
      question: 'Kan jeg endre eller avslutte abonnementet mitt når som helst?',
      answer: 'Ja, du kan endre eller avslutte abonnementet ditt når som helst. Det er ingen bindingstid.'
    },
    {
      question: 'Hva er forskjellen mellom Basic og Pro?',
      answer: 'Pro-planen gir deg tilgang til avanserte funksjoner som integrasjon med treningsklokker (Garmin, Strava, etc.), AI-drevet progresjonsprediksjon, og prioritert kundesupport. Basic er perfekt for å komme i gang, mens Pro er for deg som ønsker maksimal progresjon.'
    },
    {
      question: 'Fungerer det med min treningsklokke?',
      answer: 'Pro-planen støtter integrasjon med de fleste populære treningsklokker inkludert Garmin, Fitbit, Apple Watch (via Strava), Polar, Suunto, og flere. Vi legger stadig til støtte for flere enheter.'
    },
    {
      question: 'Får jeg en prøveperiode?',
      answer: 'Ja! Vi tilbyr 7 dagers gratis prøveperiode på begge planene, så du kan teste tjenesten risikofritt før du forplikter deg.'
    },
    {
      question: 'Hvordan fungerer den årlige betalingen?',
      answer: 'Ved årlig betaling sparer du penger sammenlignet med månedlig betaling. Du betaler for hele året på forhånd og får rabattert pris per måned.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <div className="pricing-page">
      <motion.div
        className="pricing-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div className="pricing-header" variants={itemVariants}>
          <div className="pricing-badge">
            <FaRocket />
            <span>Velg din plan</span>
          </div>
          <h1 className="pricing-title">
            Invester i din <span className="gradient-text">helse</span> og <span className="gradient-text">fremtid</span>
          </h1>
          <p className="pricing-subtitle">
            Få tilgang til AI-drevet treningsplanlegging, kostholdsråd og progresjonssporing. 
            Velg planen som passer best for deg.
          </p>
          
          {/* Billing Toggle */}
          <motion.div 
            className="billing-toggle"
            variants={itemVariants}
          >
            <span className={!isAnnual ? 'active' : ''}>Månedlig</span>
            <button
              className={`toggle-switch ${isAnnual ? 'annual' : ''}`}
              onClick={() => setIsAnnual(!isAnnual)}
            >
              <div className="toggle-slider"></div>
            </button>
            <span className={isAnnual ? 'active' : ''}>
              Årlig
              <span className="save-badge">Spar 5%</span>
            </span>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div className="pricing-cards" variants={itemVariants}>
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              style={{ '--plan-color': plan.color }}
            >
              {plan.badge && (
                <div className="plan-badge" style={{ background: plan.gradient }}>
                  <FaStar />
                  <span>{plan.badge}</span>
                </div>
              )}
              
              <div className="plan-header">
                <div className="plan-icon" style={{ background: plan.gradient }}>
                  {plan.icon}
                </div>
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="plan-pricing">
                <div className="price-wrapper">
                  {plan.originalPrice && (
                    <span className="original-price">{plan.originalPrice}</span>
                  )}
                  <div className="price">
                    <span className="currency">kr</span>
                    <span className="amount">{plan.price}</span>
                  </div>
                </div>
                <p className="period">{plan.period}</p>
                {isAnnual && (
                  <p className="annual-total">{plan.annualTotal}</p>
                )}
              </div>

              <motion.button
                className={`plan-cta ${plan.popular ? 'popular' : ''}`}
                style={{ background: plan.gradient }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onGetStarted && onGetStarted(plan.id)}
              >
                {plan.cta}
              </motion.button>

              <div className="plan-features">
                <p className="features-title">Inkludert i {plan.name}:</p>
                <ul className="features-list">
                  {plan.features.map((feature, idx) => (
                    <li 
                      key={idx} 
                      className={`feature-item ${feature.included ? 'included' : 'not-included'} ${feature.bold ? 'bold' : ''}`}
                    >
                      <span className="feature-icon">
                        {feature.included ? (
                          feature.icon || <FaCheck />
                        ) : (
                          <FaTimes />
                        )}
                      </span>
                      <span className="feature-text">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Comparison */}
        <motion.div className="pricing-features-section" variants={itemVariants}>
          <h2 className="section-title">Hvorfor velge Trenly?</h2>
          <div className="features-grid">
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="feature-icon" style={{ background: 'var(--gradient-primary)' }}>
                <FaBrain />
              </div>
              <h3>AI-Drevet Tilpasning</h3>
              <p>Vår avanserte AI analyserer dine mål og lager personlige planer som evolusjonerer med deg</p>
            </motion.div>

            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="feature-icon" style={{ background: 'var(--gradient-ocean)' }}>
                <FaMobileAlt />
              </div>
              <h3>Synkroniser Med Alt</h3>
              <p>Koble til Garmin, Strava, Fitbit og flere for automatisk sporing av progresjon</p>
            </motion.div>

            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="feature-icon" style={{ background: 'var(--gradient-gold)' }}>
                <FaChartLine />
              </div>
              <h3>Prediktiv Analyse</h3>
              <p>AI forutsier din fremtidige progresjon og justerer planen for optimale resultater</p>
            </motion.div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div className="pricing-faq-section" variants={itemVariants}>
          <h2 className="section-title">Ofte stilte spørsmål</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div className="pricing-cta-section" variants={itemVariants}>
          <div className="cta-content">
            <h2>Klar til å starte?</h2>
            <p>Prøv gratis i 7 dager - ingen kredittkort nødvendig</p>
            <motion.button
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onGetStarted && onGetStarted('pro')}
            >
              Start gratis prøveperiode
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default PricingPage;

