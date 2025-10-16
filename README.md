# 💪 Trenly

> **En omfattende treningsapplikasjon som kombinerer AI-drevet treningsplanlegging med sanntidsanalyse av bevegelser ved hjelp av computer vision**

[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-purple?style=flat-square&logo=openai)](https://openai.com/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Pose-orange?style=flat-square&logo=google)](https://mediapipe.dev/)

## 🎯 Prosjektoversikt

Trenly er en full-stack webapplikasjon som revolusjonerer personlig trening ved å tilby:

- **🤖 AI-Generated Workout Plans**: Personalized training programs based on individual goals, fitness level, and equipment
- **📊 Nutrition Planning**: Comprehensive meal plans tailored to training objectives
- **🎥 Real-time Movement Analysis**: Computer vision-powered form correction and rep counting
- **📈 Progress Tracking**: Detailed analytics and performance monitoring

## ✨ Key Features

### 🏋️ Smart Workout Planning
- **Personalized Programs**: AI generates custom workouts based on age, weight, fitness level, and goals
- **Injury-Aware Design**: Automatically avoids exercises that could worsen existing injuries
- **Equipment Flexibility**: Adapts to available equipment (bodyweight, dumbbells, full gym)
- **Multiple Training Splits**: Push/Pull/Legs, Upper/Lower, Full Body, and custom splits
- **Time-Optimized**: Workouts designed for 15-180 minutes with appropriate exercise counts

### 🍎 Intelligent Nutrition Planning
- **Goal-Specific Meal Plans**: Tailored nutrition for muscle gain, weight loss, endurance, or maintenance
- **Macro Calculations**: Automatic BMR/TDEE calculations with optimal macronutrient distribution
- **Dietary Restrictions**: Handles allergies, dietary preferences, and budget constraints
- **7-Day Variety**: Multiple meal options per day to prevent monotony
- **Prep-Friendly**: Meal prep instructions with cooking times and difficulty levels

### 🎥 Advanced Movement Analysis
- **Real-time Pose Detection**: MediaPipe-powered body tracking with 33 key points
- **Form Scoring**: AI-driven form assessment (0-100 scale) with specific feedback
- **Angle Analysis**: Precise measurement of critical joint angles for optimal form
- **Rep Counting**: Automated repetition tracking with movement pattern recognition
- **Exercise-Specific Feedback**: Tailored guidance for squats, push-ups, planks, and more

### 📱 Modern User Experience
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Intuitive Interface**: Clean, modern UI with smooth animations
- **PDF Export**: Professional workout and nutrition plan downloads
- **Progressive Web App**: Offline capabilities and app-like experience

## 🛠️ Technical Architecture

### Frontend Stack
```javascript
React 18          // Modern component-based UI
Framer Motion     // Smooth animations and transitions
React Icons       // Comprehensive icon library
jsPDF            // PDF generation for workout plans
html2canvas      // Screenshot capabilities
```

### Backend Stack
```javascript
Node.js          // Runtime environment
Express.js       // Web application framework
OpenAI API       // GPT-4o-mini for AI-powered content
CORS             // Cross-origin resource sharing
dotenv           // Environment variable management
```

### AI & Computer Vision
```javascript
OpenAI GPT-4o-mini    // Natural language processing
MediaPipe Pose        // Real-time pose estimation
Camera Utils          // WebRTC camera integration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key
- Modern browser with camera support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/trenly.git
   cd trenly
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend && npm install && cd ..
   ```

3. **Configure environment**
```bash
   # Create backend/.env file
   echo "OPENAI_API_KEY=your_openai_api_key_here" > backend/.env
```

4. **Start the application**
```bash
   # Terminal 1: Start backend
   cd backend && npm run dev
   
   # Terminal 2: Start frontend
npm start
```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📊 API Documentation

### Workout Generation
```http
POST /api/generate-workout
Content-Type: application/json

{
  "age": 25,
  "weight": 70,
  "height": 175,
  "fitnessLevel": "intermediate",
  "goals": "muscle_gain",
  "availableTime": 60,
  "equipment": "full",
  "injuries": "lower back pain",
  "workoutSplit": "push_pull_legs",
  "trainingDays": 4
}
```

### Nutrition Planning
```http
POST /api/generate-meal-plan
Content-Type: application/json

{
  "age": 25,
  "weight": 70,
  "height": 175,
  "gender": "male",
  "activityLevel": "moderate",
  "goals": "muscle_gain",
  "dietaryRestrictions": "lactose intolerant",
  "allergies": "nuts",
  "mealPreferences": "high_protein",
  "cookingTime": 45,
  "budget": "medium"
}
```

### Movement Analysis
```http
POST /api/motion-feedback
Content-Type: application/json

{
  "exercise": "squat",
  "angles": {
    "hipKneeAnkle": 95,
    "shoulderElbowWrist": 90
  },
  "formScore": 85,
  "repCount": 8,
  "currentFeedback": ["Good depth", "Keep chest up"]
}
```

## 🏗️ Project Structure

```
ai-workout-planner/
├── src/                          # React frontend
│   ├── components/
│   │   ├── App.js               # Main application component
│   │   ├── NutritionPlanner.js  # Nutrition planning interface
│   │   └── ProgressionTracker.js # Progress tracking
│   ├── styles/
│   │   ├── App.css             # Main application styles
│   │   ├── NutritionPlanner.css # Nutrition-specific styles
│   │   └── ProgressionTracker.css # Progress tracking styles
│   └── utils/                   # Utility functions
├── backend/                      # Node.js backend
│   ├── server.js                # Express server and API routes
│   ├── package.json             # Backend dependencies
│   └── .env                     # Environment variables (not in Git)
├── public/                      # Static assets
├── package.json                 # Frontend dependencies
└── README.md                    # This file
```

## 🎨 Key Technical Implementations

### AI Integration
- **Prompt Engineering**: Carefully crafted prompts for consistent, high-quality AI responses
- **Error Handling**: Robust fallback mechanisms for API failures
- **Response Parsing**: Advanced JSON cleaning and validation
- **Context Management**: Efficient token usage with structured prompts

### Computer Vision
- **Real-time Processing**: 30fps pose detection with minimal latency
- **Angle Calculations**: Mathematical precision in joint angle measurements
- **Form Analysis**: AI-driven assessment of exercise technique
- **Performance Optimization**: Efficient canvas rendering and data processing

### User Experience
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Accessibility**: WCAG-compliant interface with keyboard navigation
- **Performance**: Code splitting and lazy loading for optimal load times
- **Offline Support**: Service worker implementation for PWA capabilities

## 🔒 Security & Best Practices

- **Environment Variables**: Sensitive data stored in `.env` files (not committed)
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Input Validation**: Comprehensive data validation on both frontend and backend
- **Error Boundaries**: Graceful error handling throughout the application
- **Code Quality**: ESLint and Prettier for consistent code formatting

## 📈 Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Bundle Size**: < 500KB gzipped

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy build/ directory
```

### Backend (Railway/Heroku)
```bash
# Set environment variables
OPENAI_API_KEY=your_key_here
PORT=5000

# Deploy with platform-specific commands
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@LarsAugustSande](https://github.com/LarsAugustSande)
- LinkedIn: [Lars August Sande](www.linkedin.com/in/lars-august-sande-2191a6245)
- Email: larsaugustsande@gmail.com

## 🙏 Acknowledgments

- OpenAI for providing the GPT-4o-mini API
- Google MediaPipe team for the pose detection technology
- React and Node.js communities for excellent documentation
- All contributors and testers of this project

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

</div># ai-workout-planner
# ai-workout-planner
