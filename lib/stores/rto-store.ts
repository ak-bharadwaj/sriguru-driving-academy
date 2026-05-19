import { create } from 'zustand'

export interface RTOQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  topic: string
  signImage?: string
}

export interface QuizProgress {
  questions: RTOQuestion[]
  currentIndex: number
  userAnswers: Record<string, number> // questionId -> selectedIndex
  isFinished: boolean
}

interface RTOState {
  quizProgress: QuizProgress | null
  weakTopics: Record<string, number> // topicName -> failureCount
  practiceProgress: number // overall performance percentage (e.g. 0 to 100)
  
  // Actions
  startNewQuiz: (questions: RTOQuestion[]) => void
  submitAnswer: (questionId: string, answerIndex: number) => void
  nextQuestion: () => void
  prevQuestion: () => void
  finishQuiz: () => void
  resetQuiz: () => void
  recordWeakTopic: (topic: string) => void
  updatePracticeProgress: (progress: number) => void
}

export const useRTOStore = create<RTOState>()((set) => ({
  quizProgress: null,
  weakTopics: {},
  practiceProgress: 0,

  startNewQuiz: (questions) => set({
    quizProgress: {
      questions,
      currentIndex: 0,
      userAnswers: {},
      isFinished: false
    }
  }),

  submitAnswer: (questionId, answerIndex) => set((state) => {
    if (!state.quizProgress) return state
    
    const newAnswers = {
      ...state.quizProgress.userAnswers,
      [questionId]: answerIndex
    }

    return {
      quizProgress: {
        ...state.quizProgress,
        userAnswers: newAnswers
      }
    }
  }),

  nextQuestion: () => set((state) => {
    if (!state.quizProgress) return state
    const nextIndex = state.quizProgress.currentIndex + 1
    if (nextIndex >= state.quizProgress.questions.length) return state

    return {
      quizProgress: {
        ...state.quizProgress,
        currentIndex: nextIndex
      }
    }
  }),

  prevQuestion: () => set((state) => {
    if (!state.quizProgress) return state
    const prevIndex = state.quizProgress.currentIndex - 1
    if (prevIndex < 0) return state

    return {
      quizProgress: {
        ...state.quizProgress,
        currentIndex: prevIndex
      }
    }
  }),

  finishQuiz: () => set((state) => {
    if (!state.quizProgress) return state
    
    // Analyze weak topics based on wrong answers
    const newWeakTopics = { ...state.weakTopics }
    let correctCount = 0

    state.quizProgress.questions.forEach((q) => {
      const userAnswer = state.quizProgress?.userAnswers[q.id]
      if (userAnswer === q.correctIndex) {
        correctCount++
      } else if (userAnswer !== undefined) {
        newWeakTopics[q.topic] = (newWeakTopics[q.topic] || 0) + 1
      }
    })

    const scorePct = state.quizProgress.questions.length > 0
      ? Math.round((correctCount / state.quizProgress.questions.length) * 100)
      : 0

    return {
      weakTopics: newWeakTopics,
      practiceProgress: scorePct,
      quizProgress: {
        ...state.quizProgress,
        isFinished: true
      }
    }
  }),

  resetQuiz: () => set({ quizProgress: null }),

  recordWeakTopic: (topic) => set((state) => ({
    weakTopics: {
      ...state.weakTopics,
      [topic]: (state.weakTopics[topic] || 0) + 1
    }
  })),

  updatePracticeProgress: (progress) => set({ practiceProgress: progress })
}))
