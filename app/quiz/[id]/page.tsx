"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Timer, BookOpen, User } from "lucide-react"
import Navbar from "../../../src/components/Navbar"
import Link from "next/link"

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes in seconds
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Mock quiz data
  const quizData = {
    id: resolvedParams.id,
    title: "React Fundamentals Quiz",
    course: "Full Stack Web Development",
    description: "Test your knowledge of React fundamentals including components, props, state, and hooks.",
    duration: "30 minutes",
    totalQuestions: 15,
    passingScore: 70,
    instructor: "Dr. Sarah Johnson",
    questions: [
      {
        id: 1,
        question: "What is the correct way to create a React component?",
        type: "multiple-choice",
        options: [
          "function MyComponent() { return <div>Hello</div> }",
          "class MyComponent extends React.Component { render() { return <div>Hello</div> } }",
          "const MyComponent = () => { return <div>Hello</div> }",
          "All of the above"
        ],
        correctAnswer: 3
      },
      {
        id: 2,
        question: "Which hook is used to manage state in functional components?",
        type: "multiple-choice",
        options: [
          "useState",
          "useEffect",
          "useContext",
          "useReducer"
        ],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "What does JSX stand for?",
        type: "multiple-choice",
        options: [
          "JavaScript XML",
          "JavaScript Extension",
          "JavaScript Syntax",
          "JavaScript Expression"
        ],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "How do you pass data from a parent component to a child component?",
        type: "multiple-choice",
        options: [
          "Using state",
          "Using props",
          "Using context",
          "Using refs"
        ],
        correctAnswer: 1
      },
      {
        id: 5,
        question: "Which lifecycle method is called after a component is rendered?",
        type: "multiple-choice",
        options: [
          "componentDidMount",
          "componentWillMount",
          "componentDidUpdate",
          "componentWillUnmount"
        ],
        correctAnswer: 0
      }
    ]
  }

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmitQuiz()
    }
  }, [timeLeft, quizCompleted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmitQuiz = () => {
    setQuizCompleted(true)
    setShowResults(true)
  }

  const calculateScore = () => {
    let correct = 0
    quizData.questions.forEach((q, index) => {
      if (answers[index] === q.options[q.correctAnswer]) {
        correct++
      }
    })
    return Math.round((correct / quizData.questions.length) * 100)
  }

  const currentQ = quizData.questions[currentQuestion]

  if (showResults) {
    const score = calculateScore()
    const passed = score >= quizData.passingScore

    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div style={{ 
          position: 'relative',
          zIndex: 50,
          border: 'none',
          borderTop: 'none',
          paddingTop: 0,
          marginTop: 0,
          backgroundColor: '#111827'
        }}>
          <Navbar />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
              passed ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {passed ? (
                <CheckCircle size={48} className="text-white" />
              ) : (
                <AlertCircle size={48} className="text-white" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-4">
              {passed ? 'Congratulations!' : 'Quiz Completed'}
            </h1>
            
            <div className="text-6xl font-bold mb-4 text-purple-400">
              {score}%
            </div>
            
            <p className="text-gray-400 mb-6">
              {passed 
                ? `You passed the quiz! You scored ${score}% out of 100%`
                : `You scored ${score}%. You need ${quizData.passingScore}% to pass.`
              }
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">
                  {Object.keys(answers).length}
                </div>
                <div className="text-sm text-gray-400">Questions Answered</div>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">
                  {Math.round((Object.keys(answers).length / quizData.questions.length) * 100)}%
                </div>
                <div className="text-sm text-gray-400">Completion</div>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">
                  {formatTime(1800 - timeLeft)}
                </div>
                <div className="text-sm text-gray-400">Time Taken</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link
                href="/student-dashboard"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Back to Dashboard
              </Link>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                Review Answers
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div style={{ 
        position: 'relative',
        zIndex: 50,
        border: 'none',
        borderTop: 'none',
        paddingTop: 0,
        marginTop: 0,
        backgroundColor: '#111827'
      }}>
        <Navbar />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/student-dashboard"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{quizData.title}</h1>
              <p className="text-gray-400">Course: {quizData.course}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-red-400">
                <Timer size={24} />
                <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm text-gray-400">
                Question {currentQuestion + 1} of {quizData.questions.length}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Quiz Area */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(((currentQuestion + 1) / quizData.questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-6">
                  Question {currentQuestion + 1}: {currentQ.question}
                </h2>
                
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <label
                      key={index}
                      className={`block border rounded-lg p-4 cursor-pointer transition-colors ${
                        answers[currentQuestion] === option
                          ? 'border-purple-500 bg-purple-900/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        value={option}
                        checked={answers[currentQuestion] === option}
                        onChange={() => handleAnswerSelect(currentQuestion, option)}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion] === option
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-500'
                        }`}>
                          {answers[currentQuestion] === option && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-300">{option}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Previous
                </button>
                
                {currentQuestion === quizData.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Info */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Quiz Info</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock size={20} className="text-purple-400" />
                  <div>
                    <div className="font-medium">Duration</div>
                    <div className="text-sm text-gray-400">{quizData.duration}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <BookOpen size={20} className="text-purple-400" />
                  <div>
                    <div className="font-medium">Questions</div>
                    <div className="text-sm text-gray-400">{quizData.totalQuestions}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User size={20} className="text-purple-400" />
                  <div>
                    <div className="font-medium">Instructor</div>
                    <div className="text-sm text-gray-400">{quizData.instructor}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Navigator */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-2">
                {quizData.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      index === currentQuestion
                        ? 'bg-purple-600 text-white'
                        : answers[index]
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-600 rounded"></div>
                  <span className="text-gray-400">Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-600 rounded"></div>
                  <span className="text-gray-400">Current</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Instructions</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Read each question carefully</li>
                <li>• Select only one answer per question</li>
                <li>• You can navigate between questions</li>
                <li>• Quiz will auto-submit when time runs out</li>
                <li>• You need {quizData.passingScore}% to pass</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
