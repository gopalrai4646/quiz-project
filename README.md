# AI-Assisted Knowledge Quiz

A React web application that uses Google's Gemini API to generate dynamic, personalized quizzes on various topics with AI-powered feedback.

---

## 1. Project Setup & Demo

### Web: 
Run `npm install && npm run dev` to launch locally.

**Detailed Setup Steps:**
1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Key**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_actual_google_gemini_api_key
   ```
   *Note: The project uses `process.env.API_KEY` - you may need to configure Vite's environment variable injection or update the code to use `import.meta.env.VITE_GEMINI_API_KEY` depending on your build setup.*

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or the port Vite assigns).


---

## 2. Problem Understanding

**Problem Summary:**
The challenge was to build an interactive quiz application that dynamically generates quiz questions using AI (Google Gemini API) instead of using a static question database. The application needs to:
- Allow users to select from various topics
- Generate unique quiz questions on-the-fly using AI
- Provide a smooth quiz-taking experience with navigation
- Calculate scores and provide personalized AI-generated feedback
- Handle errors gracefully with retry mechanisms

**Assumptions Made:**
- Users have access to a Google Gemini API key
- Users prefer a simple, clean interface over complex features
- Quiz questions should be multiple-choice format (4 options per question)
- Each quiz should contain exactly 5 questions for consistency
- The application is web-based and responsive across devices
- Dark mode is a desirable feature for user preference
- Error handling should be robust enough to handle API failures gracefully with retry logic

---

## 3. AI Prompts & Iterations

### Initial Prompt for Quiz Generation:
```
Generate a quiz with exactly 5 multiple-choice questions about "${topic}".
Each question must have exactly 4 options. The correctIndex must be an integer between 0 and 3.
Keep the tone engaging but educational.
```

**Issues Faced:**
1. **JSON Parsing Errors**: The AI sometimes returned malformed JSON or text that wasn't valid JSON
2. **Inconsistent Structure**: Questions didn't always have exactly 4 options
3. **Repetitive Questions**: Generated questions sometimes had similar wording or structure
4. **Schema Validation**: Needed strict schema enforcement to ensure data consistency

**Refined Prompt (Current Implementation):**
```
Generate a quiz with exactly 5 multiple-choice questions about "${topic}".
Each question must be uniquely created and must not repeat wording or structure from common or previously generated questions.
Ensure the questions cover different aspects or angles of the topic.
Each question must have exactly 4 answer options labeled A, B, C, and D, and the correctIndex must be an integer between 0 and 3 corresponding to the correct option.
Make the tone engaging and educational, and avoid generic or repetitive phrasing.
Provide only valid, factually accurate content.
```

**Technical Improvements:**
- Implemented structured JSON schema using `responseSchema` with Type definitions
- Added retry mechanism (MAX_RETRIES = 2) to handle transient API failures
- Added validation checks for question structure (4 options, correct index range)
- Used `responseMimeType: "application/json"` to enforce JSON response format
- Set temperature to 0.7 for balanced creativity and consistency

### Initial Prompt for Feedback Generation:
```
Generate a short, friendly feedback message for a user who took a quiz on "${topic}".
They scored ${score} out of ${total}. Keep it under 50 words.
```

**Issues Faced:**
- Feedback was sometimes too generic
- Didn't differentiate between high and low scores effectively

**Refined Prompt (Current Implementation):**
```
Generate a short, friendly feedback message for a user who took a quiz on "${topic}".
They scored ${score} out of ${total}.
If the score is high, be congratulatory.
If the score is low, be encouraging and suggest one specific tip to learn more about ${topic}.
Keep it under 50 words. Plain text only.
```

---

## 4. Architecture & Code Structure

### Navigation Management
- **`App.jsx`** manages the overall application structure and screen routing
  - Uses Zustand store (`useQuizStore`) to track current screen state
  - Implements screen switching logic between `TOPICS`, `QUIZ`, `RESULT`, and `ERROR` states
  - Handles dark mode toggling and theme persistence
  - Manages loading states and error display

### Screen Components
- **`screens/TopicScreen.jsx`**: Entry point displaying topic selection grid
  - Renders 6 predefined topics from `types.js`
  - Triggers quiz generation on topic selection
  - Handles loading state during API call

- **`screens/QuizScreen.jsx`**: Main quiz interface
  - Displays questions one at a time with navigation
  - Shows progress bar indicating current question
  - Allows users to select/unselect answers
  - Handles next/previous navigation
  - Triggers feedback generation on quiz completion

- **`screens/ResultScreen.jsx`**: Displays quiz results
  - Shows score (X/5 format) and percentage
  - Displays AI-generated personalized feedback
  - Provides option to restart with a new topic

### AI Service Layer
- **`services/geminiService.js`**: Handles all AI interactions
  - **`generateQuizQuestions(topic)`**: 
    - Uses Gemini 2.5 Flash model
    - Implements structured JSON schema for response validation
    - Includes retry logic (up to 2 retries) for failed API calls
    - Validates response structure before returning
  - **`generateFeedback(topic, score, total)`**:
    - Generates contextual feedback based on performance
    - Includes error fallback to default message

### State Management
- **`store/useQuizStore.js`**: Centralized state using Zustand
  - Manages screen navigation (`currentScreen`)
  - Tracks quiz state: `questions`, `currentQuestionIndex`, `userAnswers`, `score`
  - Handles loading and error states
  - Implements dark mode with localStorage persistence
  - Provides actions: `setTopic`, `setQuestions`, `answerQuestion`, `nextQuestion`, `calculateScore`, `resetQuiz`

### Reusable Components
- **`components/QuestionCard.jsx`**: Displays individual question with options
- **`components/ProgressBar.jsx`**: Visual indicator of quiz progress
- **`components/Loader.jsx`**: Loading spinner with contextual messages

### Configuration
- **`types.js`**: Defines constants
  - `ScreenState` enum for navigation states
  - `TOPICS` array with available quiz topics

---

## 5. Screenshots / Screen Recording

*(Placeholders for screenshots)*

### Screen 1: Topic Selection
- Grid layout displaying 6 topic cards (Tech Trends, World History, Space Exploration, Healthy Living, Modern Art, Cybersecurity Basics)
- Header with logo and dark mode toggle
- Clean, responsive design with hover effects

### Screen 2: Quiz Interface
- Progress bar showing current question (e.g., "Question 2 of 5")
- Large question card with 4 multiple-choice options
- Previous/Next navigation buttons
- Responsive layout for mobile and desktop

### Screen 3: Results Screen
- Large score display (X/5 format)
- Percentage score
- AI-generated feedback in highlighted box
- "Try Another Topic" button to restart
- Confetti animation on high scores (via canvas-confetti library)

### Screen 4: Loading States
- Animated loader during quiz generation
- Contextual loading messages ("Generating [Topic] Quiz...", "Analyzing Results...")

---

## 6. Known Issues / Improvements

### Known Issues:
1. **Environment Variable Handling**: The code uses `process.env.API_KEY` which may not work directly with Vite. Should use `import.meta.env.VITE_GEMINI_API_KEY` or configure build tools properly.
2. **No Error Recovery for Feedback**: If feedback generation fails, it falls back to a generic message, but there's no retry mechanism like quiz generation has.
3. **Limited Topic Selection**: Only 6 predefined topics. No option for custom user-input topics.
4. **No Local Storage for Progress**: Quiz progress is lost on page refresh - users can't resume a quiz.
5. **API Rate Limiting**: No explicit handling for API rate limits or quota exhaustion.

### Improvements (with more time):
1. **Custom Topics**: Allow users to input any topic they want to quiz themselves on
2. **Difficulty Levels**: Add Easy/Medium/Hard options for each topic
3. **Quiz History**: Save previous quiz attempts and scores to localStorage
4. **Better Error Handling**: 
   - More specific error messages
   - Exponential backoff for retries
   - User-friendly messages for different error types
5. **Quiz Analytics**: 
   - Track which questions users get wrong most often
   - Show performance trends over time
6. **Accessibility Improvements**:
   - Better keyboard navigation
   - ARIA labels for screen readers
   - Focus management
7. **Performance Optimizations**:
   - Pre-load next question while user is reading current one
   - Cache generated quizzes for popular topics
8. **Social Features**: Share scores, challenge friends
9. **Question Review**: After completion, show which answers were correct/incorrect with explanations


---

## 7. Bonus Work

### Dark Mode
- Full dark mode implementation with smooth transitions
- Theme preference persisted in localStorage
- Toggle button in header for easy access
- Consistent dark theme across all screens

### UI/UX Polish
- **Smooth Animations**: Fade-in effects for screen transitions
- **Hover Effects**: Interactive feedback on buttons and topic cards
- **Visual Feedback**: Disabled states for navigation buttons, selected option highlighting
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Confetti Animation**: Celebratory confetti effect on quiz completion (using canvas-confetti library)

### Error Handling
- Comprehensive error boundaries
- User-friendly error messages with recovery options
- Automatic retry mechanism for failed API calls
- Graceful degradation (fallback messages when feedback generation fails)

### Code Quality
- Clean separation of concerns (services, components, store)
- Reusable component architecture
- Type-safe constants and enums
- Well-structured state management with Zustand

### Additional Features
- Progress tracking during quiz
- Ability to go back and change answers before submission
- Visual progress indicator
- Contextual loading messages
- Clean, modern UI design with Tailwind CSS
