# AI Workout Planner Backend

Backend server for Trenly AI Workout Planner med OpenAI GPT-4 integrasjon for personlige treningsplaner og kostholdsplanlegging.

## 🔑 API-nøkkel Setup

### 1. Legg til OpenAI API-nøkkel

1. **Åpne `.env` filen** i backend-mappen:
   ```bash
   cd backend
   nano .env
   ```

2. **Erstatt placeholder** med din faktiske API-nøkkel:
   ```env
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   ```

3. **Lagre filen** og lukk editoren

### 2. Hvor du finner API-nøkkelen

1. Gå til [OpenAI Platform](https://platform.openai.com/api-keys)
2. Logg inn på din OpenAI konto
3. Klikk "Create new secret key"
4. Kopier nøkkelen (den starter med `sk-`)
5. Lim den inn i `.env` filen

## 🚀 Start Backend

### Utvikling (med auto-restart):
```bash
npm run dev
```

### Produksjon:
```bash
npm start
```

Backend kjører på `http://localhost:5001`

## 📡 API Endpoints

### Health Check
- **GET** `/api/health`
- Sjekker om serveren kjører

### Treningsplanlegging
- **POST** `/api/generate-workout`
- Genererer personlige treningsplaner med AI
- Støtter automatisk split-valg og manuell valg
- Inkluderer detaljerte øvelser med beskrivelser

### Kostholdsplanlegging
- **POST** `/api/generate-meal-plan`
- Genererer 7-dagers måltidsplaner
- Tilpasset kaloribehov og makronæringsstoffer
- Støtter allergier og kostpreferanser

### Bevegelsesanalyse
- **POST** `/api/motion-feedback`
- Gir AI-drevet feedback på treningsform

### Øvelsesanalyse
- **POST** `/api/analyze-exercise`
- Omfattende analyse av treningsøkt

### Split-anbefalinger
- **POST** `/api/recommend-split`
- AI-anbefalinger for treningssplit basert på brukerdata

### Treningsplan-redigering
- **POST** `/api/edit-workout`
- Rediger eksisterende treningsplaner med AI

## 🤖 AI Modeller

### GPT-4 (Hovedmodell)
- **Treningsplaner**: `gpt-4` for høy kvalitet og detaljerte planer
- **Kostholdsplaner**: `gpt-4` for komplekse 7-dagers planer
- **Split-anbefalinger**: `gpt-4` for intelligente anbefalinger
- **Plan-redigering**: `gpt-4` for presise endringer

- **Øvelsesanalyse**: `gpt-3.5-turbo` for effektiv analyse

## 🔒 Sikkerhet

- ✅ API-nøkkel lagres i `.env` fil (ikke i Git)
- ✅ CORS konfigurert for frontend
- ✅ Error handling for alle endpoints
- ✅ JSON parsing med robust fallback
- ✅ Rate limiting kan legges til ved behov

## 🛠️ Utvikling

### Installasjon:
```bash
npm install
```

### Avhengigheter:
- `express` - Web server
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `openai` - OpenAI API client

### Struktur:
```
backend/
├── server.js          # Hovedserver med alle endpoints
├── package.json       # Avhengigheter og scripts
├── .env              # API-nøkkel (ikke i Git)
├── .gitignore        # Ignorerer sensitive filer
└── README.md         # Denne filen
```

## 🚨 Viktig

- **Ikke committ `.env` filen** til Git
- **Ikke del API-nøkkelen** med andre
- **Bruk HTTPS** i produksjon
- **Overvåk API-bruk** for å unngå overforbruk
- **GPT-4 koster mer** enn GPT-3.5-turbo

## 🔧 Troubleshooting

### "Kunne ikke koble til serveren"
- Sjekk at backend kjører på port 5001
- Sjekk at API-nøkkel er riktig i `.env`
- Sjekk at frontend kobler til `http://localhost:5001`

### "API Error"
- Sjekk at API-nøkkel er gyldig
- Sjekk at du har kreditter på OpenAI-kontoen
- Sjekk at modellene `gpt-4` og `gpt-3.5-turbo` er tilgjengelige

### "CORS Error"
- Backend har CORS konfigurert for `http://localhost:3000`
- Hvis du bruker annen port, oppdater CORS i `server.js`

### "JSON parsing failed"
- Backend har robust JSON parsing med fallback
- Sjekk at AI-responsen er gyldig JSON
- Fallback genererer standard planer hvis parsing feiler

## 📊 Ytelse

### Optimaliseringer:
- **GPT-3.5-turbo** for raskere analyser
- **GPT-4** for høy kvalitet treningsplaner
- **Reduserte tokens** for raskere respons
- **Lavere temperature** for konsistente resultater

### Måltidsplaner:
- **7-dagers planer** med alle måltider
- **Automatisk utvidelse** hvis AI ikke følger instruksjoner
- **Fallback-logikk** for manglende dager/måltider