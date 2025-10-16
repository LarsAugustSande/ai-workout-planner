import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaQuestionCircle, FaEnvelope, FaInfoCircle, FaHeart } from 'react-icons/fa';
import './ContactPage.css';

const ContactPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('faq');

  const faqData = [
    {
      question: "Hvordan fungerer AI-treningsplanleggeren?",
      answer: "Vår AI analyserer dine mål, treningserfaring og tilgjengelig utstyr for å lage en personlig treningsplan som er tilpasset dine behov."
    },
    {
      question: "Kan jeg bruke appen uten gym-medlemskap?",
      answer: "Ja! Vi lager treningsplaner for både hjemmetrening og gym. Du kan velge utstyr du har tilgjengelig, inkludert kroppsvektøvelser."
    },
    {
      question: "Hvor ofte oppdateres treningsplanene?",
      answer: "Du kan generere nye treningsplaner når som helst. Vi anbefaler å oppdatere planen hver 4-6 uke for optimal progresjon."
    },
    {
      question: "Er det gratis å bruke?",
      answer: "Ja, vår grunnleggende AI-treningsplanlegger er helt gratis å bruke. Vi har også premium-funksjoner for avanserte brukere."
    },
    {
      question: "Kan jeg tracke fremgangen min?",
      answer: "Absolutt! Vi har en innebygd progresjonssporing hvor du kan registrere vekter, repetisjoner og følge din fremgang over tid."
    },
    {
      question: "Hva med kostholdsplaner?",
      answer: "Vi tilbyr også AI-genererte kostholdsplaner som er tilpasset dine treningsmål og preferanser."
    }
  ];

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: "E-post",
      details: "larsaugustsande@gmail.com",
      description: "Send oss en e-post, vi svarer innen 24 timer"
    }
  ];


  return (
    <div className="contact-page">
      <header className="header">
        <div className="container">
          <motion.div 
            className="header-content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="logo">
              <img 
                src="/logotekstsort.png" 
                alt="Trenly Logo" 
                className="header-logo"
              />
            </div>
            <p className="subtitle">Kontakt & Support - Vi er her for å hjelpe deg med å nå dine treningsmål og gi deg den beste treningserfaringen</p>
          </motion.div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {onBack && (
            <motion.button
              className="back-btn"
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHeart />
              Tilbake til Hjem
            </motion.button>
          )}
        <div className="tab-navigation">
          <motion.button
            className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaQuestionCircle />
            FAQ
          </motion.button>
          <motion.button
            className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaEnvelope />
            Kontaktinfo
          </motion.button>
        </div>

        <div className="tab-content">
          {activeTab === 'faq' && (
            <motion.div
              className="faq-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Ofte stilte spørsmål</h2>
              <div className="faq-list">
                {faqData.map((faq, index) => (
                  <motion.div
                    key={index}
                    className="faq-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h3 className="faq-question">{faq.question}</h3>
                    <p className="faq-answer">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              className="contact-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Kontakt oss</h2>
              <div className="contact-grid">
                {contactInfo.map((contact, index) => (
                  <motion.div
                    key={index}
                    className="contact-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="contact-icon">{contact.icon}</div>
                    <h3>{contact.title}</h3>
                    <p className="contact-details">{contact.details}</p>
                    <p className="contact-description">{contact.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="contact-form-section">
                <h3>Send oss en melding</h3>
                <form className="contact-form">
                  <div className="form-group">
                    <label>Navn</label>
                    <input type="text" placeholder="Ditt navn" />
                  </div>
                  <div className="form-group">
                    <label>E-post</label>
                    <input type="email" placeholder="din@epost.no" />
                  </div>
                  <div className="form-group">
                    <label>Emne</label>
                    <input type="text" placeholder="Hva gjelder meldingen?" />
                  </div>
                  <div className="form-group">
                    <label>Melding</label>
                    <textarea rows="5" placeholder="Skriv din melding her..."></textarea>
                  </div>
                  <motion.button
                    type="submit"
                    className="submit-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send melding
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}

        </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
