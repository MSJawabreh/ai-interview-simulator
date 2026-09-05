import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FocusedLayout from '../components/FocusedLayout'

function CodingPracticePage() {
const navigate = useNavigate()

const [topic, setTopic] = useState('Arrays & Hashing')
const [numQuestions, setNumQuestions] = useState('3')
const [isLoading, setIsLoading] = useState(false)
const [errorMessage, setErrorMessage] = useState('')

const handleGenerate = async () => {
  setIsLoading(true)
  setErrorMessage('')

  try {
    const response = await fetch('http://localhost:3000/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: `${topic} coding problems`,
        numQuestions: Number(numQuestions) || 3,
        interviewType: 'Coding/Algorithmic'
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong')
    }

    navigate('/interview', {
      state: { role: `${topic} Coding Practice`, questions: data.questions, isNew: true }
    })
  } catch (err) {
    setErrorMessage('Failed to generate questions. The AI service may be busy — try again in a moment.')
  } finally {
    setIsLoading(false)
  }
}

return (
	<FocusedLayout backTo="/leetcode">
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			textAlign: 'center'
		}}>
			<h1 style={{ color: '#1a1a2e', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Coding Practice</h1>

			{isLoading && <p>Generating questions...</p>}
			{errorMessage && <p style={{ color: '#c0392b' }}>{errorMessage}</p>}

			<div style={{
				backgroundColor: 'rgba(255,255,255,0.75)',
				borderRadius: '1rem',
				padding: '2rem',
				maxWidth: '400px',
				width: '100%',
				marginTop: '1.5rem',
				textAlign: 'left',
				boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
				boxSizing: 'border-box'
			}}>
				<label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Topic</label>
				<select
					value={topic}
					onChange={(e) => setTopic(e.target.value)}
					style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #ccc', marginBottom: '1.2rem', boxSizing: 'border-box' }}
				>
					<option value="Arrays & Hashing">Arrays & Hashing</option>
					<option value="Two Pointers">Two Pointers</option>
					<option value="Sliding Window">Sliding Window</option>
					<option value="Stacks">Stacks</option>
					<option value="Binary Search">Binary Search</option>
					<option value="Linked Lists">Linked Lists</option>
					<option value="Trees">Trees</option>
					<option value="Dynamic Programming">Dynamic Programming</option>
				</select>

				<label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Number of questions</label>
				<input
					type="number"
					value={numQuestions}
					onChange={(e) => setNumQuestions(e.target.value)}
					min="1"
					max="10"
					style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #ccc', marginBottom: '1.2rem', boxSizing: 'border-box' }}
				/>

				<button
					onClick={handleGenerate}
					style={{
						width: '100%',
						background: 'linear-gradient(135deg, #6d4df5, #4d7bf5)',
						color: 'white',
						border: 'none',
						padding: '0.8rem',
						borderRadius: '999px',
						fontSize: '1rem',
						cursor: 'pointer',
						boxShadow: '0 4px 12px rgba(93,80,245,0.35)',
						transition: 'transform 0.15s ease'
					}}
					onMouseEnter={(e) => e.target.style.transform = 'scale(1.03)'}
					onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
				>
					Generate Problems
				</button>
			</div>
		</div>
	</FocusedLayout>
)
}

export default CodingPracticePage