import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FocusedLayout from '../components/FocusedLayout'
import { API_URL } from '../config'

function CreateInterviewPage() {
  const navigate = useNavigate()

  const [role, setRole] = useState('')
  const [numQuestions, setNumQuestions] = useState('3')
  const [interviewType, setInterviewType] = useState('Placement/Internship')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [cvFile, setCvFile] = useState(null)

const handleGenerateFromCV = async () => {
  if (!cvFile) {
    setErrorMessage('Please select a CV file first.')
    return
  }

  setIsLoading(true)
  setErrorMessage('')

  const formData = new FormData()
  formData.append('cv', cvFile)
  formData.append('role', role)
  formData.append('numQuestions', Number(numQuestions) || 3)
  formData.append('interviewType', interviewType)

  try {
    const response = await fetch(`${API_URL}/generate-questions-from-cv`, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong')
    }

    navigate('/interview', {
      state: { role, questions: data.questions, isNew: true }
    })
  } catch (err) {
    setErrorMessage('Failed to generate questions from CV. Try again in a moment.')
  } finally {
    setIsLoading(false)
  }
}

  const handleGenerate = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch(`${API_URL}/generate-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, numQuestions: Number(numQuestions) || 3, interviewType })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      navigate('/interview', {
        state: { role, questions: data.questions, isNew: true }
      })
    } catch (err) {
      setErrorMessage('Failed to generate questions. The AI service may be busy — try again in a moment.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FocusedLayout backTo="/">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#1a1a2e', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Create Interview</h1>

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
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Frontend Developer"
            style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #ccc', marginBottom: '1.2rem', boxSizing: 'border-box' }}
          />

          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Number of questions</label>
          <input
						type="number"
						value={numQuestions}
						onChange={(e) => setNumQuestions(e.target.value)}
						min="1"
						max="10"
						style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #ccc', marginBottom: '1.2rem', boxSizing: 'border-box' }}
					/>

          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Interview type</label>
          <select
            value={interviewType}
            onChange={(e) => setInterviewType(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #ccc', marginBottom: '1.5rem', boxSizing: 'border-box' }}
          >
            <option value="Placement/Internship">Placement / Internship</option>
            <option value="Graduate">Graduate Scheme</option>
            <option value="Experienced">Experienced Hire</option>
          </select>

          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>
            Or upload your CV (optional)
          </label>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setCvFile(e.target.files[0])}
            style={{ width: '100%', marginBottom: '1.2rem' }}
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
            Generate Interview
          </button>

          {cvFile && (
            <button
              onClick={handleGenerateFromCV}
              style={{
                width: '100%',
                marginTop: '0.8rem',
                background: 'white',
                color: '#5b3df5',
                border: '2px solid #5b3df5',
                padding: '0.8rem',
                borderRadius: '999px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Generate from CV Instead
            </button>
          )}
        </div>
      </div>
    </FocusedLayout>
  )
}

export default CreateInterviewPage