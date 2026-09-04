import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateInterviewPage() {
const navigate = useNavigate()

const [role, setRole] = useState('')
const [numQuestions, setNumQuestions] = useState(3)
const [interviewType, setInterviewType] = useState('Placement/Internship')
const [isLoading, setIsLoading] = useState(false)
const [errorMessage, setErrorMessage] = useState('')

const handleGenerate = async () => {
	setIsLoading(true)
	setErrorMessage('')

	try {
		const response = await fetch('http://localhost:3000/generate-questions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ role, numQuestions, interviewType })
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.error || 'Something went wrong')
		}

		navigate('/interview', {
			state: { role, questions: data.questions }
		})
	} catch (err) {
		setErrorMessage('Failed to generate questions. The AI service may be busy — try again in a moment.')
	} finally {
		setIsLoading(false)
	}
}

return (
	<div>
		<h1>Create Interview</h1>
		{isLoading && <p>Generating questions...</p>}
		{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

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

		<h2>Interview type:</h2>
		<select value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
			<option value="Placement/Internship">Placement / Internship</option>
			<option value="Graduate">Graduate Scheme</option>
			<option value="Experienced">Experienced Hire</option>
		</select>

		<br /><br />
		<button onClick={handleGenerate}>Generate Interview</button>
	</div>
)
}

export default CreateInterviewPage