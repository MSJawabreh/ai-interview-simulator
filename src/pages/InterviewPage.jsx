import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function InterviewPage() {
const location = useLocation()
const navigate = useNavigate()

const { role, questions } = location.state || {}

const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
const [answer, setAnswer] = useState('')

if (!questions) {
	return (
		<div>
			<p>No interview data found. Please start from the Create Interview page.</p>
		</div>
	)
}

if (currentQuestionIndex >= questions.length) {
	return (
		<div>
			<h1>Interview Complete!</h1>
			<p>You answered {questions.length} questions for the {role} role.</p>
		</div>
	)
}

return (
	<div>
		<h1>Interview: {role}</h1>
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

export default InterviewPage