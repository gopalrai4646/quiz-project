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
  

### Screen Components
- **`screens/TopicScreen.jsx`**: Entry point displaying topic selection grid
  

- **`screens/QuizScreen.jsx`**: Main quiz interface
  

- **`screens/ResultScreen.jsx`**: Displays quiz results
 
### AI Service Layer
- **`services/geminiService.js`**: Handles all AI interactions
  - **`generateQuizQuestions(topic)`**: 
   
  - **`generateFeedback(topic, score, total)`**:
    
      

### State Management
- **`store/useQuizStore.js`**: Centralized state using Zustand
 

### Reusable Components
- **`components/QuestionCard.jsx`**: Displays individual question with options
- **`components/ProgressBar.jsx`**: Visual indicator of quiz progress
- **`components/Loader.jsx`**: Loading spinner with contextual messages



---

## 5. Screenshots / Screen Recording

<img width="1907" height="968" alt="Screenshot 2025-12-07 133837" src="https://github.com/user-attachments/assets/d39e084b-999b-4140-916d-7619fd19d606" />
<img width="1913" height="971" alt="Screenshot 2025-12-07 133857" src="https://github.com/user-attachments/assets/186bf223-598f-4738-93fe-1e865aca7747" />
<img width="1142" height="850" alt="Screenshot 2025-12-07 133944" src="https://github.com/user-attachments/assets/afe75092-b526-4b68-9c65-6a1935c5f881" />
<img width="1489" height="869" alt="Screenshot 2025-12-07 134012" src="https://github.com/user-attachments/assets/aed690ee-cba3-47ca-a6cd-9975cf344c02" />
<img width="1284" height="861" alt="Screenshot 2025-12-07 134235" src="https://github.com/user-attachments/assets/d6fbc80b-e830-4e6d-a117-f6e28e6c4e0c" />
<img width="1350" height="873" alt="Screenshot 2025-12-07 134306" src="https://github.com/user-attachments/assets/b127620d-6d9d-47c4-bedf-1b6d3ae464bb" />


---

## 6. Known Issues / Improvements

### Known Issues:
1. **Environment Variable Handling**: The code uses `process.env.API_KEY` which may not work directly with Vite. Should use `import.meta.env.VITE_GEMINI_API_KEY` or configure build tools properly.
2. **No Error Recovery for Feedback**: If feedback generation fails, it falls back to a generic message, but there's no retry mechanism like quiz generation has.
3. **Limited Topic Selection**: Only 6 predefined topics. No option for custom user-input topics.


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



---

## 7. Bonus Work

### Dark Mode
- Full dark mode implementation with smooth transitions
- Theme preference persisted in localStorage


### UI/UX Polish
- **Smooth Animations**: Fade-in effects for screen transitions
- **Hover Effects**: Interactive feedback on buttons and topic cards
