import { useLocation, Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import FocusedLayout from '../components/FocusedLayout'

function ResultsPage() {
  const location = useLocation()
  const { role, results, isNew } = location.state || {}
  const hasSaved = useRef(false)

  useEffect(() => {
    if (results && isNew && !hasSaved.current) {
      hasSaved.current = true
      const existing = JSON.parse(sessionStorage.getItem('interviews') || '[]')
      const newInterview = {
        id: crypto.randomUUID(),
        role,
        results,
        date: new Date().toLocaleString()
      }
      sessionStorage.setItem('interviews', JSON.stringify([...existing, newInterview]))
    }
  }, [])

  if (!results) {
    return (
      <FocusedLayout backTo="/">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No results found. Please complete an interview first.</p>
          <Link to="/" style={{ color: '#5b3df5', fontWeight: 'bold' }}>Go Home</Link>
        </div>
      </FocusedLayout>
    )
  }

  const averageScore = (
    results.reduce((total, r) => total + r.score, 0) / results.length
  ).toFixed(1)

  const getScoreColor = (score) => {
    if (score >= 7) return '#2e8b57'
    if (score >= 4) return '#d98c00'
    return '#c0392b'
  }

  return (
    <FocusedLayout backTo="/my-interviews">
      <div style={{ padding: '1rem 2rem', maxWidth: '650px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h1 style={{ color: '#1a1a2e', marginBottom: '0.3rem' }}>Interview Results</h1>
          <p style={{ color: '#666', marginTop: 0 }}>{role}</p>

          <div style={{
            width: '9rem',
            height: '9rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.75)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '1.5rem auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: `4px solid ${getScoreColor(averageScore)}`
          }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: getScoreColor(averageScore) }}>
              {averageScore}
            </span>
            <span style={{ color: '#666', fontSize: '0.85rem' }}>SCORE</span>
          </div>
        </div>

        {results.map((r, index) => (
          <div key={index} style={{
            backgroundColor: 'rgba(255,255,255,0.75)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.2rem',
            textAlign: 'left',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ margin: '0 0 0.6rem', color: '#1a1a2e', maxWidth: '80%' }}>
                Q{index + 1}: {r.question}
              </h3>
              <span style={{
                fontWeight: 'bold',
                color: getScoreColor(r.score),
                fontSize: '1.1rem',
                whiteSpace: 'nowrap'
              }}>
                {r.score}/10
              </span>
            </div>
            <p style={{ margin: '0 0 0.6rem', color: '#444' }}>
              <strong>Your answer:</strong> {r.answer}
            </p>
            <p style={{ margin: 0, color: '#444' }}>
              <strong>Feedback:</strong> {r.feedback}
            </p>
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/">
            <button style={{
              background: 'linear-gradient(135deg, #6d4df5, #4d7bf5)',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.6rem',
              borderRadius: '999px',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(93,80,245,0.35)',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Start New Interview
            </button>
          </Link>
        </div>
      </div>
    </FocusedLayout>
  )
}

export default ResultsPage