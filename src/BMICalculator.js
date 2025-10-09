import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalculator, FaWeight, FaRuler, FaHeart, FaInfoCircle, FaHome, FaArrowLeft } from 'react-icons/fa';
import './BMICalculator.css';

const BMICalculator = ({ onBack, onHome }) => {
  const [bmiData, setBmiData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: 'male'
  });
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiHistory, setBmiHistory] = useState([]);

  const calculateBMI = () => {
    if (!bmiData.height || !bmiData.weight) {
      alert('Vennligst fyll ut både høyde og vekt');
      return;
    }

    const height = parseFloat(bmiData.height) / 100; // Convert cm to meters
    const weight = parseFloat(bmiData.weight);
    const age = parseInt(bmiData.age) || 25;
    
    if (height <= 0 || weight <= 0) {
      alert('Høyde og vekt må være positive tall');
      return;
    }

    const bmi = weight / (height * height);
    const roundedBMI = Math.round(bmi * 10) / 10;

    let category = '';
    let description = '';
    let color = '';
    let recommendations = [];

    if (bmi < 18.5) {
      category = 'Undervekt';
      description = 'Du har undervekt. Vi anbefaler å konsultere en lege og fokusere på styrketrening og næringsrik mat.';
      color = 'var(--warning)';
      recommendations = [
        'Fokuser på styrketrening for å bygge muskler',
        'Spis kalorioverskudd med næringsrik mat',
        'Konsulter en ernæringsfysiolog',
        'Regelmessig vektkontroll'
      ];
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normalvekt';
      description = 'Perfekt! Du har en sunn kroppsvekt. Fortsett med balansert kosthold og regelmessig trening.';
      color = 'var(--success)';
      recommendations = [
        'Fortsett med balansert kosthold',
        'Regelmessig trening (3-5 ganger per uke)',
        'Varier mellom kardio og styrketrening',
        'Hold deg hydrert'
      ];
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overvekt';
      description = 'Du har overvekt. Fokus på kardio og styrketrening, samt å spise kaloriunderskudd.';
      color = 'var(--accent)';
      recommendations = [
        'Fokuser på kardio trening',
        'Spis kaloriunderskudd for vektnedgang',
        'Styrketrening for å beholde muskelmasse',
        'Regelmessig vektkontroll'
      ];
    } else {
      category = 'Fedme';
      description = 'Du har fedme. Vi anbefaler sterkt å konsultere en lege og ernæringsfysiolog for en trygg vektnedgang.';
      color = 'var(--error)';
      recommendations = [
        'Konsulter en lege før vektnedgang',
        'Langsom og stabil vektnedgang',
        'Kombinert kardio og styrketrening',
        'Profesjonell veiledning'
      ];
    }

    const result = {
      bmi: roundedBMI,
      category,
      description,
      color,
      recommendations,
      date: new Date().toLocaleDateString('nb-NO'),
      height: bmiData.height,
      weight: bmiData.weight
    };

    setBmiResult(result);
    
    // Add to history
    const newHistory = [...bmiHistory, result].slice(-5); // Keep only last 5 entries
    setBmiHistory(newHistory);
    localStorage.setItem('bmiHistory', JSON.stringify(newHistory));
  };

  const resetBMI = () => {
    setBmiData({
      height: '',
      weight: '',
      age: '',
      gender: 'male'
    });
    setBmiResult(null);
  };

  const loadHistory = () => {
    const saved = localStorage.getItem('bmiHistory');
    if (saved) {
      setBmiHistory(JSON.parse(saved));
    }
  };

  // Load history on component mount
  React.useEffect(() => {
    loadHistory();
  }, []);

  const bmiCategories = [
    { range: 'Under 18.5', name: 'Undervekt', color: 'var(--warning)' },
    { range: '18.5 - 24.9', name: 'Normalvekt', color: 'var(--success)' },
    { range: '25.0 - 29.9', name: 'Overvekt', color: 'var(--accent)' },
    { range: '30.0 og over', name: 'Fedme', color: 'var(--error)' }
  ];

  return (
    <div className="bmi-calculator-page">
      <div className="bmi-header">
        <div className="header-content">
          <div className="header-left">
            <motion.div 
              className="logo-icon"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <FaCalculator />
            </motion.div>
            <div>
              <h1>BMI Kalkulator</h1>
              <p>Beregn din Body Mass Index og få personlige anbefalinger</p>
            </div>
          </div>
          <div className="header-actions">
            {onBack && (
              <motion.button
                className="nav-btn"
                onClick={onBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaArrowLeft />
                Tilbake
              </motion.button>
            )}
            {onHome && (
              <motion.button
                className="nav-btn primary"
                onClick={onHome}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHome />
                Hjem
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <main className="bmi-main">
        <div className="bmi-content">
          <div className="bmi-form-section">
            <div className="bmi-form">
              <h2>Dine mål</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <FaRuler /> Høyde (cm)
                  </label>
                  <input
                    type="number"
                    value={bmiData.height}
                    onChange={(e) => setBmiData({...bmiData, height: e.target.value})}
                    placeholder="170"
                    min="100"
                    max="250"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <FaWeight /> Vekt (kg)
                  </label>
                  <input
                    type="number"
                    value={bmiData.weight}
                    onChange={(e) => setBmiData({...bmiData, weight: e.target.value})}
                    placeholder="70"
                    min="30"
                    max="300"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <FaHeart /> Alder (valgfritt)
                  </label>
                  <input
                    type="number"
                    value={bmiData.age}
                    onChange={(e) => setBmiData({...bmiData, age: e.target.value})}
                    placeholder="25"
                    min="15"
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label>Kjønn</label>
                  <select
                    value={bmiData.gender}
                    onChange={(e) => setBmiData({...bmiData, gender: e.target.value})}
                  >
                    <option value="male">Mann</option>
                    <option value="female">Kvinne</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <motion.button
                  className="calculate-btn"
                  onClick={calculateBMI}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaCalculator />
                  Beregn BMI
                </motion.button>
                <motion.button
                  className="reset-btn"
                  onClick={resetBMI}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Nullstill
                </motion.button>
              </div>
            </div>

            {bmiResult && (
              <motion.div
                className="bmi-result"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="result-header">
                  <div className="bmi-score" style={{ color: bmiResult.color }}>
                    <h3>Din BMI: {bmiResult.bmi}</h3>
                    <p className="bmi-category">{bmiResult.category}</p>
                  </div>
                  <div className="bmi-info">
                    <FaInfoCircle />
                    <p>{bmiResult.description}</p>
                  </div>
                </div>

                <div className="recommendations">
                  <h4>Anbefalinger for deg:</h4>
                  <ul>
                    {bmiResult.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>

          <div className="bmi-info-section">
            <div className="bmi-categories">
              <h3>BMI Kategorier</h3>
              <div className="categories-grid">
                {bmiCategories.map((category, index) => (
                  <div key={index} className="category-item">
                    <div className="category-color" style={{ backgroundColor: category.color }}></div>
                    <div className="category-info">
                      <span className="category-range">{category.range}</span>
                      <span className="category-name">{category.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {bmiHistory.length > 0 && (
              <div className="bmi-history">
                <h3>Din BMI historikk</h3>
                <div className="history-list">
                  {bmiHistory.map((entry, index) => (
                    <div key={index} className="history-item">
                      <div className="history-date">{entry.date}</div>
                      <div className="history-bmi" style={{ color: entry.color }}>
                        {entry.bmi} - {entry.category}
                      </div>
                      <div className="history-details">
                        {entry.height}cm, {entry.weight}kg
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bmi-disclaimer">
              <FaInfoCircle />
              <div>
                <h4>Viktig informasjon</h4>
                <p>
                  BMI er en generell indikator og tar ikke hensyn til muskelfasthet, 
                  benstruktur, alder eller andre faktorer. For en mer nøyaktig vurdering 
                  av din kroppssammensetning, konsulter en lege eller ernæringsfysiolog.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BMICalculator;
