# AI Workout Planner Backend

Backend server for AI Workout Planner med OpenAI GPT-4 integrasjon.

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

Backend vil kjøre på `http://localhost:5000`

## 📡 API Endpoints

### Health Check
- **GET** `/api/health`
- Sjekker om serveren kjører

### Treningsplanlegging
- **POST** `/api/generate-workout`
- Genererer personlige treningsplaner med AI

### Bevegelsesanalyse
- **POST** `/api/motion-feedback`
- Gir AI-drevet feedback på treningsform

### Øvelsesanalyse
- **POST** `/api/analyze-exercise`
- Omfattende analyse av treningsøkt

## 🔒 Sikkerhet

- ✅ API-nøkkel lagres i `.env` fil (ikke i Git)
- ✅ CORS konfigurert for frontend
- ✅ Error handling for alle endpoints
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
├── server.js          # Hovedserver
├── package.json       # Avhengigheter
├── .env              # API-nøkkel (ikke i Git)
├── .gitignore        # Ignorerer sensitive filer
└── README.md         # Denne filen
```

## 🚨 Viktig

- **Ikke committ `.env` filen** til Git
- **Ikke del API-nøkkelen** med andre
- **Bruk HTTPS** i produksjon
- **Overvåk API-bruk** for å unngå overforbruk

## 🔧 Troubleshooting

### "Kunne ikke koble til serveren"
- Sjekk at backend kjører på port 5000
- Sjekk at API-nøkkel er riktig i `.env`
- Sjekk at frontend kobler til `http://localhost:5000`

### "API Error"
- Sjekk at API-nøkkel er gyldig
- Sjekk at du har kreditter på OpenAI-kontoen
- Sjekk at modellen `gpt-4` er tilgjengelig

### "CORS Error"
- Backend har CORS konfigurert for `http://localhost:3000`
- Hvis du bruker annen port, oppdater CORS i `server.js`
