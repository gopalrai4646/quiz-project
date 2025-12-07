import { create } from 'zustand';
import { ScreenState } from '../types.js';

export const useQuizStore = create((set, get) => ({
  currentScreen: ScreenState.TOPICS,
  selectedTopic: null,
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  score: 0,
  feedback: null,
  isLoading: false,
  errorMsg: null,
  isDarkMode: localStorage.getItem('theme') === 'dark',

  setTopic: (topic) => set({ selectedTopic: topic }),
  
  setQuestions: (questions) => set({ 
    questions, 
    currentScreen: ScreenState.QUIZ, 
    isLoading: false,
    currentQuestionIndex: 0,
    userAnswers: {},
    score: 0
  }),

  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (msg) => set({ errorMsg: msg, currentScreen: msg ? ScreenState.ERROR : get().currentScreen }),

  answerQuestion: (qIdx, oIdx) => set((state) => {
    // Toggle: if the same option is already selected, unselect it
    const currentAnswer = state.userAnswers[qIdx];
    if (currentAnswer === oIdx) {
      // Unselect by removing the answer
      const newAnswers = { ...state.userAnswers };
      delete newAnswers[qIdx];
      return { userAnswers: newAnswers };
    } else {
      // Select the new option
      return { userAnswers: { ...state.userAnswers, [qIdx]: oIdx } };
    }
  }),

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    } else {
      get().calculateScore();
      set({ currentScreen: ScreenState.RESULT });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  calculateScore: () => {
    const { questions, userAnswers } = get();
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    set({ score });
  },

  setFeedback: (feedback) => set({ feedback }),

  resetQuiz: () => set({
    currentScreen: ScreenState.TOPICS,
    selectedTopic: null,
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: {},
    score: 0,
    feedback: null,
    errorMsg: null
  }),

  toggleDarkMode: () => set((state) => {
    const newMode = !state.isDarkMode;
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDarkMode: newMode };
  }),

  goToScreen: (screen) => set({ currentScreen: screen })
}));


