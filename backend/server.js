const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Workout Planner Backend is running' });
});

// Generate workout plan endpoint
app.post('/api/generate-workout', async (req, res) => {
  try {
    const { age, weight, height, fitnessLevel, goals, availableTime, equipment, injuries, workoutSplit, trainingDays, sportSpecific } = req.body;

    // Injury-specific exercise restrictions and alternatives
    const injuryRestrictions = {
      'knekt ben': {
        avoid: ['knebøy', 'lunge', 'squat', 'jumping jacks', 'box jumps', 'step-ups', 'leg press', 'bulgarian split squat'],
        alternatives: ['seated leg extensions', 'leg curls', 'hip thrusts', 'glute bridges', 'upper body exercises', 'core exercises', 'seated cardio'],
        focus: 'Øverkropp, core og øvelser som ikke belaster benet'
      },
      'ryggproblemer': {
        avoid: ['deadlift', 'bent-over row', 'good morning', 'hyperextensions', 'overhead press'],
        alternatives: ['seated rows', 'lat pulldowns', 'chest supported rows', 'wall slides', 'bird dog', 'cat-cow'],
        focus: 'Stabiliserende øvelser og nøytral ryggposisjon'
      },
      'skulderproblemer': {
        avoid: ['overhead press', 'lateral raises', 'upright rows', 'behind neck pulldowns'],
        alternatives: ['front raises', 'internal/external rotation', 'band pull-aparts', 'face pulls', 'scapular wall slides'],
        focus: 'Rotator cuff styrke og skulderstabilitet'
      }
    };

    // Workout split templates - adaptive based on training days
    const getAdditionalExercises = (workoutDay, count, equipment, fitnessLevel) => {
  const exercises = [];
  const dayLower = workoutDay.toLowerCase();
  
  // Exercise pools based on workout type
  const pushExercises = [
    { name: "Incline Push-ups", sets: "3 x 10-12", rest: "45 sekunder", tips: "Plasser hendene på en forhøyet overflate for å redusere vanskelighetsgraden.", alternatives: "Regular push-ups", equipment: "Benk eller stol" },
    { name: "Pike Push-ups", sets: "3 x 8-10", rest: "60 sekunder", tips: "Start i downward dog-posisjon og press opp og ned.", alternatives: "Shoulder press", equipment: "Kroppsvekt" },
    { name: "Diamond Push-ups", sets: "3 x 6-8", rest: "60 sekunder", tips: "Plasser hendene i diamantform for å fokusere på triceps.", alternatives: "Close-grip push-ups", equipment: "Kroppsvekt" },
    { name: "Lateral Raises", sets: "3 x 12-15", rest: "45 sekunder", tips: "Løft armene ut til siden til skulderhøyde.", alternatives: "Front raises", equipment: "Hantler eller vannflasker" }
  ];
  
  const pullExercises = [
    { name: "Inverted Rows", sets: "3 x 8-12", rest: "60 sekunder", tips: "Ligg under et bord og trekk deg opp.", alternatives: "Bent-over rows", equipment: "Bord eller stang" },
    { name: "Reverse Flyes", sets: "3 x 12-15", rest: "45 sekunder", tips: "Bøy deg fremover og løft armene ut til siden.", alternatives: "Face pulls", equipment: "Hantler eller strikk" },
    { name: "Hammer Curls", sets: "3 x 10-12", rest: "45 sekunder", tips: "Hold hantlene med nøytral grep og curl opp.", alternatives: "Regular curls", equipment: "Hantler eller vannflasker" },
    { name: "Superman", sets: "3 x 15-20", rest: "30 sekunder", tips: "Ligg på magen og løft bryst og ben samtidig.", alternatives: "Back extensions", equipment: "Kroppsvekt" }
  ];
  
  const legExercises = [
    { name: "Lunges", sets: "3 x 10-12 per bein", rest: "45 sekunder", tips: "Ta et stort steg fremover og senk bakre kne mot bakken.", alternatives: "Split squats", equipment: "Kroppsvekt" },
    { name: "Calf Raises", sets: "3 x 15-20", rest: "30 sekunder", tips: "Stå på tærne og løft hælene så høyt som mulig.", alternatives: "Single-leg calf raises", equipment: "Kroppsvekt" },
    { name: "Wall Sit", sets: "3 x 30-60 sek", rest: "60 sekunder", tips: "Sitt mot veggen med knærne i 90 grader.", alternatives: "Squats", equipment: "Vegg" },
    { name: "Single-leg Glute Bridge", sets: "3 x 10-12 per bein", rest: "45 sekunder", tips: "Løft ett ben og press hoftene opp med det andre.", alternatives: "Regular glute bridge", equipment: "Kroppsvekt" }
  ];
  
  const coreExercises = [
    { name: "Plank", sets: "3 x 30-60 sek", rest: "45 sekunder", tips: "Hold kroppen rett fra hode til hæl.", alternatives: "Knee plank", equipment: "Kroppsvekt" },
    { name: "Mountain Climbers", sets: "3 x 20-30", rest: "45 sekunder", tips: "Veksle mellom å trekke knærne mot brystet i plank-posisjon.", alternatives: "High knees", equipment: "Kroppsvekt" },
    { name: "Dead Bug", sets: "3 x 10-12 per side", rest: "30 sekunder", tips: "Ligg på ryggen og veksle mellom å strekke motsatte arm og ben.", alternatives: "Bird dog", equipment: "Kroppsvekt" }
  ];
  
  let pool = [];
  if (dayLower.includes('push') || dayLower.includes('bryst') || dayLower.includes('skuldre')) {
    pool = [...pushExercises, ...coreExercises];
  } else if (dayLower.includes('pull') || dayLower.includes('rygg') || dayLower.includes('biceps')) {
    pool = [...pullExercises, ...coreExercises];
  } else if (dayLower.includes('leg') || dayLower.includes('ben') || dayLower.includes('lower')) {
    pool = [...legExercises, ...coreExercises];
  } else if (dayLower.includes('upper') || dayLower.includes('øver')) {
    pool = [...pushExercises, ...pullExercises, ...coreExercises];
  } else {
    // Full body or unknown - use all exercises
    pool = [...pushExercises, ...pullExercises, ...legExercises, ...coreExercises];
  }
  
  // Select random exercises from the pool
  const shuffled = pool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getSplitTemplate = (splitType, numDays) => {
      const baseTemplates = {
        'push_pull_legs': {
          name: 'Push/Pull/Legs',
          baseDays: ['Push (Bryst, Skuldre, Triceps)', 'Pull (Rygg, Biceps)', 'Legs (Ben, Glutes)'],
          description: 'Split som fokuserer på motstående muskelgrupper'
        },
        'upper_lower': {
          name: 'Upper/Lower',
          baseDays: ['Upper Body (Øverkropp)', 'Lower Body (Nedre kropp)'],
          description: 'Rotasjon mellom øverkropp og nedre kropp'
        },
        'full_body': {
          name: 'Full Body',
          baseDays: ['Full Body'],
          description: 'Komplett kroppstrening hver dag med varierte øvelser'
        },
        'bro_split': {
          name: 'Bro Split',
          baseDays: ['Chest (Bryst)', 'Back (Rygg)', 'Shoulders (Skuldre)', 'Arms (Armer)', 'Legs (Ben)'],
          description: 'Split med fokus på én muskelgruppe per dag'
        }
      };

      const template = baseTemplates[splitType] || baseTemplates['push_pull_legs'];
      let adaptedDays = [...template.baseDays];

      // Adapt based on number of training days
      if (numDays === 2) {
        if (splitType === 'push_pull_legs') {
          adaptedDays = ['Push (Bryst, Skuldre, Triceps)', 'Pull + Legs (Rygg, Biceps, Ben, Glutes)'];
        } else if (splitType === 'full_body') {
          adaptedDays = ['Full Body A', 'Full Body B'];
        }
      } else if (numDays === 3) {
        if (splitType === 'upper_lower') {
          adaptedDays = ['Upper Body', 'Lower Body', 'Upper Body'];
        } else if (splitType === 'full_body') {
          adaptedDays = ['Full Body A', 'Full Body B', 'Full Body C'];
        }
      } else if (numDays === 4) {
        if (splitType === 'push_pull_legs') {
          adaptedDays = ['Push', 'Pull', 'Legs', 'Push'];
        } else if (splitType === 'upper_lower') {
          adaptedDays = ['Upper Body', 'Lower Body', 'Upper Body', 'Lower Body'];
        } else if (splitType === 'full_body') {
          adaptedDays = ['Full Body A', 'Full Body B', 'Full Body C', 'Full Body D'];
        }
      } else if (numDays === 5) {
        if (splitType === 'push_pull_legs') {
          adaptedDays = ['Push', 'Pull', 'Legs', 'Push', 'Pull'];
        } else if (splitType === 'upper_lower') {
          adaptedDays = ['Upper Body', 'Lower Body', 'Upper Body', 'Lower Body', 'Upper Body'];
        } else if (splitType === 'full_body') {
          adaptedDays = ['Full Body A', 'Full Body B', 'Full Body C', 'Full Body D', 'Full Body E'];
        }
      } else if (numDays === 6) {
        if (splitType === 'push_pull_legs') {
          adaptedDays = ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs'];
        } else if (splitType === 'upper_lower') {
          adaptedDays = ['Upper Body', 'Lower Body', 'Upper Body', 'Lower Body', 'Upper Body', 'Lower Body'];
        } else if (splitType === 'full_body') {
          adaptedDays = ['Full Body A', 'Full Body B', 'Full Body C', 'Full Body D', 'Full Body E', 'Full Body F'];
        } else if (splitType === 'bro_split') {
          adaptedDays = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Chest'];
        }
      }

      return {
        name: template.name,
        days: adaptedDays,
        description: `${template.description} (${numDays} dager per uke)`
      };
    };

    const selectedSplit = getSplitTemplate(workoutSplit, parseInt(trainingDays));
    
    // Build injury-specific restrictions
    let injuryGuidance = '';
    if (injuries && injuries.toLowerCase()) {
      const injuryKey = Object.keys(injuryRestrictions).find(key => 
        injuries.toLowerCase().includes(key)
      );
      
      if (injuryKey) {
        const restriction = injuryRestrictions[injuryKey];
        injuryGuidance = `
        KRITISK SKADEHÅNDTERING:
        - UNNGÅ absolutt disse øvelsene: ${restriction.avoid.join(', ')}
        - Bruk i stedet: ${restriction.alternatives.join(', ')}
        - Fokus: ${restriction.focus}
        - Konsulter alltid lege/fysioterapeut før trening
        - Start med lave vekter og fokus på form
        - Stopp umiddelbart ved smerter
        `;
      }
    }

    const requiredExercises = availableTime <= 30 ? '4-5' : availableTime <= 60 ? '5-6' : availableTime <= 90 ? '6-7' : '7-8';
    
    // Build sport-specific guidance
    let sportGuidance = '';
    if (goals === 'sport' && sportSpecific) {
      sportGuidance = `
SPORTSPESIFIKK TRENING:
- Idrett: ${sportSpecific}
- Fokus på øvelser som forbedrer ytelse i ${sportSpecific}
- Inkluder funksjonelle bevegelser som etterligner sportens krav
- Tilpass styrke, utholdenhet, eksplosivitet og koordinasjon til sportens behov
- Vurder sportspesifikke muskelgrupper og bevegelsesmønstre
- Inkluder plyometriske og agilitetsøvelser hvis relevant for sporten
- Fokuser på core-stabilitet og funksjonell styrke
`;
    }

    const prompt = `Lag en treningsplan for:
    - Person: ${age}år, ${weight}kg, ${height}cm, ${fitnessLevel} nivå
    - Mål: ${goals === 'sport' ? `Sportspesifikk trening (${sportSpecific})` : goals}
    - Tid: ${availableTime} minutter per økt
    - Split: ${selectedSplit.name} (${trainingDays} dager/uke)
    - Utstyr: ${equipment}
    - Skader: ${injuries || 'Ingen'}
    
    ${injuryGuidance}
    ${sportGuidance}
    
    KRITISK: 
    - Du skal lage nøyaktig ${trainingDays} TRENINGSDAGER (ikke hviledager)
    - Hver TRENINGSDAG må ha MINST ${requiredExercises} øvelser for å fylle ${availableTime} minutter
    - IKKE legg til hviledager i treningsplanen
    - Alle ${trainingDays} dager skal være aktive treningsdager med øvelser
    
    For hver TRENINGSDAG, inkluder:
    - Hovedøvelse 1 (sammensatt øvelse)
    - Hovedøvelse 2 (sammensatt øvelse) 
    - Støtteøvelse 1 (isolasjon)
    - Støtteøvelse 2 (isolasjon)
    - Støtteøvelse 3 (isolasjon)
    ${availableTime > 60 ? '- Ekstra øvelse 1\n    - Ekstra øvelse 2' : ''}
    ${availableTime > 90 ? '- Ekstra øvelse 3' : ''}
    
    For HVILEDAGER, inkluder:
    - Kun en beskrivelse av hvile og gjenoppretting
    - Ingen øvelser eller exercises-array
    
    Dette gir totalt ${requiredExercises} øvelser per TRENINGSDAG som er perfekt for ${availableTime} minutter.
    
    VIKTIG: Returner KUN gyldig JSON uten kommentarer eller ekstra tekst.
    
    JSON-struktur:
    {
      "title": "Personlig ${selectedSplit.name} Treningsplan",
      "description": "Detaljert beskrivelse av planen og split-strukturen",
      "splitType": "${selectedSplit.name}",
      "workouts": [
        {
          "day": "Dag 1: ${selectedSplit.days[0]}",
          "focus": "Hovedfokus for denne dagen",
          "exercises": [
            {"name": "Øvelse 1", "sets": "3x8-12", "rest": "60s", "tips": "Tekniske tips", "alternatives": "Alternativer", "equipment": "Utstyr"},
            {"name": "Øvelse 2", "sets": "3x8-12", "rest": "60s", "tips": "Tekniske tips", "alternatives": "Alternativer", "equipment": "Utstyr"},
            {"name": "Øvelse 3", "sets": "3x8-12", "rest": "60s", "tips": "Tekniske tips", "alternatives": "Alternativer", "equipment": "Utstyr"},
            {"name": "Øvelse 4", "sets": "3x8-12", "rest": "60s", "tips": "Tekniske tips", "alternatives": "Alternativer", "equipment": "Utstyr"},
            {"name": "Øvelse 5", "sets": "3x8-12", "rest": "60s", "tips": "Tekniske tips", "alternatives": "Alternativer", "equipment": "Utstyr"}
          ]
        }
      ],
      "progression": "Hvordan øke vekt/intensitet over tid",
      "safety": "Viktige sikkerhetstips spesifikt for denne personen"
    }
    
    OBLIGATORISK: 
    - Inkluder nøyaktig ${trainingDays} treningsdager (ingen hviledager)
    - Hver treningsdag skal ha nøyaktig ${requiredExercises} øvelser
    - Returner KUN gyldig JSON
    - Ingen kommentarer eller ekstra tekst
    - Fullfør alle ${trainingDays} treningsdager i workouts-arrayet`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Du er en ekspert treningsinstruktør og fysioterapeut med 15+ års erfaring. Du lager personlige, sikre og effektive treningsplaner basert på brukerens behov og forutsetninger.

VIKTIGE PRINSIPPER:
1. SIKKERHET FØRST - Unngå øvelser som kan forverre skader
2. KONKRETE ØVELSER - Gi spesifikke øvelsesnavn, ikke generiske beskrivelser
3. DETALJERTE INSTRUKSJONER - Forklar nøyaktig hvordan hver øvelse utføres
4. PROGRESJON - Inkluder hvordan man øker vekt/intensitet over tid
5. ALTERNATIVER - Gi alternative øvelser for forskjellige utstyr/skader
6. PERSONLIG TILPASSING - Tilpass til alder, fitnessnivå og mål
7. SPORTSPESIFIKK TRENING - Hvis mål er sportspesifikk:
   - Fokuser på funksjonelle bevegelser som forbedrer sportens ytelse
   - Inkluder øvelser som etterligner sportens krav
   - Tilpass styrke, utholdenhet, eksplosivitet og koordinasjon
   - Vurder sportspesifikke muskelgrupper og bevegelsesmønstre
   - Inkluder plyometriske og agilitetsøvelser når relevant
   - Fokuser på core-stabilitet og funksjonell styrke
8. ANTALL ØVELSER - Dette er KRITISK! Inkluder alltid riktig antall øvelser basert på treningslengde:
   - 15-30 min: 4-5 øvelser (ALDRI 3!)
   - 30-60 min: 5-6 øvelser (ALDRI 3!)
   - 60-90 min: 6-7 øvelser (ALDRI 3!)
   - 90+ min: 7-8 øvelser (ALDRI 3!)
   
   Hvis du gir 3 øvelser per dag, har du feilet. Du MÅ gi det riktige antallet!

9. JSON FORMAT - KRITISK! Returner KUN gyldig JSON:
   - Ingen kommentarer (// eller /* */)
   - Ingen ekstra tekst før eller etter JSON
   - Fullfør alle treningsdager i workouts-arrayet
   - Gyldig JSON-syntaks

Svar alltid på norsk med profesjonell, men forståelig tone.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    const rawResponse = completion.choices[0].message.content;
    console.log('Raw OpenAI response:', rawResponse);
    
    let response;
    let cleanedResponse = '';
    try {
      // Clean the response to remove any comments or extra text
      cleanedResponse = rawResponse.trim();
      
      // Remove any text before the first { and after the last }
      const firstBrace = cleanedResponse.indexOf('{');
      const lastBrace = cleanedResponse.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanedResponse = cleanedResponse.substring(firstBrace, lastBrace + 1);
      }
      
      // Remove any comments (// ... or /* ... */)
      cleanedResponse = cleanedResponse.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      
      response = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response that failed to parse:', rawResponse);
      console.error('Cleaned response:', cleanedResponse);
      throw new Error(`JSON parsing failed: ${parseError.message}. Raw response: ${rawResponse.substring(0, 200)}...`);
    }
    
    // Post-process to ensure correct number of exercises
    const targetExercises = availableTime <= 30 ? 4 : availableTime <= 60 ? 5 : availableTime <= 90 ? 6 : 7;
    console.log(`Post-processing: availableTime=${availableTime}, targetExercises=${targetExercises}`);
    
    if (response.workouts) {
      console.log(`Found ${response.workouts.length} workouts to process`);
      response.workouts.forEach((workout, dayIndex) => {
        const currentCount = workout.exercises ? workout.exercises.length : 0;
        console.log(`Workout ${dayIndex}: ${workout.day} has ${currentCount} exercises (need ${targetExercises})`);
        
        if (workout.exercises && workout.exercises.length < targetExercises) {
          const needed = targetExercises - currentCount;
          console.log(`Adding ${needed} exercises to ${workout.day}`);
          
          // Add additional exercises based on the workout type
          const additionalExercises = getAdditionalExercises(workout.day, needed, equipment, fitnessLevel);
          workout.exercises.push(...additionalExercises);
          
          console.log(`Added ${needed} exercises to ${workout.day} (was ${currentCount}, now ${workout.exercises.length})`);
        } else {
          console.log(`${workout.day} already has enough exercises (${currentCount})`);
        }
      });
    } else {
      console.log('No workouts found in response');
    }
    
    res.json({ success: true, workoutPlan: response });

  } catch (error) {
    console.error('Error generating workout plan:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check if it's a JSON parsing error
    if (error.message.includes('JSON')) {
      console.error('JSON parsing failed. Raw response:', error.rawResponse || 'No raw response available');
    }
    
    res.status(500).json({ 
      success: false, 
      error: `Kunne ikke generere treningsplan: ${error.message}` 
    });
  }
});

// Motion analysis feedback endpoint
app.post('/api/motion-feedback', async (req, res) => {
  try {
    const { 
      exercise, 
      angles, 
      formScore, 
      repCount, 
      currentFeedback,
      exerciseHistory 
    } = req.body;

    const prompt = `Du er en personlig treningsinstruktør som analyserer bevegelser i sanntid. 
    
    Øvelse: ${exercise}
    Form Score: ${formScore}/100
    Repetisjoner: ${repCount}
    Målte vinkler: ${JSON.stringify(angles)}
    Nåværende feedback: ${currentFeedback.join(', ') || 'Ingen'}
    
    Gi spesifikk, konstruktiv feedback på norsk som hjelper brukeren å forbedre formen:
    - Hva gjør de riktig?
    - Hva kan forbedres?
    - Spesifikke justeringer (f.eks. "løft albuene 5 grader")
    - Sikkerhetstips
    - Motivasjon
    
    Returner som JSON:
    {
      "feedback": ["Feedback punkt 1", "Feedback punkt 2"],
      "score": ${formScore},
      "suggestions": ["Forslag 1", "Forslag 2"],
      "motivation": "Motiverende melding"
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Du er en ekspert på bevegelsesanalyse og treningsform med spesialisering i biomekanikk og skadeprevensjon. 

VIKTIGE PRINSIPPER:
1. KONSTRUKTIV FEEDBACK - Fokuser på hva som kan forbedres, ikke bare feil
2. SPESIFIKKE JUSTERINGER - Gi konkrete, målbare forbedringer
3. SIKKERHET - Prioriter riktig form over antall reps
4. MOTIVASJON - Inkluder positive kommentarer og oppmuntring
5. PROGRESJON - Foreslå neste steg i utviklingen

Gi konstruktiv, spesifikk feedback på norsk som hjelper brukeren å forbedre formen og unngå skader.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 600
    });

    const response = JSON.parse(completion.choices[0].message.content);
    res.json({ success: true, feedback: response });

  } catch (error) {
    console.error('Error generating motion feedback:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Kunne ikke generere feedback. Prøv igjen.' 
    });
  }
});

// Exercise analysis endpoint
app.post('/api/analyze-exercise', async (req, res) => {
  try {
    const { 
      exercise, 
      angles, 
      formScore, 
      repCount,
      duration 
    } = req.body;

    const prompt = `Analyser denne treningsøkten og gi en omfattende vurdering:
    
    Øvelse: ${exercise}
    Form Score: ${formScore}/100
    Repetisjoner: ${repCount}
    Varighet: ${duration} sekunder
    Vinkler: ${JSON.stringify(angles)}
    
    Gi en detaljert analyse som inkluderer:
    - Form vurdering
    - Styrke og svakheter
    - Forbedringsforslag
    - Progresjonstips
    - Sikkerhetsanbefalinger
    
    Returner som JSON:
    {
      "analysis": "Detaljert analyse av økten",
      "strengths": ["Styrke 1", "Styrke 2"],
      "weaknesses": ["Svakhet 1", "Svakhet 2"],
      "improvements": ["Forbedring 1", "Forbedring 2"],
      "nextSteps": "Anbefalinger for neste økt"
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Du er en ekspert på treningsanalyse og coaching. Gi detaljert, konstruktiv feedback på norsk som hjelper brukeren å utvikle seg."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 800
    });

    const response = JSON.parse(completion.choices[0].message.content);
    res.json({ success: true, analysis: response });

  } catch (error) {
    console.error('Error analyzing exercise:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Kunne ikke analysere øvelse. Prøv igjen.' 
    });
  }
});

// Generate meal plan endpoint
app.post('/api/generate-meal-plan', async (req, res) => {
  try {
    const { 
      age, 
      weight, 
      height, 
      gender, 
      activityLevel, 
      goals, 
      dietaryRestrictions, 
      allergies, 
      mealPreferences, 
      cookingTime, 
      budget 
    } = req.body;

    // Calculate BMR and TDEE
    const calculateBMR = (weight, height, age, gender) => {
      if (gender === 'male') {
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
    };

    const calculateTDEE = (bmr, activityLevel) => {
      const multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
      };
      return bmr * (multipliers[activityLevel] || 1.55);
    };

    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);

    // Adjust calories based on goals
    let targetCalories = tdee;
    if (goals === 'muscle_gain') {
      targetCalories = tdee + 300;
    } else if (goals === 'weight_loss') {
      targetCalories = tdee - 500;
    }

    // Calculate macros based on goals
    let proteinRatio, carbRatio, fatRatio;
    if (goals === 'muscle_gain') {
      proteinRatio = 0.25;
      carbRatio = 0.45;
      fatRatio = 0.30;
    } else if (goals === 'weight_loss') {
      proteinRatio = 0.30;
      carbRatio = 0.35;
      fatRatio = 0.35;
    } else if (goals === 'endurance') {
      proteinRatio = 0.20;
      carbRatio = 0.55;
      fatRatio = 0.25;
    } else {
      proteinRatio = 0.25;
      carbRatio = 0.45;
      fatRatio = 0.30;
    }

    const proteinGrams = Math.round((targetCalories * proteinRatio) / 4);
    const carbGrams = Math.round((targetCalories * carbRatio) / 4);
    const fatGrams = Math.round((targetCalories * fatRatio) / 9);

    const prompt = `Lag en personlig måltidsplan for:
    - Person: ${age}år, ${weight}kg, ${height}cm, ${gender === 'male' ? 'mann' : 'kvinne'}
    - Aktivitetsnivå: ${activityLevel}
    - Mål: ${goals}
    - Daglige kalorier: ${Math.round(targetCalories)}
    - Makronæringsstoffer: ${proteinGrams}g protein, ${carbGrams}g karbohydrater, ${fatGrams}g fett
    - Kostholdsrestriksjoner: ${dietaryRestrictions || 'Ingen'}
    - Allergier: ${allergies || 'Ingen'}
    - Måltidspreferanser: ${mealPreferences}
    - Koketid per dag: ${cookingTime} minutter
    - Budsjett: ${budget}
    
    VIKTIG: Lag en 7-dagers måltidsplan med VARIERTE måltider hver dag.
    
    Struktur per dag:
    - Frokost (2-3 alternativer)
    - Lunsj (2-3 alternativer) 
    - Middag (2-3 alternativer)
    - Snack (2-3 alternativer)
    
    Dette gir totalt 8-12 måltidsalternativer per dag for variasjon!
    
    For hvert måltid, inkluder:
    - Detaljerte ingredienser med mengder
    - Steg-for-steg fremgangsmåte
    - Forberedelsestid
    - Makronæringsstoffer per måltid
    - Tips for forberedelse og oppbevaring
    - Vanskelighetsgrad (lett/middels/avansert)
    
    Returner KUN gyldig JSON uten kommentarer eller ekstra tekst.
    
    JSON-struktur:
    {
      "title": "Personlig Måltidsplan for ${goals}",
      "description": "Detaljert beskrivelse av måltidsplanen og målene",
      "dailyCalories": ${Math.round(targetCalories)},
      "macros": {
        "protein": ${proteinGrams},
        "carbs": ${carbGrams},
        "fat": ${fatGrams}
      },
      "meals": [
        {
          "day": "Mandag",
          "meals": [
            {
              "type": "Frokost",
              "time": "07:00",
              "calories": 400,
              "macros": {"protein": 25, "carbs": 45, "fat": 15},
              "ingredients": ["Ingrediens 1", "Ingrediens 2"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "15 min",
              "difficulty": "lett"
            },
            {
              "type": "Frokost Alternativ",
              "time": "07:00",
              "calories": 380,
              "macros": {"protein": 22, "carbs": 48, "fat": 12},
              "ingredients": ["Ingrediens 1", "Ingrediens 2"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "10 min",
              "difficulty": "lett"
            }
          ]
        }
      ]
    }
    
    OBLIGATORISK: 
    - Inkluder 2-3 alternativer per måltidstype per dag
    - 7 dager med varierte måltider
    - Returner KUN gyldig JSON
    - Ingen kommentarer eller ekstra tekst
    - Fullfør alle 7 dager med alle måltidsalternativer`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Du er en ekspert ernæringsfysiolog og kostholdsplanlegger med 15+ års erfaring. Du lager personlige, balanserte og praktiske måltidsplaner basert på brukerens behov og forutsetninger.

VIKTIGE PRINSIPPER:
1. BALANSERT KOSTHOLD - Inkluder alle nødvendige næringsstoffer
2. PRAKTISK LAGING - Måltider som er enkle å lage med tilgjengelig utstyr
3. KOSTNADSEFFEKTIV - Bruk ingredienser som passer til budsjettet
4. ALLERGI-SIKKER - Unngå ingredienser som kan forårsake allergiske reaksjoner
5. SMAAKRIK - Varierte og smakfulle måltider
6. MEAL PREP VENNLIG - Måltider som kan forberedes på forhånd
7. NÆRINGSTETTHET - Optimal fordeling av makronæringsstoffer
8. PERSONLIG TILPASSING - Tilpass til alder, mål og preferanser

Svar alltid på norsk med profesjonell, men forståelig tone.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    const rawResponse = completion.choices[0].message.content;
    console.log('Raw OpenAI response:', rawResponse);
    
    let response;
    let cleanedResponse = '';
    try {
      // Clean the response to remove any comments or extra text
      cleanedResponse = rawResponse.trim();
      
      // Remove any text before the first { and after the last }
      const firstBrace = cleanedResponse.indexOf('{');
      const lastBrace = cleanedResponse.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanedResponse = cleanedResponse.substring(firstBrace, lastBrace + 1);
      }
      
      // Remove any comments (// ... or /* ... */)
      cleanedResponse = cleanedResponse.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      
      response = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response that failed to parse:', rawResponse);
      console.error('Cleaned response:', cleanedResponse);
      throw new Error(`JSON parsing failed: ${parseError.message}. Raw response: ${rawResponse.substring(0, 200)}...`);
    }
    
    res.json({ success: true, mealPlan: response });

  } catch (error) {
    console.error('Error generating meal plan:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      success: false, 
      error: `Kunne ikke generere måltidsplan: ${error.message}` 
    });
  }
});

// AI Split Selection endpoint
app.post('/api/recommend-split', async (req, res) => {
  try {
    const { age, weight, height, fitnessLevel, goals, availableTime, equipment, trainingDays, injuries, sportSpecific } = req.body;

    const prompt = `Basert på følgende brukerinformasjon, anbefal den beste treningssplit:

    Brukerinformasjon:
    - Alder: ${age} år
    - Vekt: ${weight} kg
    - Høyde: ${height} cm
    - Treningsnivå: ${fitnessLevel}
    - Mål: ${goals === 'sport' ? `Sportspesifikk trening (${sportSpecific})` : goals}
    - Tilgjengelig tid per økt: ${availableTime} minutter
    - Treningsdager per uke: ${trainingDays}
    - Utstyr: ${equipment}
    - Skader: ${injuries || 'Ingen'}
    ${goals === 'sport' && sportSpecific ? `- Idrett: ${sportSpecific}` : ''}

    Tilgjengelige splits:
    1. "full_body" - Fullkropp (alle muskelgrupper hver dag)
    2. "upper_lower" - Overkropp/Underkropp (2-dagers rotasjon)
    3. "push_pull_legs" - Push/Pull/Legs (3-dagers rotasjon)
    4. "bro_split" - Bro Split (én muskelgruppe per dag)

    Anbefal den beste split basert på:
    - Brukerens treningsnivå og erfaring
    - Antall treningsdager per uke
    - Tilgjengelig tid per økt
    - Personlige mål (styrke, muskelvekst, fettap, utholdenhet)
    - Utstyrstilgjengelighet
    - Skader eller begrensninger

    VIKTIG: Returner KUN gyldig JSON uten kommentarer eller ekstra tekst.

    JSON-struktur:
    {
      "recommendedSplit": "split_name",
      "reasoning": "Kort forklaring av hvorfor denne split er best for brukeren",
      "alternativeSplits": ["alternative1", "alternative2"],
      "tips": "Spesifikke tips for å få mest mulig ut av denne split"
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Du er en ekspert treningsinstruktør med 15+ års erfaring. Du anbefaler treningssplits basert på brukerens spesifikke behov og forutsetninger.

VIKTIGE PRINSIPPER:
1. PERSONLIG TILPASSING - Vurder brukerens alder, erfaring og mål
2. REALISTISK TILGANG - Vurder hvor mye tid og motivasjon brukeren har
3. SIKKERHET - Ta hensyn til skader og begrensninger
4. EFFEKTIVITET - Velg split som gir best resultater for brukerens mål
5. PROGRESJON - Vurder hvordan split passer til brukerens treningsnivå
6. SPORTSPESIFIKK - Hvis mål er sportspesifikk:
   - Vurder sportens krav til styrke, utholdenhet og koordinasjon
   - Velg split som tillater optimal gjenoppretting mellom treningsøkter
   - Fokuser på funksjonell styrke og bevegelsesmønstre
   - Vurder behovet for spesialisert trening (eksplosivitet, agilitet, etc.)

SPLIT-GUIDELINES:
- Nybegynnere: Fullkropp eller Upper/Lower
- Erfarne: Push/Pull/Legs eller Upper/Lower
- Avanserte: Bro Split eller Push/Pull/Legs
- 2-3 dager/uke: Fullkropp eller Upper/Lower
- 4-5 dager/uke: Upper/Lower eller Push/Pull/Legs
- 6+ dager/uke: Bro Split eller Push/Pull/Legs
- Sportspesifikk: Vurder sportens krav og optimal split for ytelse

KRITISK: Returner KUN gyldig JSON. Ingen kommentarer, ingen ekstra tekst, ingen forklaringer. Start direkte med { og slutt med }.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const rawResponse = completion.choices[0].message.content;
    console.log('Raw split recommendation response:', rawResponse);
    
    let response;
    try {
      // Clean the response to remove any comments or extra text
      let cleanedResponse = rawResponse.trim();
      
      // Find the first { and last } to extract JSON
      const firstBrace = cleanedResponse.indexOf('{');
      const lastBrace = cleanedResponse.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanedResponse = cleanedResponse.substring(firstBrace, lastBrace + 1);
      }
      
      response = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response that failed to parse:', rawResponse);
      throw new Error(`JSON parsing failed: ${parseError.message}. Raw response: ${rawResponse.substring(0, 200)}...`);
    }
    
    res.json({ success: true, recommendation: response });

  } catch (error) {
    console.error('Error recommending split:', error);
    res.status(500).json({ 
      success: false, 
      error: `Kunne ikke anbefale split: ${error.message}` 
    });
  }
});

// Edit workout plan endpoint
app.post('/api/edit-workout', async (req, res) => {
  try {
    const { currentPlan, suggestions, userGoals, availableTime } = req.body;

    const prompt = `Du skal oppdatere en eksisterende treningsplan basert på brukerens ønsker.

    Eksisterende treningsplan:
    ${JSON.stringify(currentPlan, null, 2)}
    
    Brukerens ønsker/endringer:
    ${suggestions}
    
    Brukerens mål og behov:
    ${userGoals}
    
    Treningslengde: ${availableTime} minutter
    Dette betyr at hver treningsdag skal ha ${availableTime <= 30 ? '4-5' : availableTime <= 60 ? '5-6' : availableTime <= 90 ? '6-7' : '7-8'} øvelser.
    
    Oppdater treningsplanen ved å:
    1. Implementere de foreslåtte endringene
    2. Beholde den generelle strukturen og kvaliteten
    3. Sørge for at alle endringer er logiske og sikre
    4. Justere andre øvelser hvis nødvendig for balanse
    5. Beholde nøyaktig ${availableTime <= 30 ? '4-5' : availableTime <= 60 ? '5-6' : availableTime <= 90 ? '6-7' : '7-8'} øvelser per dag
    
    VIKTIG: Returner KUN gyldig JSON uten kommentarer eller ekstra tekst. Start direkte med { og slutt med }.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Du er en ekspert treningsinstruktør som kan oppdatere og forbedre eksisterende treningsplaner. Du forstår brukerens behov og kan implementere endringer på en sikker og effektiv måte. 

VIKTIG: Behold alltid riktig antall øvelser per dag basert på treningslengde:
- 15-30 min: 4-5 øvelser
- 30-60 min: 5-6 øvelser  
- 60-90 min: 6-7 øvelser
- 90+ min: 7-8 øvelser

KRITISK: Du MÅ returnere KUN gyldig JSON. Ingen kommentarer, ingen ekstra tekst, ingen forklaringer. Start direkte med { og slutt med }. Dette er absolutt nødvendig for at systemet skal fungere.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    const rawResponse = completion.choices[0].message.content;
    console.log('Raw edit response:', rawResponse);
    
    let response;
    try {
      // Clean the response to remove any comments or extra text
      let cleanedResponse = rawResponse.trim();
      
      // Find the first { and last } to extract JSON
      const firstBrace = cleanedResponse.indexOf('{');
      const lastBrace = cleanedResponse.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanedResponse = cleanedResponse.substring(firstBrace, lastBrace + 1);
      }
      
      response = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response that failed to parse:', rawResponse);
      throw new Error(`JSON parsing failed: ${parseError.message}. Raw response: ${rawResponse.substring(0, 200)}...`);
    }
    
    res.json({ success: true, workoutPlan: response });

  } catch (error) {
    console.error('Error editing workout plan:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      success: false, 
      error: `Kunne ikke oppdatere treningsplan: ${error.message}` 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Workout Planner Backend kjører på port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
