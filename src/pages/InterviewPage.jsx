import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FocusedLayout from '../components/FocusedLayout'
import { API_URL } from '../config'
import useSpeechToText from '../hooks/useSpeechToText'
import { getAuthHeaders } from '../auth'


function InterviewPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const { role, questions } = location.state || {}

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [results, setResults] = useState([])
  const [isEvaluating, setIsEvaluating] = useState(false)
  const { isListening, startListening, stopListening } = useSpeechToText()
  const [interimText, setInterimText] = useState('')

const handleMicClick = () => {
  if (isListening) {
    stopListening()
    setInterimText('')
  } else {
    startListening(
      (finalTranscript) => {
        setAnswer((prev) => (prev ? prev + ' ' + finalTranscript : finalTranscript))
        setInterimText('')
      },
      (interim) => {
        setInterimText(interim)
      }
    )
  }
}

  if (!questions) {
    return (
      <FocusedLayout backTo="/create">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No interview data found. Please start from the Create Interview page.</p>
        </div>
      </FocusedLayout>
    )
  }

const handleNext = async () => {
  setIsEvaluating(true)

  const currentQuestion = questions[currentQuestionIndex]

  try {
    const response = await fetch(`${API_URL}/evaluate-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ role, question: currentQuestion, answer })
    })

      const evaluation = await response.json()

      if (!response.ok) {
        throw new Error(evaluation.error || 'Failed to evaluate answer')
      }

      const newResults = [...results, {
        question: currentQuestion,
        answer: answer,
        score: evaluation.score,
        feedback: evaluation.feedback
      }]

      setResults(newResults)
      setAnswer('')

      if (currentQuestionIndex + 1 >= questions.length) {
        navigate('/results', { state: { role, results: newResults, isNew: true } })
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }
    } catch (err) {
      alert('Failed to evaluate answer. Please try again.')
    } finally {
      setIsEvaluating(false)
    }
  }

  const isLastQuestion = currentQuestionIndex + 1 >= questions.length

  return (
    <FocusedLayout backTo="/create">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem 2rem'
      }}>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.75)',
          borderRadius: '1rem',
          padding: '2rem',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'left',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          boxSizing: 'border-box'
        }}>
          <p style={{ color: '#6d4df5', fontWeight: 'bold', margin: '0 0 0.3rem' }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <h1 style={{ color: '#1a1a2e', fontSize: '1.6rem', marginTop: 0 }}>{role}</h1>
          <p style={{ fontSize: '1.15rem', color: '#333' }}>{questions[currentQuestionIndex]}</p>

          <textarea
            value={isListening ? (answer ? answer + ' ' + interimText : interimText) : answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            rows={6}
            style={{
              width: '100%',
              padding: '0.8rem',
              borderRadius: '0.6rem',
              border: '1px solid #ccc',
              fontSize: '1rem',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              marginTop: '1rem'
            }}
          />

          <button
            onClick={handleMicClick}
            type="button"
            style={{
              marginTop: '0.8rem',
              background: isListening ? '#c0392b' : 'white',
              color: isListening ? 'white' : '#5b3df5',
              border: '2px solid #5b3df5',
              padding: '0.6rem 1.2rem',
              borderRadius: '999px',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            {isListening ? '⏹ Stop Recording' : '🎤 Speak Answer'}
          </button>

          <button
            onClick={handleNext}
            disabled={isEvaluating}
            style={{
              width: '100%',
              marginTop: '1.2rem',
              background: isEvaluating ? '#a8a8a8' : 'linear-gradient(135deg, #6d4df5, #4d7bf5)',
              color: 'white',
              border: 'none',
              padding: '0.8rem',
              borderRadius: '999px',
              fontSize: '1rem',
              cursor: isEvaluating ? 'default' : 'pointer',
              boxShadow: isEvaluating ? 'none' : '0 4px 12px rgba(93,80,245,0.35)',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => !isEvaluating && (e.target.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            {isEvaluating ? 'Evaluating...' : (isLastQuestion ? 'Finish Interview' : 'Next Question')}
          </button>
        </div>
      </div>
    </FocusedLayout>
  )
}

export default InterviewPage