import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUtensils, FaChartLine, FaDownload, FaQuestionCircle, FaCalculator } from 'react-icons/fa';
import LandingPage from './LandingPage';
import NutritionPlanner from './NutritionPlanner';
import ProgressionTracker from './ProgressionTracker';
import ContactPage from './ContactPage';
import BMICalculator from './BMICalculator';
import FAQ from './FAQ';
import AboutUs from './AboutUs';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import PricingPage from './PricingPage';
import Navigation from './Navigation';
import Footer from './Footer';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'workout', 'nutrition', 'progression', 'contact', 'bmi', 'faq', 'about', 'privacy', 'terms', 'pricing'
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
    trainingDays: '3',
    customSplit: '', // For custom split input
    customSplitDays: [] // For custom split day selection
  });

  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedDays, setExpandedDays] = useState({});
  const [expandedExercises, setExpandedExercises] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editSuggestions, setEditSuggestions] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGettingRecommendation, setIsGettingRecommendation] = useState(false);
  const [splitRecommendation, setSplitRecommendation] = useState(null);
  const [sportSpecific, setSportSpecific] = useState('');
  const [useAutoSplit, setUseAutoSplit] = useState(true);


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
      
      // Define colors
      const colors = {
        primary: [30, 58, 138],      // #1e3a8a
        secondary: [5, 150, 105],    // #059669
        accent: [245, 158, 11],      // #f59e0b
        text: [31, 41, 55],          // #1f2937
        lightGray: [243, 244, 246],  // #f3f4f6
        border: [229, 231, 235]      // #e5e7eb
      };
      
      let yPosition = 30;
      
      // Helper function to clean text and remove problematic characters while preserving Norwegian characters
      const cleanText = (text) => {
        if (!text) return '';
        return text
          // Remove problematic characters but keep Norwegian characters (æ, ø, å, Æ, Ø, Å)
          .replace(/[^\w\sæøåÆØÅ.,!?;:()\-]/g, '') // Keep alphanumeric, spaces, Norwegian chars, and basic punctuation
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .trim();
      };
      
      // Helper function to add page if needed
      const checkPageBreak = (requiredSpace = 50) => {
        if (yPosition > pageHeight - requiredSpace) {
          doc.addPage();
          yPosition = 30;
          return true;
        }
        return false;
      };
      
      // Helper function to add colored header
      const addColoredHeader = (text, color, fontSize = 18) => {
        doc.setFillColor(color[0], color[1], color[2]);
        doc.rect(0, yPosition - 15, pageWidth, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', 'bold');
        doc.text(text, 20, yPosition - 5);
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        yPosition += 25;
      };
      
      // Helper function to add section divider
      const addSectionDivider = () => {
        doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
        doc.setLineWidth(0.5);
        doc.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 15;
      };
      
      // Cover page with logo and title
      doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Add actual logo with text
      try {
        // Create a canvas to load the logo image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        // Try to load the logo image
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = '/logotekstsort.png'; // Use the logo with text
        });
        
        // Draw logo on canvas with original dimensions to maintain quality
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        
        // Convert canvas to data URL
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate appropriate size for PDF (maintain aspect ratio)
        const maxWidth = 180;
        const maxHeight = 60;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        
        let logoWidth = maxWidth;
        let logoHeight = maxWidth / aspectRatio;
        
        if (logoHeight > maxHeight) {
          logoHeight = maxHeight;
          logoWidth = maxHeight * aspectRatio;
        }
        
        // Add logo to PDF with proper dimensions
        doc.addImage(imgData, 'PNG', pageWidth/2 - logoWidth/2, 40, logoWidth, logoHeight);
        
      } catch (error) {
        console.log('Could not load logo image, using enhanced text version');
        // Enhanced text-based logo representation
        doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.roundedRect(pageWidth/2 - 60, 35, 120, 90, 10, 10, 'F');
        
        // Logo icon (T in circle)
        doc.setFillColor(255, 255, 255);
        doc.circle(pageWidth/2, 80, 22, 'F');
        
        // T icon
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('T', pageWidth/2 - 4, 87, { align: 'center' });
        
        // Main brand text
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('TRENLY', pageWidth/2, 110, { align: 'center' });
        
        // Subtitle
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('Din personlige AI-trener', pageWidth/2, 120, { align: 'center' });
      }
      
      // Title
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text(workoutPlan.title, pageWidth/2, 140, { align: 'center' });
      
      // Split type badge
      if (workoutPlan.splitType) {
        doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        doc.roundedRect(pageWidth/2 - 40, 150, 80, 12, 6, 6, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(workoutPlan.splitType, pageWidth/2, 158, { align: 'center' });
      }
      
      // Description
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      // Clean description text and remove problematic characters
      const cleanDescription = cleanText(workoutPlan.description);
      const descriptionLines = doc.splitTextToSize(cleanDescription, pageWidth - 40);
      doc.text(descriptionLines, pageWidth/2, 180, { align: 'center' });
      
      // Date and generated info
      doc.setFontSize(10);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      const currentDate = new Date().toLocaleDateString('no-NO');
      doc.text(`Generert: ${currentDate}`, pageWidth/2, pageHeight - 40, { align: 'center' });
      doc.text('Generert av Trenly AI', pageWidth/2, pageHeight - 30, { align: 'center' });
      
      // Start new page for workouts
      doc.addPage();
      yPosition = 30;
      
      // Workouts section header
      addColoredHeader('TRENINGSPLAN', colors.primary, 20);
      
      // Add workouts
      workoutPlan.workouts.forEach((workout, index) => {
        checkPageBreak(80);
        
        // Workout day header with colored background
        doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.roundedRect(15, yPosition - 8, pageWidth - 30, 16, 4, 4, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(workout.day, 25, yPosition);
        yPosition += 20;
        
        // Focus/description
        if (workout.focus) {
          doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          doc.setFontSize(11);
          doc.setFont('helvetica', 'italic');
          // Clean text and replace problematic characters
          const cleanFocus = cleanText(workout.focus);
          doc.text(`Fokus: ${cleanFocus}`, 25, yPosition);
          yPosition += 12;
        }
        
        if (workout.exercises && workout.exercises.length > 0) {
          // Exercises table header
          doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
          doc.rect(20, yPosition - 6, pageWidth - 40, 12, 'F');
          doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text('Øvelse', 25, yPosition);
          doc.text('Sets', 120, yPosition);
          doc.text('Hvile', 150, yPosition);
          doc.text('Utstyr', 180, yPosition);
          yPosition += 15;
          
          // Exercises
          workout.exercises.forEach((exercise, exIndex) => {
            checkPageBreak(40);
            
            // Alternate row colors
            if (exIndex % 2 === 0) {
              doc.setFillColor(248, 250, 252);
              doc.rect(20, yPosition - 4, pageWidth - 40, 12, 'F');
            }
            
            // Exercise name
            doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            // Clean exercise name and remove problematic characters
            const cleanExerciseName = cleanText(exercise.name);
            const exerciseName = `${exIndex + 1}. ${cleanExerciseName}`;
            const maxNameWidth = 90;
            if (doc.getTextWidth(exerciseName) > maxNameWidth) {
              const truncatedName = doc.splitTextToSize(exerciseName, maxNameWidth)[0];
              doc.text(truncatedName, 25, yPosition);
            } else {
              doc.text(exerciseName, 25, yPosition);
            }
            
            // Sets
            doc.setFont('helvetica', 'normal');
            const cleanSets = cleanText(exercise.sets) || '-';
            doc.text(cleanSets, 120, yPosition);
            
            // Rest
            const cleanRest = cleanText(exercise.rest) || '-';
            doc.text(cleanRest, 150, yPosition);
            
            // Equipment
            const cleanEquipment = cleanText(exercise.equipment) || '-';
            doc.text(cleanEquipment, 180, yPosition);
            
            yPosition += 15;
            
            // Exercise details (tips, description, etc.)
            if (exercise.tips || exercise.description) {
              checkPageBreak(30);
              
              doc.setFontSize(9);
              doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
              
              if (exercise.tips) {
                doc.setFont('helvetica', 'bold');
                doc.text('Tips:', 35, yPosition);
                doc.setFont('helvetica', 'normal');
                // Clean text and remove problematic characters
                const cleanTips = cleanText(exercise.tips);
                const tipsLines = doc.splitTextToSize(cleanTips, pageWidth - 60);
                doc.text(tipsLines, 35, yPosition + 4);
                yPosition += tipsLines.length * 4 + 8;
              }
              
              if (exercise.description) {
                doc.setFont('helvetica', 'bold');
                doc.text('Beskrivelse:', 35, yPosition);
                doc.setFont('helvetica', 'normal');
                // Clean text and remove problematic characters
                const cleanDescription = cleanText(exercise.description);
                const descLines = doc.splitTextToSize(cleanDescription, pageWidth - 60);
                doc.text(descLines, 35, yPosition + 4);
                yPosition += descLines.length * 4 + 8;
              }
              
              if (exercise.muscleGroups) {
                doc.setFont('helvetica', 'bold');
                doc.text('Muskler:', 35, yPosition);
                doc.setFont('helvetica', 'normal');
                // Clean muscle groups text
                const cleanMuscles = exercise.muscleGroups.map(m => cleanText(m)).join(', ');
                doc.text(cleanMuscles, 35, yPosition + 4);
                yPosition += 8;
              }
              
              yPosition += 5;
            }
          });
        } else {
          // Rest day
          checkPageBreak(30);
          doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
          doc.roundedRect(20, yPosition - 6, pageWidth - 40, 20, 4, 4, 'F');
          doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          // Clean rest day text and remove problematic characters
          const restText = workout.description || "Dette er en hviledag. Fokuser på hvile, gjenoppretting og næring.";
          const cleanRestText = cleanText(restText);
          const restLines = doc.splitTextToSize(cleanRestText, pageWidth - 60);
          doc.text(restLines, 30, yPosition + 4);
          yPosition += restLines.length * 5 + 15;
        }
        
        yPosition += 15;
        addSectionDivider();
      });
      
      // Add progression and safety tips if available
      if (workoutPlan.progression || workoutPlan.safety) {
        checkPageBreak(60);
        
        if (workoutPlan.progression) {
          addColoredHeader('PROGRESJON', colors.secondary);
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          // Clean progression text and remove problematic characters
          const cleanProgression = cleanText(workoutPlan.progression);
          const progressionLines = doc.splitTextToSize(cleanProgression, pageWidth - 40);
          doc.text(progressionLines, 25, yPosition);
          yPosition += progressionLines.length * 5 + 15;
        }
        
        if (workoutPlan.safety) {
          addColoredHeader('SIKKERHETSTIPS', colors.accent);
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          // Clean safety text and remove problematic characters
          const cleanSafety = cleanText(workoutPlan.safety);
          const safetyLines = doc.splitTextToSize(cleanSafety, pageWidth - 40);
          doc.text(safetyLines, 25, yPosition);
          yPosition += safetyLines.length * 5 + 15;
        }
      }
      
      // Footer on last page
      doc.setFontSize(8);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text('Trenly AI - Din personlige treningsassistent', pageWidth/2, pageHeight - 15, { align: 'center' });
      
      // Save PDF with better filename
      const filename = `${workoutPlan.title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
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
          sportSpecific: formData.goals === 'sport' ? sportSpecific : null,
          useAutoSplit: useAutoSplit
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
          onPricing={() => setCurrentPage('pricing')}
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

  // Show Pricing page if selected
  if (currentPage === 'pricing') {
    return (
      <>
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          isVisible={true}
        />
        <PricingPage onGetStarted={(plan) => {
          console.log(`User selected: ${plan}`);
          setCurrentPage('workout');
        }} />
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
                        Beskriv hvilken idrett du trener for, så tilpasser vi øvelsene deretter
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
                    
                    {/* Auto Split Toggle */}
                    <div className="split-toggle">
                      <div className="toggle-option">
                        <input
                          type="radio"
                          id="auto-split"
                          name="splitMode"
                          checked={useAutoSplit}
                          onChange={() => setUseAutoSplit(true)}
                        />
                        <label htmlFor="auto-split">
                          <span className="toggle-icon">AI</span>
                          <div className="toggle-content">
                            <strong>Automatisk valg (anbefalt)</strong>
                            <small>AI velger optimal split basert på dine preferanser</small>
                          </div>
                        </label>
                      </div>
                      
                      <div className="toggle-option">
                        <input
                          type="radio"
                          id="manual-split"
                          name="splitMode"
                          checked={!useAutoSplit}
                          onChange={() => setUseAutoSplit(false)}
                        />
                        <label htmlFor="manual-split">
                          <span className="toggle-icon">Manual</span>
                          <div className="toggle-content">
                            <strong>Jeg velger selv</strong>
                            <small>For erfarne brukere som vet hva de vil ha</small>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Manual Split Selection (only shown when manual is selected) */}
                    {!useAutoSplit && (
                      <div className="manual-split-selection">
                        <select name="workoutSplit" value={formData.workoutSplit} onChange={handleInputChange}>
                          <option value="push_pull_legs">Push/Pull/Legs</option>
                          <option value="upper_lower">Upper/Lower</option>
                          <option value="full_body">Full Body</option>
                          <option value="bro_split">Bro Split</option>
                          <option value="cardio_focused">Kardio-fokusert</option>
                          <option value="running_focused">Løpe-fokusert</option>
                          <option value="strength_focused">Styrke-fokusert</option>
                          <option value="hybrid">Hybrid (Styrke + Kardio)</option>
                          <option value="powerlifting">Powerlifting</option>
                          <option value="bodybuilding">Bodybuilding</option>
                          <option value="functional">Funksjonell trening</option>
                          <option value="custom">Tilpasset</option>
                        </select>
                        
                        {/* Custom Split Input */}
                        {formData.workoutSplit === 'custom' && (
                          <div className="custom-split-section">
                            <div className="form-group">
                              <label>Beskriv din tilpassede treningssplit:</label>
                              <textarea
                                name="customSplit"
                                value={formData.customSplit}
                                onChange={handleInputChange}
                                placeholder="Eksempel: Mandag: Bryst og triceps, Tirsdag: Rygg og biceps, Onsdag: Ben, Torsdag: Skuldre, Fredag: Kardio"
                                rows="3"
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Velg treningsdager for din tilpassede split:</label>
                              <div className="day-selection">
                                {['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'].map((day, index) => (
                                  <label key={day} className="day-checkbox">
                                    <input
                                      type="checkbox"
                                      checked={formData.customSplitDays.includes(day)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setFormData(prev => ({
                                            ...prev,
                                            customSplitDays: [...prev.customSplitDays, day]
                                          }));
                                        } else {
                                          setFormData(prev => ({
                                            ...prev,
                                            customSplitDays: prev.customSplitDays.filter(d => d !== day)
                                          }));
                                        }
                                      }}
                                    />
                                    <span>{day}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            
                            <div className="custom-split-info">
                              <p><strong>Tips for tilpasset split:</strong></p>
                              <ul>
                                <li>Beskriv hvilke muskelgrupper du vil trene på hvilke dager</li>
                                <li>Inkluder hviledager for gjenoppretting</li>
                                <li>Vurder å balansere push/pull-øvelser</li>
                                <li>Legg til kardio hvis ønsket</li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Auto Split Info */}
                    {useAutoSplit && (
                      <div className="auto-split-info">
                        <div className="auto-split-badge">
                          <span>AI vil automatisk velge optimal split</span>
                        </div>
                        <small className="form-hint">
                          Basert på antall treningsdager, fitnessnivå og mål vil AI velge den beste split-strukturen for deg
                        </small>
                      </div>
                    )}

                    {/* Manual Split Hint */}
                    {!useAutoSplit && (
                      <small className="form-hint">
                        Velg den split-strukturen som passer best for dine treningsdager og mål
                      </small>
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
                      AI-en vil lage en personlig plan basert på dine spesifikke behov og mål
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
                    {workoutPlan.autoSplitInfo && workoutPlan.autoSplitInfo.wasAutoSelected && (
                      <div className="auto-split-explanation">
                        <span className="auto-split-icon">AI</span>
                        <div className="auto-split-text">
                          <strong>AI valgte denne split-strukturen:</strong>
                          <p>{workoutPlan.autoSplitInfo.reasoning}</p>
                        </div>
                      </div>
                    )}
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
                          <p className="workout-focus">{workout.focus}</p>
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
                          workout.exercises.map((exercise, exIndex) => {
                            const exerciseKey = `${index}-${exIndex}`;
                            const isExpanded = expandedExercises[exerciseKey];
                            
                            return (
                              <div key={exIndex} className="exercise">
                                <div 
                                  className="exercise-header"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Exercise header clicked:', exerciseKey, 'Current expanded state:', expandedExercises[exerciseKey]);
                                    const newExpandedState = !expandedExercises[exerciseKey];
                                    console.log('Setting new expanded state to:', newExpandedState);
                                    setExpandedExercises(prev => {
                                      const newState = {
                                        ...prev,
                                        [exerciseKey]: newExpandedState
                                      };
                                      console.log('New expanded exercises state:', newState);
                                      return newState;
                                    });
                                  }}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div className="exercise-name">{exercise.name}</div>
                                  <div className="exercise-header-right">
                                    {exercise.equipment && (
                                      <span className="equipment-tag">{exercise.equipment}</span>
                                    )}
                                    <span 
                                      className={`exercise-expand-icon ${isExpanded ? 'expanded' : ''}`}
                                      data-expanded={isExpanded}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('Expand icon clicked:', exerciseKey, 'Current expanded state:', expandedExercises[exerciseKey]);
                                        const newExpandedState = !expandedExercises[exerciseKey];
                                        console.log('Setting new expanded state to:', newExpandedState);
                                        setExpandedExercises(prev => {
                                          const newState = {
                                            ...prev,
                                            [exerciseKey]: newExpandedState
                                          };
                                          console.log('New expanded exercises state:', newState);
                                          return newState;
                                        });
                                      }}
                                      style={{ cursor: 'pointer' }}
                                      title="Klikk for å utvide/kollapse øvelsesdetaljer"
                                    >
                                      ▼
                                    </span>
                                  </div>
                                </div>
                                <div className="exercise-details">
                                  <span className="sets">{exercise.sets}</span>
                                  <span className="rest">Hvile: {exercise.rest}</span>
                                </div>
                                
                                {isExpanded && (
                                  <motion.div 
                                    className="exercise-expanded-content"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {exercise.description && (
                                      <div className="exercise-description">
                                        <strong>Hvordan utføre:</strong>
                                        <p>{exercise.description}</p>
                                      </div>
                                    )}
                                    
                                    {exercise.muscleGroups && (
                                      <div className="exercise-muscle-groups">
                                        <strong>Muskler som trenes:</strong>
                                        <div className="muscle-tags">
                                          {exercise.muscleGroups.map((muscle, muscleIndex) => (
                                            <span key={muscleIndex} className="muscle-tag">{muscle}</span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {exercise.benefits && (
                                      <div className="exercise-benefits">
                                        <strong>Fordeler:</strong>
                                        <p>{exercise.benefits}</p>
                                      </div>
                                    )}
                                    
                                    {exercise.tips && (
                                      <div className="exercise-tips">
                                        <strong>Tips:</strong> {exercise.tips}
                                      </div>
                                    )}
                                    
                                    {exercise.alternatives && (
                                      <div className="exercise-alternatives">
                                        <strong>🔄 Alternativer:</strong> {exercise.alternatives}
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="rest-day-content">
                            <div className="rest-day-icon">Hvile</div>
                            <div className="rest-day-description">
                              {workout.description || "Dette er en hviledag. Fokuser på hvile, gjenoppretting og næring. Du kan gjøre lett stretching eller gå en rolig tur, men unngå intens trening."}
                            </div>
                            <div className="rest-day-tips">
                              <h4>Hviledagstips:</h4>
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
