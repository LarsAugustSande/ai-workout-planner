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
    const { age, weight, height, fitnessLevel, goals, availableTime, equipment, injuries, workoutSplit, trainingDays, sportSpecific, useAutoSplit } = req.body;

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
        },
        'cardio_focused': {
          name: 'Kardio + Styrke',
          baseDays: ['Løp + Core', 'Styrke Nedre Kropp', 'Løp + Øvre Kropp'],
          description: 'Kombinert løpetrening og styrke for utholdenhet'
        },
        'running_focused': {
          name: 'Løpefokusert',
          baseDays: ['Intervall Løp', 'Styrke Ben + Core', 'Hviledag', 'Lang Løp', 'Styrke Øvre Kropp'],
          description: 'Optimalisert for løpeytelse og styrke med hviledag'
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
        } else if (splitType === 'cardio_focused') {
          adaptedDays = ['Løp + Core', 'Styrke Nedre Kropp'];
        }
      } else if (numDays === 3) {
        if (splitType === 'upper_lower') {
          adaptedDays = ['Upper Body', 'Lower Body', 'Upper Body'];
        } else if (splitType === 'full_body') {
          adaptedDays = ['Full Body A', 'Full Body B', 'Full Body C'];
        } else if (splitType === 'cardio_focused') {
          adaptedDays = ['Løp + Core', 'Styrke Nedre Kropp', 'Løp + Øvre Kropp'];
        }
      } else if (numDays === 4) {
        if (splitType === 'push_pull_legs') {
          adaptedDays = ['Push', 'Pull', 'Legs', 'Push'];
        } else if (splitType === 'upper_lower') {
          adaptedDays = ['Upper Body', 'Lower Body', 'Upper Body', 'Lower Body'];
        } else if (splitType === 'full_body') {
          adaptedDays = ['Full Body A', 'Full Body B', 'Full Body C', 'Full Body D'];
        } else if (splitType === 'running_focused') {
          adaptedDays = ['Intervall Løp', 'Styrke Ben + Core', 'Hviledag', 'Lang Løp'];
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

    // Auto-select optimal split if useAutoSplit is true
    let finalWorkoutSplit = workoutSplit;
    let autoSplitReasoning = '';
    
    if (useAutoSplit) {
      const numDays = parseInt(trainingDays);
      const fitnessLevelNum = fitnessLevel === 'beginner' ? 1 : fitnessLevel === 'intermediate' ? 2 : 3;
      
      // Auto-select logic based on training days, fitness level, and goals
      // Check if goal is cardio/endurance/running focused first
      const isCardioGoal = goals === 'cardio' || goals === 'endurance' || 
                          (goals === 'sport' && sportSpecific && 
                           (sportSpecific.toLowerCase().includes('løp') || 
                            sportSpecific.toLowerCase().includes('running') ||
                            sportSpecific.toLowerCase().includes('maraton') ||
                            sportSpecific.toLowerCase().includes('5k') ||
                            sportSpecific.toLowerCase().includes('10k') ||
                            sportSpecific.toLowerCase().includes('halvmaraton')));
      
      if (isCardioGoal) {
        // Cardio/endurance focused splits
        if (numDays === 2) {
          finalWorkoutSplit = 'cardio_focused';
          autoSplitReasoning = 'Med 2 treningsdager og fokus på løping gir Kardio + Styrke optimal balanse mellom løpetrening og støttende styrke.';
        } else if (numDays === 3) {
          finalWorkoutSplit = 'cardio_focused';
          autoSplitReasoning = 'Med 3 treningsdager og fokus på løping gir Kardio + Styrke perfekt fordeling av løpevolum og styrke.';
        } else if (numDays === 4) {
          finalWorkoutSplit = 'running_focused';
          autoSplitReasoning = 'Med 4 treningsdager gir Løpefokusert split optimal struktur for både løpetrening og spesifikk styrke.';
        } else if (numDays >= 5) {
          finalWorkoutSplit = 'running_focused';
          autoSplitReasoning = 'Med 5+ treningsdager gir Løpefokusert split mulighet for omfattende løpetrening med spesifikk styrke.';
        }
      } else if (goals === 'weightLoss') {
        // Weight loss focused splits
        if (numDays === 2) {
          finalWorkoutSplit = 'full_body';
          autoSplitReasoning = 'Med 2 treningsdager og fokus på vekttap gir Full Body maksimal fettforbrenning per treningsøkt.';
        } else if (numDays === 3) {
          finalWorkoutSplit = 'full_body';
          autoSplitReasoning = 'Med 3 treningsdager og vekttap gir Full Body optimal balanse mellom styrke og kardiovaskulær trening.';
        } else if (numDays === 4) {
          finalWorkoutSplit = 'upper_lower';
          autoSplitReasoning = 'Med 4 treningsdager gir Upper/Lower split mulighet for både styrke og kardio for effektivt vekttap.';
        } else if (numDays >= 5) {
          finalWorkoutSplit = 'push_pull_legs';
          autoSplitReasoning = 'Med 5+ treningsdager gir Push/Pull/Legs mulighet for omfattende trening som maksimerer vekttap.';
        }
      } else if (goals === 'flexibility') {
        // Flexibility focused splits
        finalWorkoutSplit = 'full_body';
        autoSplitReasoning = 'Med fokus på fleksibilitet gir Full Body mulighet for omfattende mobilitetstrening hele kroppen.';
      } else {
        // Strength/muscle building focused splits
        if (numDays === 2) {
          finalWorkoutSplit = 'full_body';
          autoSplitReasoning = 'Med 2 treningsdager per uke er Full Body optimal for å trene alle muskelgrupper effektivt.';
        } else if (numDays === 3) {
          if (fitnessLevel === 'beginner') {
            finalWorkoutSplit = 'full_body';
            autoSplitReasoning = 'Som nybegynner med 3 treningsdager er Full Body best for å bygge grunnleggende styrke og teknikker.';
          } else {
            finalWorkoutSplit = 'push_pull_legs';
            autoSplitReasoning = 'Med 3 treningsdager og litt erfaring gir Push/Pull/Legs optimal muskelstimulering og hvile.';
          }
        } else if (numDays === 4) {
          finalWorkoutSplit = 'upper_lower';
          autoSplitReasoning = 'Med 4 treningsdager gir Upper/Lower split perfekt balanse mellom volum og gjenoppretting.';
        } else if (numDays >= 5) {
          if (goals === 'strength' || goals === 'muscle') {
            finalWorkoutSplit = 'push_pull_legs';
            autoSplitReasoning = 'Med 5+ treningsdager og fokus på styrke/muskel gir Push/Pull/Legs optimal hypertrofi.';
          } else {
            finalWorkoutSplit = 'bro_split';
            autoSplitReasoning = 'Med 5+ treningsdager gir Bro Split mulighet for høy frekvens per muskelgruppe.';
          }
        }
      }
    }

    const selectedSplit = getSplitTemplate(finalWorkoutSplit, parseInt(trainingDays));
    
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

    const prompt = `Lag treningsplan:
    ${age}år, ${weight}kg, ${height}cm, ${fitnessLevel}
    Mål: ${goals === 'sport' ? `${sportSpecific}` : goals}
    ${availableTime}min/økt, ${trainingDays} dager/uke
    Split: ${selectedSplit.name}${useAutoSplit ? ` (${autoSplitReasoning})` : ''}
    Utstyr: ${equipment}
    ${injuries ? `Skader: ${injuries}` : ''}
    
    ${injuryGuidance}
    ${sportGuidance}
    
    KRITISK: ${trainingDays} treningsdager.
    
    VIKTIG FOR LØPEDAGER:
    - Hvis treningsdag inneholder "Løp", "Intervall", "Tempo", "Lang" → Kun 1-2 øvelser (hovedfokus på løping)
    - Hvis treningsdag inneholder "Styrke" → ${requiredExercises} øvelser som vanlig
    - Løpedager skal ha korte, fokuserte øvelser som støtter løping
    
    VIKTIG FOR HVILEDAGER:
    - Hvis treningsdag inneholder "Hvile", "Rest", "Gjenoppretting" → INGEN øvelser i exercises-array
    - Hviledager skal kun ha beskrivelse av hvile og gjenoppretting
    - Ikke legg til styrkeøvelser på hviledager
    
    EKSEMPLER:
    - Løpedag: {"name": "Lang Løp 5km", "sets": "1x5km", "rest": "5min", "tips": "Hold jevn tempo", "alternatives": "Kortere distanse", "equipment": "Løpesko", "description": "Start med 5 min oppvarming i lett tempo. Hold jevn fart gjennom hele løpet. Slutt med 5 min nedkjøling.", "muscleGroups": ["Ben", "Core", "Hjertemuskel"], "benefits": "Forbedrer utholdenhet, kardiovaskulær helse og mental styrke"}
    - Styrkedag: {"name": "Knebøy", "sets": "3x8-12", "rest": "90s", "tips": "Dyb ned", "alternatives": "Goblet squat", "equipment": "Hantler", "description": "Stå med føttene skulderbredde fra hverandre. Senk deg ned ved å bøye knærne til lårene er parallelle med bakken. Press deg opp til startposisjon.", "muscleGroups": ["Quadriceps", "Glutes", "Hamstrings", "Core"], "benefits": "Bygger benstyrke, forbedrer funksjonell styrke og stabilitet"}
    - Hviledag: {"day": "Dag 4: Hviledag", "focus": "Hvile og gjenoppretting", "exercises": []}
    
    JSON:
    {
      "title": "${selectedSplit.name} Treningsplan",
      "description": "Kort beskrivelse",
      "splitType": "${selectedSplit.name}",
      "workouts": [
        {
          "day": "Dag 1: ${selectedSplit.days[0]}",
          "focus": "Hovedfokus",
          "exercises": [
            {"name": "Øvelse", "sets": "3x8-12", "rest": "60s", "tips": "Tips", "alternatives": "Alternativer", "equipment": "Utstyr", "description": "Detaljert beskrivelse av øvelsen", "muscleGroups": ["Muskelgruppe1", "Muskelgruppe2"], "benefits": "Fordeler med øvelsen"}
          ]
        }
      ],
      "progression": "Progresjon",
      "safety": "Sikkerhet"
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Raskere modell for bedre ytelse
      messages: [
        {
          role: "system",
          content: `Du er en ekspert treningsinstruktør. Lag personlige treningsplaner basert på brukerens behov.

VIKTIGE PRINSIPPER:
1. SIKKERHET FØRST - Unngå øvelser som kan forverre skader
2. KONKRETE ØVELSER - Gi spesifikke øvelsesnavn
3. PERSONLIG TILPASSING - Tilpass til alder, fitnessnivå og mål
4. SPORTSPESIFIKK TRENING - Hvis mål er sportspesifikk, fokuser på funksjonelle bevegelser
5. ANTALL ØVELSER - KRITISK! Inkluder riktig antall øvelser:
   - LØPEDAGER (inneholder "Løp", "Intervall", "Tempo", "Lang"): 1-2 øvelser
   - STYRKEDAGER: 15-30 min: 4-5 øvelser, 30-60 min: 5-6 øvelser, 60-90 min: 6-7 øvelser
   - HVILEDAGER (inneholder "Hvile", "Rest", "Gjenoppretting"): INGEN øvelser (tom array)
6. LØPETRENING - For løpedager: Fokuser på løping som hovedaktivitet, legg til 1-2 støtteøvelser
7. HVILEDAGER - For hviledager: Kun beskrivelse, ingen øvelser i exercises-array
8. DETALJERTE BESKRIVELSER - For hver øvelse, inkluder:
   - "description": Detaljert beskrivelse av hvordan øvelsen utføres
   - "muscleGroups": Hvilke muskelgrupper som trenes
   - "benefits": Fordeler med øvelsen
9. JSON FORMAT - KRITISK! Returner KUN gyldig JSON:
   - Ingen kommentarer (// eller /* */)
   - Ingen ekstra tekst før eller etter JSON
   - Alle nøkler må være i anførselstegn: "key"
   - Alle strenger må være i anførselstegn: "value"
   - Ingen trailing commas (komma før } eller ])
   - Fullfør alle treningsdager i workouts-arrayet
   - Gyldig JSON-syntaks

VIKTIG: Sjekk at JSON er gyldig før du sender svar!

Svar på norsk.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2, // Lavere temperatur for mer konsistente svar
      max_tokens: 2000 // Redusert for raskere respons
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
      
      // Fix common JSON issues
      cleanedResponse = cleanedResponse
        .replace(/,\s*}/g, '}')  // Remove trailing commas before }
        .replace(/,\s*]/g, ']')  // Remove trailing commas before ]
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":')  // Quote unquoted keys
        .replace(/:\s*([^",{\[\s][^,}\]\s]*)/g, ': "$1"')  // Quote unquoted string values
        .replace(/:\s*"([^"]*)"\s*([,}])/g, ': "$1"$2')  // Ensure proper string formatting
        .replace(/,\s*,/g, ',')  // Remove double commas
        .replace(/:\s*,\s*/g, ': null, ')  // Replace empty values with null
        .replace(/:\s*,\s*([}\]])/g, ': null$1')  // Replace trailing empty values
        .replace(/\n/g, ' ')  // Replace newlines with spaces
        .replace(/\s+/g, ' ')  // Normalize whitespace
        .replace(/,(\s*[}\]])/g, '$1');  // Remove trailing commas again
      
      console.log('Attempting to parse cleaned response...');
      console.log('Cleaned response preview:', cleanedResponse.substring(0, 500));
      response = JSON.parse(cleanedResponse);
      console.log('Successfully parsed JSON on first attempt!');
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response that failed to parse:', rawResponse);
      console.error('Cleaned response:', cleanedResponse);
      console.error('Parse error details:', parseError.message);
      
      // Try to fix the JSON by attempting a more aggressive cleanup
      try {
        console.log('Attempting aggressive JSON cleanup...');
        
        // Extract just the JSON part more aggressively
        let jsonStart = cleanedResponse.indexOf('{');
        let jsonEnd = cleanedResponse.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1) {
          let aggressiveCleanup = cleanedResponse.substring(jsonStart, jsonEnd + 1);
          
          // More aggressive fixes
          aggressiveCleanup = aggressiveCleanup
            .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
            .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')  // Quote keys
            .replace(/:\s*([^",{\[\s\n][^,}\]\s\n]*?)(\s*[,}\]])/g, ': "$1"$2')  // Quote values
            .replace(/\n/g, ' ')  // Replace newlines with spaces
            .replace(/\s+/g, ' ')  // Normalize whitespace
            .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas again
            .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')  // Quote keys again
            .replace(/:\s*([^",{\[\s][^,}\]\s]*?)(\s*[,}\]])/g, ': "$1"$2')  // Quote values again
            .replace(/,\s*,/g, ',')  // Remove double commas
            .replace(/:\s*,\s*/g, ': null, ')  // Replace empty values with null
            .replace(/:\s*,\s*([}\]])/g, ': null$1');  // Replace trailing empty values
          
          console.log('Aggressive cleanup result:', aggressiveCleanup.substring(0, 500));
          response = JSON.parse(aggressiveCleanup);
          console.log('Successfully parsed with aggressive cleanup!');
        } else {
          throw parseError;
        }
      } catch (secondError) {
        console.error('Aggressive cleanup also failed:', secondError);
        
        // Final fallback: try to extract and rebuild JSON manually
        try {
          console.log('Attempting manual JSON reconstruction...');
          
          // Extract key information manually
          const titleMatch = rawResponse.match(/"title"\s*:\s*"([^"]*)"/);
          const descriptionMatch = rawResponse.match(/"description"\s*:\s*"([^"]*)"/);
          const splitTypeMatch = rawResponse.match(/"splitType"\s*:\s*"([^"]*)"/);
          
          if (titleMatch && descriptionMatch && splitTypeMatch) {
            console.log('Found basic info, creating fallback JSON structure');
            
            // Generate correct number of workout days
            const numDays = parseInt(trainingDays) || 3;
            const workouts = [];
            
            // Get split template to generate proper workout days
            const splitTemplate = getSplitTemplate(finalWorkoutSplit, numDays);
            
            for (let i = 0; i < numDays; i++) {
              const dayName = splitTemplate.days[i] || `Dag ${i + 1}: Treningsøkt`;
              const targetExercises = availableTime <= 30 ? 4 : availableTime <= 60 ? 5 : availableTime <= 90 ? 6 : 7;
              
              // Generate exercises for this day
              const exercises = [];
              
              // Check if this is a running day
              const isRunningDay = dayName.toLowerCase().includes('løp') || 
                                  dayName.toLowerCase().includes('intervall') || 
                                  dayName.toLowerCase().includes('tempo') || 
                                  dayName.toLowerCase().includes('lang');
              
              // Check if this is a rest day
              const isRestDay = dayName.toLowerCase().includes('hvile') || 
                               dayName.toLowerCase().includes('rest') || 
                               dayName.toLowerCase().includes('gjenoppretting');
              
              if (isRestDay) {
                // Rest day - no exercises
                exercises.length = 0;
              } else if (isRunningDay) {
                // Running day - 1-2 exercises
                exercises.push(
                  {
                    name: "Lang Løp",
                    sets: "1x5km",
                    rest: "5 minutter",
                    tips: "Hold jevn tempo",
                    alternatives: "Kortere distanse",
                    equipment: "Løpesko",
                    description: "Start med 5 min oppvarming i lett tempo. Hold jevn fart gjennom hele løpet. Slutt med 5 min nedkjøling.",
                    muscleGroups: ["Ben", "Core", "Hjertemuskel"],
                    benefits: "Forbedrer utholdenhet, kardiovaskulær helse og mental styrke"
                  }
                );
              } else {
                // Strength day - full number of exercises
                const strengthExercises = [
                  {
                    name: "Push-ups",
                    sets: "3x8-12",
                    rest: "60s",
                    tips: "Hold kroppen rett",
                    alternatives: "Kne push-ups",
                    equipment: "Kropp",
                    description: "Start i plank-posisjon, senk kroppen til brystet nærmer seg bakken, press deg opp.",
                    muscleGroups: ["Bryst", "Triceps", "Core"],
                    benefits: "Bygger øvre kroppsstyrke og core-stabilitet"
                  },
                  {
                    name: "Knebøy",
                    sets: "3x8-12",
                    rest: "90s",
                    tips: "Dyb ned",
                    alternatives: "Goblet squat",
                    equipment: "Hantler",
                    description: "Stå med føttene skulderbredde fra hverandre. Senk deg ned ved å bøye knærne til lårene er parallelle med bakken. Press deg opp til startposisjon.",
                    muscleGroups: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
                    benefits: "Bygger benstyrke, forbedrer funksjonell styrke og stabilitet"
                  },
                  {
                    name: "Plank",
                    sets: "3x30-60s",
                    rest: "45s",
                    tips: "Hold kroppen rett",
                    alternatives: "Kne plank",
                    equipment: "Kropp",
                    description: "Start i push-up posisjon, støtt deg på underarmene. Hold kroppen rett fra hode til hæl.",
                    muscleGroups: ["Core", "Skuldre", "Glutes"],
                    benefits: "Styrker core, forbedrer stabilitet og holdning"
                  },
                  {
                    name: "Lunges",
                    sets: "3x10 per bein",
                    rest: "60s",
                    tips: "Store skritt",
                    alternatives: "Reverse lunges",
                    equipment: "Kropp",
                    description: "Ta et stort skritt fremover, senk bakkroppen til låret er parallelt med bakken. Press deg opp og bytt bein.",
                    muscleGroups: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
                    benefits: "Bygger benstyrke, forbedrer balanse og koordinasjon"
                  },
                  {
                    name: "Mountain Climbers",
                    sets: "3x20",
                    rest: "45s",
                    tips: "Hold core stram",
                    alternatives: "Slow mountain climbers",
                    equipment: "Kropp",
                    description: "Start i plank-posisjon, løft alternerende knær mot brystet i rask tempo.",
                    muscleGroups: ["Core", "Skuldre", "Ben"],
                    benefits: "Forbedrer kardiovaskulær kondisjon og core-styrke"
                  }
                ];
                
                // Add exercises up to target number
                for (let j = 0; j < Math.min(targetExercises, strengthExercises.length); j++) {
                  exercises.push(strengthExercises[j]);
                }
              }
              
              workouts.push({
                day: `Dag ${i + 1}: ${dayName}`,
                focus: isRestDay ? "Hvile og gjenoppretting" : 
                       isRunningDay ? "Utholdenhet og aerob kapasitet" : 
                       "Grunnleggende styrke",
                exercises: exercises
              });
            }
            
            response = {
              title: titleMatch[1],
              description: descriptionMatch[1],
              splitType: splitTypeMatch[1],
              workouts: workouts,
              progression: "Øk antall repetisjoner eller vekt gradvis over tid",
              safety: "Start lett og fokuser på riktig teknikk"
            };
            
            console.log('Successfully created fallback JSON structure');
          } else {
            throw secondError;
          }
        } catch (thirdError) {
          console.error('Manual reconstruction also failed:', thirdError);
          throw new Error(`JSON parsing failed: ${parseError.message}. Raw response: ${rawResponse.substring(0, 200)}...`);
        }
      }
    }
    
    // Post-process to ensure correct number of exercises
    const targetExercises = availableTime <= 30 ? 4 : availableTime <= 60 ? 5 : availableTime <= 90 ? 6 : 7;
    console.log(`Post-processing: availableTime=${availableTime}, targetExercises=${targetExercises}`);
    
    if (response.workouts) {
      console.log(`Found ${response.workouts.length} workouts to process`);
      response.workouts.forEach((workout, dayIndex) => {
        const currentCount = workout.exercises ? workout.exercises.length : 0;
        
        // Check if this is a running day
        const isRunningDay = workout.day && (
          workout.day.toLowerCase().includes('løp') || 
          workout.day.toLowerCase().includes('intervall') || 
          workout.day.toLowerCase().includes('tempo') || 
          workout.day.toLowerCase().includes('lang')
        );
        
        // Check if this is a rest day
        const isRestDay = workout.day && (
          workout.day.toLowerCase().includes('hvile') || 
          workout.day.toLowerCase().includes('rest') || 
          workout.day.toLowerCase().includes('gjenoppretting') ||
          workout.day.toLowerCase().includes('hviledag')
        );
        
        if (isRestDay) {
          console.log(`Rest day detected: ${workout.day} - ensuring no exercises (has ${currentCount})`);
          // For rest days, ensure no exercises are added and remove any existing ones
          if (workout.exercises && workout.exercises.length > 0) {
            console.log(`Removing ${workout.exercises.length} exercises from rest day: ${workout.day}`);
            workout.exercises = [];
          }
        } else if (isRunningDay) {
          console.log(`Running day detected: ${workout.day} - allowing 1-2 exercises (has ${currentCount})`);
          // For running days, 1-2 exercises is fine, don't add more
        } else {
          console.log(`Strength day: ${workout.day} has ${currentCount} exercises (need ${targetExercises})`);
          
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
        }
      });
    } else {
      console.log('No workouts found in response');
    }
    
    // Add auto-split information to response
    if (useAutoSplit) {
      response.autoSplitInfo = {
        selectedSplit: finalWorkoutSplit,
        reasoning: autoSplitReasoning,
        wasAutoSelected: true
      };
    } else {
      response.autoSplitInfo = {
        selectedSplit: finalWorkoutSplit,
        reasoning: 'Bruker valgte split selv',
        wasAutoSelected: false
      };
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
      cookingTimePreference, 
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
    - Koketidspreferanse: ${cookingTimePreference}
    - Budsjett: ${budget}
    
    KRITISK: Du MÅ lage en KOMPLETT 7-dagers måltidsplan med alle dager:
    - Mandag, Tirsdag, Onsdag, Torsdag, Fredag, Lørdag, Søndag
    
    OBLIGATORISK STRUKTUR PER DAG:
    Hver dag MÅ inneholde:
    - Frokost (2-3 alternativer)
    - Lunsj (2-3 alternativer) 
    - Middag (2-3 alternativer)
    - Snack (2-3 alternativer)
    
    Dette gir totalt 8-12 måltidsalternativer per dag for variasjon!
    
    KRITISK KRAV:
    - Inkluder ALLE 7 dager i JSON-responsen
    - Hver dag må ha ALLE måltidstyper (frokost, lunsj, middag, snack)
    - Ikke stopp etter én dag eller én måltidstype
    - Hver dag må være unik med varierte ingredienser
    
    ARBEIDSFREMGANGSMÅTE:
    1. Først: Planlegg Mandag med ALLE måltider (frokost, lunsj, middag, snack)
    2. Deretter: Planlegg Tirsdag med ALLE måltider (frokost, lunsj, middag, snack)
    3. Deretter: Planlegg Onsdag med ALLE måltider (frokost, lunsj, middag, snack)
    4. Deretter: Planlegg Torsdag med ALLE måltider (frokost, lunsj, middag, snack)
    5. Deretter: Planlegg Fredag med ALLE måltider (frokost, lunsj, middag, snack)
    6. Deretter: Planlegg Lørdag med ALLE måltider (frokost, lunsj, middag, snack)
    7. Til slutt: Planlegg Søndag med ALLE måltider (frokost, lunsj, middag, snack)
    
    HUSK: Hver dag må være unik med varierte ingredienser og oppskrifter!
    
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
      "title": "7-dagers Måltidsplan for ${goals === 'muscle_gain' ? 'Muskeloppbygging' : goals === 'weight_loss' ? 'Vekttap' : goals === 'endurance' ? 'Utholdenhet' : 'Balansert Kosthold'}",
      "description": "Komplett 7-dagers måltidsplan tilpasset dine mål og behov",
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
              "type": "Lunsj",
              "time": "12:00",
              "calories": 500,
              "macros": {"protein": 30, "carbs": 50, "fat": 20},
              "ingredients": ["Ingrediens 3", "Ingrediens 4"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "20 min",
              "difficulty": "lett"
            },
            {
              "type": "Middag",
              "time": "18:00",
              "calories": 600,
              "macros": {"protein": 40, "carbs": 60, "fat": 25},
              "ingredients": ["Ingrediens 5", "Ingrediens 6"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "30 min",
              "difficulty": "middels"
            },
            {
              "type": "Snack",
              "time": "15:00",
              "calories": 200,
              "macros": {"protein": 10, "carbs": 25, "fat": 8},
              "ingredients": ["Ingrediens 7", "Ingrediens 8"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "5 min",
              "difficulty": "lett"
            }
          ]
        },
        {
          "day": "Tirsdag",
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
              "type": "Lunsj",
              "time": "12:00",
              "calories": 500,
              "macros": {"protein": 30, "carbs": 50, "fat": 20},
              "ingredients": ["Ingrediens 3", "Ingrediens 4"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "20 min",
              "difficulty": "lett"
            },
            {
              "type": "Middag",
              "time": "18:00",
              "calories": 600,
              "macros": {"protein": 40, "carbs": 60, "fat": 25},
              "ingredients": ["Ingrediens 5", "Ingrediens 6"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "30 min",
              "difficulty": "middels"
            },
            {
              "type": "Snack",
              "time": "15:00",
              "calories": 200,
              "macros": {"protein": 10, "carbs": 25, "fat": 8},
              "ingredients": ["Ingrediens 7", "Ingrediens 8"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "5 min",
              "difficulty": "lett"
            }
          ]
        },
        {
          "day": "Onsdag",
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
              "type": "Lunsj",
              "time": "12:00",
              "calories": 500,
              "macros": {"protein": 30, "carbs": 50, "fat": 20},
              "ingredients": ["Ingrediens 3", "Ingrediens 4"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "20 min",
              "difficulty": "lett"
            },
            {
              "type": "Middag",
              "time": "18:00",
              "calories": 600,
              "macros": {"protein": 40, "carbs": 60, "fat": 25},
              "ingredients": ["Ingrediens 5", "Ingrediens 6"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "30 min",
              "difficulty": "middels"
            },
            {
              "type": "Snack",
              "time": "15:00",
              "calories": 200,
              "macros": {"protein": 10, "carbs": 25, "fat": 8},
              "ingredients": ["Ingrediens 7", "Ingrediens 8"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "5 min",
              "difficulty": "lett"
            }
          ]
        },
        {
          "day": "Torsdag",
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
              "type": "Lunsj",
              "time": "12:00",
              "calories": 500,
              "macros": {"protein": 30, "carbs": 50, "fat": 20},
              "ingredients": ["Ingrediens 3", "Ingrediens 4"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "20 min",
              "difficulty": "lett"
            },
            {
              "type": "Middag",
              "time": "18:00",
              "calories": 600,
              "macros": {"protein": 40, "carbs": 60, "fat": 25},
              "ingredients": ["Ingrediens 5", "Ingrediens 6"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "30 min",
              "difficulty": "middels"
            },
            {
              "type": "Snack",
              "time": "15:00",
              "calories": 200,
              "macros": {"protein": 10, "carbs": 25, "fat": 8},
              "ingredients": ["Ingrediens 7", "Ingrediens 8"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "5 min",
              "difficulty": "lett"
            }
          ]
        },
        {
          "day": "Fredag",
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
              "type": "Lunsj",
              "time": "12:00",
              "calories": 500,
              "macros": {"protein": 30, "carbs": 50, "fat": 20},
              "ingredients": ["Ingrediens 3", "Ingrediens 4"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "20 min",
              "difficulty": "lett"
            },
            {
              "type": "Middag",
              "time": "18:00",
              "calories": 600,
              "macros": {"protein": 40, "carbs": 60, "fat": 25},
              "ingredients": ["Ingrediens 5", "Ingrediens 6"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "30 min",
              "difficulty": "middels"
            },
            {
              "type": "Snack",
              "time": "15:00",
              "calories": 200,
              "macros": {"protein": 10, "carbs": 25, "fat": 8},
              "ingredients": ["Ingrediens 7", "Ingrediens 8"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "5 min",
              "difficulty": "lett"
            }
          ]
        },
        {
          "day": "Lørdag",
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
              "type": "Lunsj",
              "time": "12:00",
              "calories": 500,
              "macros": {"protein": 30, "carbs": 50, "fat": 20},
              "ingredients": ["Ingrediens 3", "Ingrediens 4"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "20 min",
              "difficulty": "lett"
            },
            {
              "type": "Middag",
              "time": "18:00",
              "calories": 600,
              "macros": {"protein": 40, "carbs": 60, "fat": 25},
              "ingredients": ["Ingrediens 5", "Ingrediens 6"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "30 min",
              "difficulty": "middels"
            },
            {
              "type": "Snack",
              "time": "15:00",
              "calories": 200,
              "macros": {"protein": 10, "carbs": 25, "fat": 8},
              "ingredients": ["Ingrediens 7", "Ingrediens 8"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "5 min",
              "difficulty": "lett"
            }
          ]
        },
        {
          "day": "Søndag",
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
              "type": "Lunsj",
              "time": "12:00",
              "calories": 500,
              "macros": {"protein": 30, "carbs": 50, "fat": 20},
              "ingredients": ["Ingrediens 3", "Ingrediens 4"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "20 min",
              "difficulty": "lett"
            },
            {
              "type": "Middag",
              "time": "18:00",
              "calories": 600,
              "macros": {"protein": 40, "carbs": 60, "fat": 25},
              "ingredients": ["Ingrediens 5", "Ingrediens 6"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "30 min",
              "difficulty": "middels"
            },
            {
              "type": "Snack",
              "time": "15:00",
              "calories": 200,
              "macros": {"protein": 10, "carbs": 25, "fat": 8},
              "ingredients": ["Ingrediens 7", "Ingrediens 8"],
              "instructions": ["Steg 1", "Steg 2"],
              "prepTime": "5 min",
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
    - Fullfør alle 7 dager med alle måltidsalternativer
    
    KRITISK: Du MÅ returnere ALLE 7 dager (Mandag til Søndag) i JSON-responsen!
    Ikke stopp etter én dag - dette er kritisk for at applikasjonen fungerer riktig.
    
    FINAL PÅMINNELSE: 
    - JSON må inneholde nøyaktig 7 dager i meals-arrayet
    - Hver dag må ha ALLE måltidstyper: frokost, lunsj, middag, snack
    - Ikke returner bare én dag eller én måltidstype - dette vil ødelegge applikasjonen
    - Sjekk at du har inkludert: Mandag, Tirsdag, Onsdag, Torsdag, Fredag, Lørdag, Søndag
    - Hver dag må ha 4 måltider: frokost, lunsj, middag, snack
    - FØLG JSON-EKSEMPLET OVENFOR - hver dag må ha alle 4 måltider som vist
    - Dette er KRITISK for at applikasjonen fungerer riktig!
    
    VIKTIG: Hvis du ikke følger eksemplet nøyaktig, vil applikasjonen feile!
    Du MÅ inkludere alle 7 dager med alle 4 måltider per dag!`;

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
    console.log('Raw OpenAI response length:', rawResponse.length);
    console.log('Raw OpenAI response preview:', rawResponse.substring(0, 500));
    console.log('Raw OpenAI response contains "Tirsdag":', rawResponse.includes('Tirsdag'));
    console.log('Raw OpenAI response contains "Onsdag":', rawResponse.includes('Onsdag'));
    console.log('Raw OpenAI response contains "Søndag":', rawResponse.includes('Søndag'));
    
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
      
      // Check if we only got one day and expand to 7 days
      if (response.meals && response.meals.length < 7) {
        console.log(`Only ${response.meals.length} day(s) received, expanding to 7 days...`);
        const existingDays = response.meals;
        const allDays = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
        
        // Ensure we have all 4 meal types for each day
        const requiredMealTypes = ['Frokost', 'Lunsj', 'Middag', 'Snack'];
        
        // Create a complete 7-day plan
        response.meals = allDays.map((dayName, index) => {
          const existingDay = existingDays.find(day => day.day === dayName);
          
          if (existingDay) {
            // Ensure existing day has all 4 meal types
            const existingMealTypes = existingDay.meals.map(meal => meal.type);
            const missingMealTypes = requiredMealTypes.filter(type => 
              !existingMealTypes.some(existing => existing.includes(type))
            );
            
            // Add missing meal types
            const templateMeal = existingDay.meals[0] || {
              time: "12:00",
              calories: 400,
              macros: {"protein": 25, "carbs": 45, "fat": 15},
              ingredients: ["Ingrediens 1", "Ingrediens 2"],
              instructions: ["Steg 1", "Steg 2"],
              prepTime: "15 min",
              difficulty: "lett"
            };
            
            const missingMeals = missingMealTypes.map(mealType => ({
              ...templateMeal,
              type: mealType,
              time: mealType === 'Frokost' ? "07:00" : 
                    mealType === 'Lunsj' ? "12:00" : 
                    mealType === 'Middag' ? "18:00" : "15:00"
            }));
            
            return {
              ...existingDay,
              meals: [...existingDay.meals, ...missingMeals]
            };
          } else {
            // Create a new day based on the first available day
            const templateDay = existingDays[0];
            return {
              day: dayName,
              meals: requiredMealTypes.map((mealType, mealIndex) => {
                const templateMeal = templateDay.meals[mealIndex] || templateDay.meals[0];
                return {
                  ...templateMeal,
                  type: mealType,
                  time: mealType === 'Frokost' ? "07:00" : 
                        mealType === 'Lunsj' ? "12:00" : 
                        mealType === 'Middag' ? "18:00" : "15:00",
                  ingredients: templateMeal.ingredients.map(ingredient => {
                    // Create variations for ingredients
                    const variations = {
                      'egg': ['egg', 'kylling', 'laks', 'tofu'],
                      'brød': ['brød', 'knekkebrød', 'wrap', 'bagel'],
                      'melk': ['melk', 'mandelmelk', 'havremelk', 'kokosmelk'],
                      'kylling': ['kylling', 'laks', 'kyllingbryst', 'kalkun'],
                      'ris': ['ris', 'quinoa', 'bulgur', 'brown rice']
                    };
                    
                    for (const [key, variants] of Object.entries(variations)) {
                      if (ingredient.toLowerCase().includes(key)) {
                        return variants[index % variants.length];
                      }
                    }
                    return ingredient + ` (${dayName.toLowerCase()})`;
                  }),
                  instructions: templateMeal.instructions.map(instruction => 
                    instruction + ` - Tilpasset for ${dayName}`
                  )
                };
              })
            };
          }
        });
        
        console.log('Expanded to 7 days with all 4 meal types per day');
      }
      
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
  console.log(`AI Workout Planner Backend kjører på port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
