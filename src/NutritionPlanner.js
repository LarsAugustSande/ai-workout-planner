import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUtensils, FaApple, FaDrumstickBite, FaFish, FaLeaf, FaArrowLeft, FaBrain, FaDownload } from 'react-icons/fa';
import './NutritionPlanner.css';

function NutritionPlanner({ onBack }) {
  const [nutritionForm, setNutritionForm] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    activityLevel: 'moderate',
    goals: 'muscle_gain',
    dietaryRestrictions: '',
    allergies: '',
    mealPreferences: 'balanced',
    cookingTimePreference: 'medium',
    budget: 'medium'
  });

  const [mealPlan, setMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedMeals, setExpandedMeals] = useState({});
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNutritionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleMealExpansion = (mealIndex) => {
    setExpandedMeals(prev => ({
      ...prev,
      [mealIndex]: !prev[mealIndex]
    }));
  };

  const generateMealPlan = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5001/api/generate-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nutritionForm)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMealPlan(data.mealPlan);
      } else {
        setError(data.error || 'Kunne ikke generere måltidsplan. Prøv igjen.');
      }
    } catch (err) {
      setError('Kunne ikke koble til serveren. Sjekk at backend kjører.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMealPlanPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Add title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(mealPlan.title, 20, 30);
      
      // Add description
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const descriptionLines = doc.splitTextToSize(mealPlan.description, pageWidth - 40);
      doc.text(descriptionLines, 20, 50);
      
      // Add nutrition info
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Daglige næringsstoffer:', 20, 80);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Kalorier: ${mealPlan.dailyCalories} kcal`, 20, 95);
      doc.text(`Protein: ${mealPlan.macros.protein}g`, 20, 105);
      doc.text(`Karbohydrater: ${mealPlan.macros.carbs}g`, 20, 115);
      doc.text(`Fett: ${mealPlan.macros.fat}g`, 20, 125);
      
      let yPosition = 145;
      
      // Add meals by day
      mealPlan.meals.forEach((day, dayIndex) => {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 30;
        }
        
        // Day header
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(day.day, 20, yPosition);
        yPosition += 20;
        
        // Meals for this day
        day.meals.forEach((meal, mealIndex) => {
          if (yPosition > pageHeight - 50) {
            doc.addPage();
            yPosition = 30;
          }
          
          // Meal title
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(`${meal.type} (${meal.time})`, 30, yPosition);
          yPosition += 12;
          
          // Difficulty
          if (meal.difficulty) {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Vanskelighetsgrad: ${meal.difficulty}`, 30, yPosition);
            yPosition += 8;
          }
          
          // Calories and macros
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.text(`${meal.calories} kcal`, 30, yPosition);
          doc.text(`Protein: ${meal.macros.protein}g`, 100, yPosition);
          doc.text(`Karb: ${meal.macros.carbs}g`, 150, yPosition);
          doc.text(`Fett: ${meal.macros.fat}g`, 200, yPosition);
          yPosition += 12;
          
          // Ingredients
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.text('Ingredienser:', 30, yPosition);
          yPosition += 8;
          
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          meal.ingredients.forEach((ingredient, ingIndex) => {
            doc.text(`• ${ingredient}`, 40, yPosition);
            yPosition += 5;
          });
          
          yPosition += 5;
          
          // Instructions
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.text('Fremgangsmåte:', 30, yPosition);
          yPosition += 8;
          
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          meal.instructions.forEach((instruction, instIndex) => {
            doc.text(`${instIndex + 1}. ${instruction}`, 40, yPosition);
            yPosition += 5;
          });
          
          yPosition += 10;
        });
        
        yPosition += 10;
      });
      
      // Save PDF
      doc.save(`${mealPlan.title.replace(/\s+/g, '_')}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Kunne ikke generere PDF. Prøv igjen.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getMealIcon = (mealType) => {
    switch (mealType.toLowerCase()) {
      case 'frokost':
        return <FaApple />;
      case 'lunsj':
        return <FaDrumstickBite />;
      case 'middag':
        return <FaFish />;
      case 'snack':
        return <FaLeaf />;
      default:
        return <FaUtensils />;
    }
  };

  const getGoalDescription = (goal) => {
    switch (goal) {
      case 'muscle_gain':
        return 'Muskeloppbygging - Høy protein, moderat karbohydrater';
      case 'weight_loss':
        return 'Vekttap - Kaloridefisitt med fokus på protein';
      case 'maintenance':
        return 'Vektvedlikehold - Balansert kosthold';
      case 'endurance':
        return 'Utholdenhet - Høy karbohydrat, moderat protein';
      case 'strength':
        return 'Styrke - Optimal protein og karbohydrat timing';
      default:
        return 'Balansert kosthold';
    }
  };

  return (
    <div className="nutrition-planner-page">
      <header className="nutrition-header">
        <div className="container">
          <motion.div 
            className="header-content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="logo">
              <h1>AI Kostholdsplanlegger</h1>
            </div>
            <p className="subtitle">Få en personlig måltidsplan skapt av AI basert på dine treningsmål og preferanser</p>
            
            {onBack && (
              <motion.button
                className="back-btn"
                onClick={onBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaArrowLeft />
                Tilbake til Treningsplan
              </motion.button>
            )}
          </motion.div>
        </div>
      </header>

      <main className="nutrition-main">
        <div className="container">
          {!mealPlan ? (
            <motion.div 
              className="form-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2>Fortell oss om dine kostholdspreferanser</h2>
              <form className="nutrition-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Alder</label>
                    <input
                      type="number"
                      name="age"
                      value={nutritionForm.age}
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
                      value={nutritionForm.weight}
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
                      value={nutritionForm.height}
                      onChange={handleInputChange}
                      placeholder="175"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Kjønn</label>
                    <select name="gender" value={nutritionForm.gender} onChange={handleInputChange}>
                      <option value="male">Mann</option>
                      <option value="female">Kvinne</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Aktivitetsnivå</label>
                    <select name="activityLevel" value={nutritionForm.activityLevel} onChange={handleInputChange}>
                      <option value="sedentary">Stillesittende</option>
                      <option value="light">Lett aktiv</option>
                      <option value="moderate">Moderat aktiv</option>
                      <option value="active">Aktiv</option>
                      <option value="very_active">Svært aktiv</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Hovedfokus</label>
                    <select name="goals" value={nutritionForm.goals} onChange={handleInputChange}>
                      <option value="muscle_gain">Muskeloppbygging</option>
                      <option value="weight_loss">Vekttap</option>
                      <option value="maintenance">Vektvedlikehold</option>
                      <option value="endurance">Utholdenhet</option>
                      <option value="strength">Styrke</option>
                    </select>
                    <small className="form-hint">
                      {getGoalDescription(nutritionForm.goals)}
                    </small>
                  </div>

                  <div className="form-group">
                    <label>Hvor mye tid ønsker du å bruke på matlaging?</label>
                    <select name="cookingTimePreference" value={nutritionForm.cookingTimePreference} onChange={handleInputChange}>
                      <option value="quick">Kort (5-15 min per måltid)</option>
                      <option value="medium">Middels (15-30 min per måltid)</option>
                      <option value="long">Lang (30+ min per måltid)</option>
                      <option value="flexible">Fleksibel (blandet)</option>
                    </select>
                    <small className="form-hint">
                      Dette påvirker kompleksiteten og forberedelsestiden for måltidene
                    </small>
                  </div>

                  <div className="form-group">
                    <label>Måltidspreferanser</label>
                    <select name="mealPreferences" value={nutritionForm.mealPreferences} onChange={handleInputChange}>
                      <option value="balanced">Balansert</option>
                      <option value="high_protein">Høy protein</option>
                      <option value="low_carb">Lav karbohydrat</option>
                      <option value="vegetarian">Vegetarisk</option>
                      <option value="vegan">Vegansk</option>
                      <option value="mediterranean">Middelhavskost</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Kostholdsbudsjett</label>
                    <select name="budget" value={nutritionForm.budget} onChange={handleInputChange}>
                      <option value="low">Lavt (budsjettvennlig)</option>
                      <option value="medium">Middels</option>
                      <option value="high">Høyt (premium ingredienser)</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Kostholdsrestriksjoner</label>
                    <textarea
                      name="dietaryRestrictions"
                      value={nutritionForm.dietaryRestrictions}
                      onChange={handleInputChange}
                      placeholder="Beskriv eventuelle kostholdsrestriksjoner (f.eks. 'Laktoseintolerant', 'Glutenfri', 'Lavt natrium')..."
                      rows="3"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Allergier</label>
                    <textarea
                      name="allergies"
                      value={nutritionForm.allergies}
                      onChange={handleInputChange}
                      placeholder="List opp eventuelle allergier (f.eks. 'Nøtter', 'Skalldyr', 'Egg')..."
                      rows="2"
                    />
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <motion.button
                  type="button"
                  className="generate-btn"
                  onClick={generateMealPlan}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="loading">
                      <div className="spinner"></div>
                      <span>Genererer måltidsplan...</span>
                    </div>
                  ) : (
                    <>
                      <FaBrain />
                      <span>Generer AI Måltidsplan</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              className="meal-plan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="plan-header">
                <h2>{mealPlan.title}</h2>
                <p>{mealPlan.description}</p>
                <div className="plan-stats">
                  <div className="stat">
                    <span className="stat-label">Daglige kalorier:</span>
                    <span className="stat-value">{mealPlan.dailyCalories}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Protein:</span>
                    <span className="stat-value">{mealPlan.macros.protein}g</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Karbohydrater:</span>
                    <span className="stat-value">{mealPlan.macros.carbs}g</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Fett:</span>
                    <span className="stat-value">{mealPlan.macros.fat}g</span>
                  </div>
                </div>
                <div className="plan-actions">
                  <motion.button
                    className="pdf-download-btn"
                    onClick={generateMealPlanPDF}
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
                    onClick={() => setMealPlan(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Lag ny plan
                  </motion.button>
                </div>
              </div>

              <div className="days-grid">
                {mealPlan.meals.map((day, dayIndex) => (
                  <motion.div
                    key={dayIndex}
                    className="day-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: dayIndex * 0.1 }}
                  >
                    <div className="day-header">
                      <h3>{day.day}</h3>
                    </div>
                    
                    <div className="meals-grid">
                      {day.meals.map((meal, mealIndex) => (
                        <div key={mealIndex} className="meal-card">
                          <div 
                            className="meal-header"
                            onClick={() => toggleMealExpansion(`${dayIndex}-${mealIndex}`)}
                          >
                            <div className="meal-title">
                              <div className="meal-icon">
                                {getMealIcon(meal.type)}
                              </div>
                              <div>
                                <h4>{meal.type}</h4>
                                <p className="meal-time">{meal.time}</p>
                                {meal.difficulty && (
                                  <span className={`difficulty-badge ${meal.difficulty}`}>
                                    {meal.difficulty}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="meal-stats">
                              <span className="calories">{meal.calories} kcal</span>
                              <span className={`expand-icon ${expandedMeals[`${dayIndex}-${mealIndex}`] ? 'expanded' : ''}`}>
                                ▼
                              </span>
                            </div>
                          </div>
                          
                          {expandedMeals[`${dayIndex}-${mealIndex}`] && (
                            <div className="meal-details">
                              <div className="ingredients">
                                <h5>Ingredienser:</h5>
                                <ul>
                                  {meal.ingredients.map((ingredient, ingIndex) => (
                                    <li key={ingIndex}>{ingredient}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="instructions">
                                <h5>Fremgangsmåte:</h5>
                                <ol>
                                  {meal.instructions.map((instruction, instIndex) => (
                                    <li key={instIndex}>{instruction}</li>
                                  ))}
                                </ol>
                              </div>
                              
                              <div className="nutrition-info">
                                <div className="macro-breakdown">
                                  <span>Protein: {meal.macros.protein}g</span>
                                  <span>Karb: {meal.macros.carbs}g</span>
                                  <span>Fett: {meal.macros.fat}g</span>
                                </div>
                                {meal.prepTime && (
                                  <div className="prep-time">
                                    <strong>Forberedelsestid:</strong> {meal.prepTime}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default NutritionPlanner;
