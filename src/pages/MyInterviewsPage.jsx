import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function MyInterviewsPage() {
  const navigate = useNavigate()
  const [interviews, setInterviews] = useState(
    JSON.parse(sessionStorage.getItem('interviews') || '[]')
  )
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  const getAverage = (results) => (
    (results.reduce((total, r) => total + r.score, 0) / results.length).toFixed(1)
  )

  const saveInterviews = (updated) => {
    sessionStorage.setItem('interviews', JSON.stringify(updated))
    setInterviews(updated)
  }

  const handleDelete = (id) => {
    const updated = interviews.filter((interview) => interview.id !== id)
    saveInterviews(updated)
  }

  const startEditing = (interview) => {
    setEditingId(interview.id)
    setEditValue(interview.role)
  }

  const confirmEdit = (id) => {
    if (editValue.trim() === '') {
      setEditingId(null)
      return
    }
    const updated = interviews.map((interview) =>
      interview.id === id ? { ...interview, role: editValue } : interview
    )
    saveInterviews(updated)
    setEditingId(null)
  }

  const handleClearAll = () => {
    sessionStorage.removeItem('interviews')
    setInterviews([])
  }

  return (
    <Layout>
      <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: '#1a1a2e' }}>My Interviews</h1>
          {interviews.length > 0 && (
            <button
              onClick={handleClearAll}
              style={{
                background: 'none',
                border: '1px solid #c0392b',
                color: '#c0392b',
                padding: '0.4rem 0.9rem',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Clear All
            </button>
          )}
        </div>

        {interviews.length === 0 && (
          <p>No interviews yet this session. Create one to get started.</p>
        )}

        {interviews.slice().reverse().map((interview) => (
          <div
            key={interview.id}
            style={{
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: '1rem',
              padding: '1.2rem 1.5rem',
              marginBottom: '1rem',
              textAlign: 'left',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}
          >
            {editingId === interview.id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmEdit(interview.id)
                  if (e.key === 'Escape') setEditingId(null)
                }}
                onBlur={() => confirmEdit(interview.id)}
                autoFocus
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  padding: '0.3rem 0.5rem',
                  borderRadius: '0.4rem',
                  border: '1px solid #5b3df5',
                  width: '100%',
                  boxSizing: 'border-box',
                  marginBottom: '0.3rem'
                }}
              />
            ) : (
              <div
                onClick={() => navigate('/results', { state: { role: interview.role, results: interview.results, isNew: false } })}
                style={{ cursor: 'pointer' }}
              >
                <h3 style={{ margin: '0 0 0.3rem' }}>{interview.role}</h3>
              </div>
            )}

            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
              {interview.date} · Average score: {getAverage(interview.results)} / 10
            </p>

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.8rem' }}>
              <button
                onClick={() => startEditing(interview)}
                style={{
                  background: 'none',
                  border: '1px solid #ccc',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Rename
              </button>
              <button
                onClick={() => handleDelete(interview.id)}
                style={{
                  background: 'none',
                  border: '1px solid #c0392b',
                  color: '#c0392b',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default MyInterviewsPage