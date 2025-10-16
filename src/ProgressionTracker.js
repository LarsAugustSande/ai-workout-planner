import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaPlus, FaEdit, FaTrash, FaWeight, FaDumbbell, FaCalendarAlt } from 'react-icons/fa';
import './ProgressionTracker.css';

const ProgressionTracker = ({ onBack }) => {
  const [workouts, setWorkouts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exerciseData, setExerciseData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    reps: '',
    sets: '',
    notes: ''
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedWorkouts = localStorage.getItem('workoutProgress');
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts));
    }
  }, []);

  // Save data to localStorage whenever workouts change
  useEffect(() => {
    localStorage.setItem('workoutProgress', JSON.stringify(workouts));
  }, [workouts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExerciseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddWorkout = () => {
    if (!selectedExercise || !exerciseData.weight || !exerciseData.reps || !exerciseData.sets) {
      alert('Vennligst fyll ut alle obligatoriske felter (øvelse, vekt, repetisjoner, sett)');
      return;
    }

    const newWorkout = {
      id: Date.now(),
      exercise: selectedExercise,
      ...exerciseData,
      date: new Date(exerciseData.date).toLocaleDateString('nb-NO')
    };

    setWorkouts(prev => [...prev, newWorkout].sort((a, b) => new Date(b.date) - new Date(a.date)));
    setExerciseData({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      reps: '',
      sets: '',
      notes: ''
    });
    setSelectedExercise('');
    setShowAddForm(false);
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setSelectedExercise(workout.exercise);
    setExerciseData({
      date: new Date(workout.date).toISOString().split('T')[0],
      weight: workout.weight,
      reps: workout.reps,
      sets: workout.sets,
      notes: workout.notes || ''
    });
    setShowAddForm(true);
  };

  const handleUpdateWorkout = () => {
    if (!selectedExercise || !exerciseData.weight || !exerciseData.reps || !exerciseData.sets) {
      alert('Vennligst fyll ut alle obligatoriske felter (øvelse, vekt, repetisjoner, sett)');
      return;
    }

    setWorkouts(prev => prev.map(workout => 
      workout.id === editingWorkout.id 
        ? {
            ...workout,
            exercise: selectedExercise,
            ...exerciseData,
            date: new Date(exerciseData.date).toLocaleDateString('nb-NO')
          }
        : workout
    ));
    
    setExerciseData({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      reps: '',
      sets: '',
      notes: ''
    });
    setSelectedExercise('');
    setEditingWorkout(null);
    setShowAddForm(false);
  };

  const handleDeleteWorkout = (id) => {
    const workout = workouts.find(w => w.id === id);
    if (window.confirm(`Er du sikker på at du vil slette treningsøkten for ${workout?.exercise || 'denne øvelsen'}?`)) {
      setWorkouts(prev => prev.filter(workout => workout.id !== id));
    }
  };

  const getExerciseProgress = (exerciseName) => {
    const exerciseWorkouts = workouts
      .filter(workout => workout.exercise === exerciseName)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return exerciseWorkouts;
  };

  const getUniqueExercises = () => {
    return [...new Set(workouts.map(workout => workout.exercise))];
  };

  const calculateOneRepMax = (weight, reps) => {
    // Epley formula: 1RM = weight * (1 + reps/30)
    if (!weight || !reps || weight <= 0 || reps <= 0) return 0;
    return Math.round(weight * (1 + reps / 30));
  };

  const getTotalVolume = (workouts) => {
    return workouts.reduce((total, workout) => {
      const volume = parseFloat(workout.weight) * parseInt(workout.reps) * parseInt(workout.sets);
      return total + (isNaN(volume) ? 0 : volume);
    }, 0);
  };

  return (
    <div className="progression-tracker">
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
            <p className="subtitle">Progresjonssporing - Følg din treningsreise og se konkrete resultater over tid med detaljert statistikk og fremgangsanalyse</p>
          </motion.div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="header-actions">
            <motion.button
              className="add-workout-btn"
              onClick={() => setShowAddForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus />
              Legg til økt
            </motion.button>
            {onBack && (
              <motion.button
                className="back-btn"
                onClick={onBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDumbbell />
                Tilbake til Treningsplan
              </motion.button>
            )}
          </div>
        {showAddForm && (
          <motion.div 
            className="add-workout-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3>{editingWorkout ? 'Rediger treningsøkt' : 'Legg til treningsøkt'}</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Øvelse</label>
                <input
                  type="text"
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  placeholder="F.eks. Benkpress, Knebøy..."
                  className="exercise-input"
                />
              </div>
              <div className="form-group">
                <label>Dato</label>
                <input
                  type="date"
                  name="date"
                  value={exerciseData.date}
                  onChange={handleInputChange}
                  className="date-input"
                />
              </div>
              <div className="form-group">
                <label>Vekt (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={exerciseData.weight}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="weight-input"
                />
              </div>
              <div className="form-group">
                <label>Repetisjoner</label>
                <input
                  type="number"
                  name="reps"
                  value={exerciseData.reps}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="reps-input"
                />
              </div>
              <div className="form-group">
                <label>Antall sett</label>
                <input
                  type="number"
                  name="sets"
                  value={exerciseData.sets}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="sets-input"
                />
              </div>
              <div className="form-group full-width">
                <label>Notater (valgfritt)</label>
                <textarea
                  name="notes"
                  value={exerciseData.notes}
                  onChange={handleInputChange}
                  placeholder="Hvordan føltes øvelsen? Spesielle observasjoner..."
                  rows="3"
                  className="notes-input"
                />
              </div>
            </div>
            <div className="form-actions">
              <motion.button
                className="cancel-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingWorkout(null);
                  setSelectedExercise('');
                  setExerciseData({
                    date: new Date().toISOString().split('T')[0],
                    weight: '',
                    reps: '',
                    sets: '',
                    notes: ''
                  });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Avbryt
              </motion.button>
              <motion.button
                className="save-btn"
                onClick={editingWorkout ? handleUpdateWorkout : handleAddWorkout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {editingWorkout ? 'Oppdater' : 'Lagre økt'}
              </motion.button>
            </div>
          </motion.div>
        )}

        <div className="progression-content">
          {workouts.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FaChartLine className="empty-icon" />
              <h3>Ingen treningsøkter registrert ennå</h3>
              <p>Start med å legge til din første treningsøkt for å begynne å tracke fremgangen din.</p>
              <motion.button
                className="start-tracking-btn"
                onClick={() => setShowAddForm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus />
                Legg til første økt
              </motion.button>
            </motion.div>
          ) : (
            <>
              <div className="stats-overview">
                <div className="stat-card">
                  <FaWeight className="stat-icon" />
                  <div className="stat-content">
                    <h3>{workouts.length}</h3>
                    <p>Totalt antall økter</p>
                  </div>
                </div>
                <div className="stat-card">
                  <FaDumbbell className="stat-icon" />
                  <div className="stat-content">
                    <h3>{getUniqueExercises().length}</h3>
                    <p>Forskjellige øvelser</p>
                  </div>
                </div>
                <div className="stat-card">
                  <FaCalendarAlt className="stat-icon" />
                  <div className="stat-content">
                    <h3>{workouts.length > 0 ? Math.ceil((new Date() - new Date(workouts[workouts.length - 1].date)) / (1000 * 60 * 60 * 24)) : 0}</h3>
                    <p>Dager siden siste økt</p>
                  </div>
                </div>
                <div className="stat-card">
                  <FaChartLine className="stat-icon" />
                  <div className="stat-content">
                    <h3>{getTotalVolume(workouts).toLocaleString()}</h3>
                    <p>Total treningsvolum (kg)</p>
                  </div>
                </div>
              </div>

              <div className="workout-history">
                <h2>Treninghistorikk</h2>
                <div className="workout-list">
                  {workouts.map((workout) => (
                    <motion.div
                      key={workout.id}
                      className="workout-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="workout-info">
                        <h4>{workout.exercise}</h4>
                        <p className="workout-date">{workout.date}</p>
                        <div className="workout-stats">
                          <span className="stat">
                            <FaWeight /> {workout.weight}kg
                          </span>
                          <span className="stat">
                            <FaDumbbell /> {workout.sets}x{workout.reps}
                          </span>
                          <span className="stat">
                            Volum: {(parseFloat(workout.weight) * parseInt(workout.reps) * parseInt(workout.sets)).toLocaleString()}kg
                          </span>
                          <span className="stat">
                            1RM: {calculateOneRepMax(parseFloat(workout.weight), parseInt(workout.reps))}kg
                          </span>
                        </div>
                        {workout.notes && (
                          <p className="workout-notes">{workout.notes}</p>
                        )}
                      </div>
                      <div className="workout-actions">
                        <motion.button
                          className="edit-btn"
                          onClick={() => handleEditWorkout(workout)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          className="delete-btn"
                          onClick={() => handleDeleteWorkout(workout.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {getUniqueExercises().length > 0 && (
                <div className="exercise-progress">
                  <h2>Øvelsesprogresjon</h2>
                  {getUniqueExercises().map((exercise) => {
                    const progress = getExerciseProgress(exercise);
                    const firstWorkout = progress[0];
                    const lastWorkout = progress[progress.length - 1];
                    const improvement = lastWorkout && firstWorkout ? 
                      calculateOneRepMax(parseFloat(lastWorkout.weight), parseInt(lastWorkout.reps)) - 
                      calculateOneRepMax(parseFloat(firstWorkout.weight), parseInt(firstWorkout.reps)) : 0;

                    return (
                      <motion.div
                        key={exercise}
                        className="exercise-progress-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <h3>{exercise}</h3>
                        <div className="progress-stats">
                          <div className="progress-stat">
                            <span className="label">Første 1RM:</span>
                            <span className="value">{firstWorkout ? calculateOneRepMax(parseFloat(firstWorkout.weight), parseInt(firstWorkout.reps)) : 0}kg</span>
                          </div>
                          <div className="progress-stat">
                            <span className="label">Siste 1RM:</span>
                            <span className="value">{lastWorkout ? calculateOneRepMax(parseFloat(lastWorkout.weight), parseInt(lastWorkout.reps)) : 0}kg</span>
                          </div>
                          <div className="progress-stat">
                            <span className="label">Forbedring:</span>
                            <span className={`value ${improvement > 0 ? 'positive' : improvement < 0 ? 'negative' : 'neutral'}`}>
                              {improvement > 0 ? '+' : ''}{improvement}kg
                            </span>
                          </div>
                          <div className="progress-stat">
                            <span className="label">Antall økter:</span>
                            <span className="value">{progress.length}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressionTracker;
