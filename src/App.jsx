import { useState } from 'react'

function App() {
  const [role, setRole] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')

  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [numQuestions, setNumQuestions] = useState(3)

  if (!selectedRole) {
    return (
      <div>
        <h1>AI Interview Simulator</h1>
        <p>Practice interviews with AI.</p>
        {isLoading && <p>Generating questions...</p>}
        <h2>Enter a role:</h2>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Frontend Developer"
        />

        <h2>How many questions?</h2>
        <input
          type="number"
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          min="1"
          max="10"
        />

        <button onClick={async () => {
          setIsLoading(true)
          setSelectedRole(role)

          const response = await fetch('http://localhost:3000/generate-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: role, numQuestions: numQuestions })
          })

          const data = await response.json()
          const questionList = data.questions.split('\n').filter(q => q.trim() !== '')

          setQuestions(questionList)
          setIsLoading(false)
        }}>
          Start Interview
        </button>
      </div>
    )
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div>
        <h1>Interview Complete!</h1>
        <p>You answered {questions.length} questions for the {selectedRole} role.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Interview: {selectedRole}</h1>
      <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
      <h2>{questions[currentQuestionIndex]}</h2>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        rows={5}
        cols={50}
      />
      <br />
      <button onClick={() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setAnswer('')
      }}>
        Next Question
      </button>
    </div>
  )
}

export default App