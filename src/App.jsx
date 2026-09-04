import { useState } from 'react'

function App() {
  const [role, setRole] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')

  const questions = [
    "Tell me about yourself.",
    "What's a challenging bug you've fixed?",
    "Why do you want this role?"
  ]

  if (!selectedRole) {
    return (
      <div>
        <h1>AI Interview Simulator</h1>
        <p>Practice interviews with AI.</p>
        <h2>Enter a role:</h2>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Frontend Developer"
        />
        <button onClick={() => setSelectedRole(role)}>Start Interview</button>
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