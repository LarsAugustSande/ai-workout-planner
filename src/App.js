import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaUtensils, FaDumbbell, FaChartLine, FaDownload, FaQuestionCircle, FaCalculator } from 'react-icons/fa';
import LandingPage from './LandingPage';
import NutritionPlanner from './NutritionPlanner';
import ProgressionTracker from './ProgressionTracker';
import ContactPage from './ContactPage';
import BMICalculator from './BMICalculator';
import FAQ from './FAQ';
import AboutUs from './AboutUs';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import Navigation from './Navigation';
import Footer from './Footer';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'workout', 'nutrition', 'progression', 'contact', 'bmi', 'faq', 'about', 'privacy', 'terms'
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    fitnessLevel: 'beginner',
    goals: 'strength',
    availableTime: '30',
    customTime: '',
    equipment: 'minimal',
    injuries: '',
    workoutSplit: 'push_pull_legs',
    trainingDays: '3'
  });

  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedDays, setExpandedDays] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editSuggestions, setEditSuggestions] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGettingRecommendation, setIsGettingRecommendation] = useState(false);
  const [splitRecommendation, setSplitRecommendation] = useState(null);
  const [sportSpecific, setSportSpecific] = useState('');


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleDayExpansion = (dayIndex) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayIndex]: !prev[dayIndex]
    }));
  };

  const handleEditSuggestions = async () => {
    if (!editSuggestions.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/edit-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPlan: workoutPlan,
          suggestions: editSuggestions,
          userGoals: formData.injuries,
          availableTime: formData.availableTime === 'custom' ? formData.customTime : formData.availableTime
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setWorkoutPlan(data.workoutPlan);
        setEditMode(false);
        setEditSuggestions('');
      } else {
        setError(data.error || 'Kunne ikke oppdatere treningsplanen.');
      }
    } catch (err) {
      setError('Kunne ikke koble til serveren. Sjekk at backend kjører.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSplitRecommendation = async () => {
    setIsGettingRecommendation(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5001/api/recommend-split', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          availableTime: formData.availableTime === 'custom' ? formData.customTime : formData.availableTime,
          sportSpecific: formData.goals === 'sport' ? sportSpecific : null
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSplitRecommendation(data.recommendation);
        // Auto-select the recommended split
        setFormData(prev => ({
          ...prev,
          workoutSplit: data.recommendation.recommendedSplit
        }));
      } else {
        setError(data.error || 'Kunne ikke få split-anbefaling.');
      }
    } catch (err) {
      setError('Kunne ikke koble til serveren. Sjekk at backend kjører.');
    } finally {
      setIsGettingRecommendation(false);
    }
  };

  const generateWorkoutPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Add title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(workoutPlan.title, 20, 30);
      
      // Add description
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const descriptionLines = doc.splitTextToSize(workoutPlan.description, pageWidth - 40);
      doc.text(descriptionLines, 20, 50);
      
      let yPosition = 80;
      
      // Add workouts
      workoutPlan.workouts.forEach((workout, index) => {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 30;
        }
        
        // Workout title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(workout.day, 20, yPosition);
        yPosition += 15;
        
        if (workout.focus) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          doc.text(`🎯 ${workout.focus}`, 20, yPosition);
          yPosition += 10;
        }
        
        if (workout.exercises) {
          // Exercises
          workout.exercises.forEach((exercise, exIndex) => {
            if (yPosition > pageHeight - 30) {
              doc.addPage();
              yPosition = 30;
            }
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`${exIndex + 1}. ${exercise.name}`, 30, yPosition);
            yPosition += 8;
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`   Sets: ${exercise.sets}`, 30, yPosition);
            doc.text(`   Hvile: ${exercise.rest}`, 100, yPosition);
            yPosition += 8;
            
            if (exercise.tips) {
              const tipsLines = doc.splitTextToSize(`   Tips: ${exercise.tips}`, pageWidth - 50);
              doc.text(tipsLines, 30, yPosition);
              yPosition += tipsLines.length * 4 + 5;
            }
            
            yPosition += 5;
          });
        } else {
          // Rest day
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          const restText = workout.description || "Dette er en hviledag. Fokuser på hvile, gjenoppretting og næring.";
          const restLines = doc.splitTextToSize(restText, pageWidth - 40);
          doc.text(restLines, 30, yPosition);
          yPosition += restLines.length * 5 + 15;
        }
        
        yPosition += 10;
      });
      
      // Save PDF
      doc.save(`${workoutPlan.title.replace(/\s+/g, '_')}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Kunne ikke generere PDF. Prøv igjen.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generateWorkoutPlan = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Use custom time if selected, otherwise use availableTime
      const timeToUse = formData.availableTime === 'custom' ? formData.customTime : formData.availableTime;
      
      const response = await fetch('http://localhost:5001/api/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          availableTime: timeToUse,
          sportSpecific: formData.goals === 'sport' ? sportSpecific : null
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setWorkoutPlan(data.workoutPlan);
      } else {
        setError(data.error || 'Kunne ikke generere treningsplan. Prøv igjen.');
      }
    } catch (err) {
      setError('Kunne ikke koble til serveren. Sjekk at backend kjører.');
    } finally {
      setIsLoading(false);
    }
  };


  // Show landing page if selected
  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage 
          onGetStarted={() => setCurrentPage('workout')} 
          onContact={() => setCurrentPage('contact')} 
        />
        <Footer onNavigate={setCurrentPage} />
      </>
    );
  }

  // Show nutrition page if selected
  if (currentPage === 'nutrition') {
    return (
      <>
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          isVisible={true}
        />
        <NutritionPlanner onBack={() => setCurrentPage('workout')} />
        <Footer onNavigate={setCurrentPage} />
      </>
    );
  }

  // Show progression page if selected
  if (currentPage === 'progression') {
    return (
      <>
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          isVisible={true}
        />
        <ProgressionTracker onBack={() => setCurrentPage('workout')} />
        <Footer onNavigate={setCurrentPage} />
      </>
    );
  }

  // Show contact page if selected
  if (currentPage === 'contact') {
    return (
      <>
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          isVisible={true}
        />
        <ContactPage onBack={() => setCurrentPage('landing')} />
        <Footer onNavigate={setCurrentPage} />
      </>
    );
  }

  // Show BMI calculator page if selected
  if (currentPage === 'bmi') {
    return (
      <>
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          isVisible={true}
        />
        <BMICalculator onBack={() => setCurrentPage('landing')} onHome={() => setCurrentPage('landing')} />
        <Footer onNavigate={setCurrentPage} />
      </>
    );
  }

  // Show FAQ page if selected
  if (currentPage === 'faq') {
    return (
      <>
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          isVisible={true}
        />
        <FAQ onBack={() => setCurrentPage('landing')} />
        <Footer onNavigate={setCurrentPage} />
      </>
    );
  }

  // Show About Us page if selected
  if (currentPage === 'about') {
    return (
      <>
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          isVisible={true}
        />
        <AboutUs onBack={() => setCurrentPage('landing')} />
        <Footer onNavigate={setCurrentPage} />
      </>
    );
  }

  // Show Privacy Policy page if selected
  if (currentPage === 'privacy') {
    return (
      <>
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          isVisible={true}
        />
        <PrivacyPolicy onBack={() => setCurrentPage('landing')} />
        <Footer onNavigate={setCurrentPage} />
      </>
    );
  }

  // Show Terms of Service page if selected
  if (currentPage === 'terms') {
    return (
      <>
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          isVisible={true}
        />
        <TermsOfService onBack={() => setCurrentPage('landing')} />
        <Footer onNavigate={setCurrentPage} />
      </>
    );
  }

  // Show workout page (default/main page)
  if (currentPage === 'workout') {
    return (
      <>
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          isVisible={true}
        />
        <div className="app">
      
      <header className="header">
        <div className="container">
          <motion.div 
            className="header-content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="logo">
              <FaBrain className="logo-icon" />
              <h1>Trenly</h1>
            </div>
            <p className="subtitle">Få en personlig treningsplan skapt av AI basert på dine mål og forutsetninger</p>
          </motion.div>
        </div>
      </header>

      <main className="main">
        <div className="container">

          {!workoutPlan ? (
            <motion.div 
              className="form-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2>Fortell oss om deg</h2>
              <form className="workout-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Alder</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="25"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Vekt (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="70"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Høyde (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="175"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Fitnessnivå</label>
                    <select name="fitnessLevel" value={formData.fitnessLevel} onChange={handleInputChange}>
                      <option value="beginner">Nybegynner</option>
                      <option value="intermediate">Mellomliggende</option>
                      <option value="advanced">Avansert</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Hovedfokus</label>
                    <select name="goals" value={formData.goals} onChange={handleInputChange}>
                      <option value="strength">Styrkeoppbygging</option>
                      <option value="cardio">Kardiovaskulær helse</option>
                      <option value="weightLoss">Vekttap</option>
                      <option value="muscle">Muskeloppbygging</option>
                      <option value="endurance">Utholdenhet</option>
                      <option value="flexibility">Fleksibilitet</option>
                      <option value="sport">Sportspesifikk trening</option>
                    </select>
                  </div>

                  {formData.goals === 'sport' && (
                    <div className="form-group">
                      <label>Hvilken idrett?</label>
                      <input
                        type="text"
                        name="sportSpecific"
                        value={sportSpecific}
                        onChange={(e) => setSportSpecific(e.target.value)}
                        placeholder="f.eks. fotball, basketball, svømming, tennis, løping..."
                        className="sport-input"
                      />
                      <small className="form-hint">
                        💡 Beskriv hvilken idrett du trener for, så tilpasser vi øvelsene deretter
                      </small>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Treningslengde</label>
                    <div className="time-selector">
                      <select name="availableTime" value={formData.availableTime} onChange={handleInputChange}>
                        <option value="15">15 min</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">1 time</option>
                        <option value="90">1.5 timer</option>
                        <option value="120">2 timer</option>
                        <option value="150">2.5 timer</option>
                        <option value="180">3 timer</option>
                        <option value="custom">Egen lengde</option>
                      </select>
                      {formData.availableTime === 'custom' && (
                        <div className="custom-time-input">
                          <input
                            type="number"
                            name="customTime"
                            placeholder="Minutter"
                            min="5"
                            max="180"
                            value={formData.customTime || ''}
                            onChange={handleInputChange}
                            className="custom-time-field"
                          />
                          <span className="time-unit">minutter</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Utstyr</label>
                    <select name="equipment" value={formData.equipment} onChange={handleInputChange}>
                      <option value="minimal">Minimalt (kroppsvekt)</option>
                      <option value="basic">Grunnleggende (dumbbells)</option>
                      <option value="full">Fullt utstyr (gym)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Antall treningsdager per uke</label>
                    <select name="trainingDays" value={formData.trainingDays} onChange={handleInputChange}>
                      <option value="2">2 dager</option>
                      <option value="3">3 dager</option>
                      <option value="4">4 dager</option>
                      <option value="5">5 dager</option>
                      <option value="6">6 dager</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Treningssplit</label>
                    <div className="split-selector">
                      <select name="workoutSplit" value={formData.workoutSplit} onChange={handleInputChange}>
                        <option value="push_pull_legs">Push/Pull/Legs</option>
                        <option value="upper_lower">Upper/Lower</option>
                        <option value="full_body">Full Body</option>
                        <option value="bro_split">Bro Split</option>
                        <option value="custom">Tilpasset</option>
                      </select>
                      <motion.button
                        type="button"
                        className="ai-recommend-btn"
                        onClick={getSplitRecommendation}
                        disabled={isGettingRecommendation}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isGettingRecommendation ? (
                          <>
                            <div className="spinner"></div>
                            <span>Anbefaler...</span>
                          </>
                        ) : (
                          <>
                            <FaBrain />
                            <span>Velg for meg</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                    <small className="form-hint">
                      💡 Split vil automatisk tilpasse seg antall valgte treningsdager
                    </small>
                    {splitRecommendation && (
                      <div className="recommendation-result">
                        <div className="recommendation-header">
                          <FaBrain className="recommendation-icon" />
                          <strong>AI-anbefaling:</strong>
                        </div>
                        <p className="recommendation-reasoning">{splitRecommendation.reasoning}</p>
                        <div className="recommendation-tips">
                          <strong>Tips:</strong> {splitRecommendation.tips}
                        </div>
                        <button 
                          type="button"
                          className="close-recommendation"
                          onClick={() => setSplitRecommendation(null)}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label>Spesifikke mål, skader eller begrensninger</label>
                    <textarea
                      name="injuries"
                      value={formData.injuries}
                      onChange={handleInputChange}
                      placeholder="Beskriv dine spesifikke mål, skader eller begrensninger (f.eks. 'Vil bygge opp etter knekt ben', 'Trenger å forbedre løpehastighet', 'Har skulderproblemer', 'Vil fokusere på core-styrke')..."
                      rows="4"
                    />
                    <small className="form-hint">
                      💡 AI-en vil lage en personlig plan basert på dine spesifikke behov og mål
                    </small>
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <motion.button
                  type="button"
                  className="generate-btn"
                  onClick={generateWorkoutPlan}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="loading">
                      <div className="spinner"></div>
                      <span>Genererer treningsplan...</span>
                    </div>
                  ) : (
                    <>
                      <FaBrain />
                      <span>Generer AI Treningsplan</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              className="workout-plan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="plan-header">
                <h2>{workoutPlan.title}</h2>
                <p>{workoutPlan.description}</p>
                {workoutPlan.splitType && (
                  <div className="split-info">
                    <span className="split-badge">{workoutPlan.splitType}</span>
                  </div>
                )}
                <div className="plan-actions">
                  <motion.button
                    className="edit-toggle-btn"
                    onClick={() => setEditMode(!editMode)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {editMode ? 'Avbryt redigering' : 'Foreslå endringer'}
                  </motion.button>
                  <motion.button
                    className="pdf-download-btn"
                    onClick={generateWorkoutPDF}
                    disabled={isGeneratingPDF}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="spinner"></div>
                        <span>Genererer PDF...</span>
                      </>
                    ) : (
                      <>
                        <FaDownload />
                        <span>Last ned PDF</span>
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    className="new-plan-btn"
                    onClick={() => setWorkoutPlan(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Lag ny plan
                  </motion.button>
                  <motion.button
                    className="back-to-landing-btn"
                    onClick={() => setCurrentPage('landing')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Tilbake til forsiden
                  </motion.button>
                </div>
              </div>

              {editMode && (
                <div className="edit-section">
                  <h3>Foreslå endringer til treningsplanen</h3>
                  <textarea
                    value={editSuggestions}
                    onChange={(e) => setEditSuggestions(e.target.value)}
                    placeholder="Beskriv hvilke endringer du ønsker (f.eks. 'Bytt ut knebøy med leg press', 'Legg til mer core-øvelser', 'Reduser vektene')..."
                    rows="3"
                    className="edit-textarea"
                  />
                  <div className="edit-actions">
                    <motion.button
                      className="apply-changes-btn"
                      onClick={handleEditSuggestions}
                      disabled={isLoading || !editSuggestions.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isLoading ? 'Oppdaterer...' : 'Bruk endringer'}
                    </motion.button>
                  </div>
                </div>
              )}

              <div className="workouts-grid">
                {workoutPlan.workouts.map((workout, index) => (
                  <motion.div
                    key={index}
                    className="workout-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div 
                      className="workout-header"
                      onClick={() => toggleDayExpansion(index)}
                    >
                      <div className="workout-title">
                        <h3>{workout.day}</h3>
                        {workout.focus && (
                          <p className="workout-focus">🎯 {workout.focus}</p>
                        )}
                      </div>
                      <div className="workout-stats">
                        {workout.exercises ? (
                          <span className="exercise-count">
                            {workout.exercises.length} øvelser
                          </span>
                        ) : (
                          <span className="rest-day">Hviledag</span>
                        )}
                        <span className={`expand-icon ${expandedDays[index] ? 'expanded' : ''}`}>
                          ▼
                        </span>
                      </div>
                    </div>
                    
                    {expandedDays[index] && (
                      <div className="exercises">
                        {workout.exercises ? (
                          workout.exercises.map((exercise, exIndex) => (
                            <div key={exIndex} className="exercise">
                              <div className="exercise-header">
                                <div className="exercise-name">{exercise.name}</div>
                                {exercise.equipment && (
                                  <span className="equipment-tag">{exercise.equipment}</span>
                                )}
                              </div>
                              <div className="exercise-details">
                                <span className="sets">{exercise.sets}</span>
                                <span className="rest">Hvile: {exercise.rest}</span>
                              </div>
                              {exercise.tips && (
                                <div className="exercise-tips">
                                  <strong>💡 Tips:</strong> {exercise.tips}
                                </div>
                              )}
                              {exercise.alternatives && (
                                <div className="exercise-alternatives">
                                  <strong>🔄 Alternativer:</strong> {exercise.alternatives}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="rest-day-content">
                            <div className="rest-day-icon">😴</div>
                            <div className="rest-day-description">
                              {workout.description || "Dette er en hviledag. Fokuser på hvile, gjenoppretting og næring. Du kan gjøre lett stretching eller gå en rolig tur, men unngå intens trening."}
                            </div>
                            <div className="rest-day-tips">
                              <h4>💡 Hviledagstips:</h4>
                              <ul>
                                <li>Få nok søvn (7-9 timer)</li>
                                <li>Spis næringsrik mat</li>
                                <li>Hold deg hydrert</li>
                                <li>Gjør lett stretching eller yoga</li>
                                <li>Gå en rolig tur i naturen</li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
        </div>
        <Footer onNavigate={setCurrentPage} />
      </>
    );
  }

  // Default fallback (should not reach here)
  return (
    <div className="app">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        isVisible={currentPage === 'landing'}
      />
      
      <header className="header">
        <div className="container">
          <motion.div 
            className="header-content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="logo">
              <FaBrain className="logo-icon" />
              <h1>Trenly</h1>
            </div>
            <p className="subtitle">Få en personlig treningsplan skapt av AI basert på dine mål og forutsetninger</p>
          </motion.div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Velkommen til Trenly</h2>
            <p>Velg en funksjon fra navigasjonen ovenfor.</p>
          </div>
        </div>
      </main>
      
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;
