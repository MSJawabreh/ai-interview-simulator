import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { API_URL } from '../config'

function MyInterviewsPage() {
  const navigate = useNavigate()
  const [interviews, setInterviews] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/interviews`)
      .then((res) => res.json())
      .then((data) => setInterviews(data))
      .catch((err) => console.error('Failed to load interviews:', err))
  }, [])

  const getAverage = (results) => (
    (results.reduce((total, r) => total + r.score, 0) / results.length).toFixed(1)
  )

  const handleDelete = (id) => {
    fetch(`${API_URL}/interviews/${id}`, { method: 'DELETE' })
      .then(() => setInterviews(interviews.filter((interview) => interview.id !== id)))
      .catch((err) => console.error('Failed to delete interview:', err))
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

  fetch(`${API_URL}/interviews/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: editValue })
  })
    .then((res) => res.json())
    .then((updatedInterview) => {
      setInterviews(interviews.map((interview) =>
        interview.id === id ? updatedInterview : interview
      ))
    })
    .catch((err) => console.error('Failed to rename interview:', err))

  setEditingId(null)
}

  const handleClearAll = () => {
    Promise.all(interviews.map((interview) =>
      fetch(`${API_URL}/interviews/${interview.id}`, { method: 'DELETE' })
    )).then(() => setInterviews([]))
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
          <p>No interviews yet. Create one to get started.</p>
        )}

        {interviews.map((interview) => (
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
              {new Date(interview.created_at).toLocaleString()} · Average score: {getAverage(interview.results)} / 10
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