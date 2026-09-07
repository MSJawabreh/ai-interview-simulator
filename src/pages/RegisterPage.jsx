import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import FocusedLayout from '../components/FocusedLayout'
import { API_URL } from '../config'
import { saveToken, isLoggedIn } from '../auth'

function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/')
    }
  }, [])

const getPasswordStrength = () => {
  if (password.length === 0) return 0
  if (password.length < 8) return 1
  if (password.length < 12) return 2
  return 3
}

const strength = getPasswordStrength()
const strengthColors = ['#ccc', '#c0392b', '#d98c00', '#2e8b57']
const strengthLabels = ['', 'Too short (min 8)', 'Good', 'Strong']

const handleRegister = async () => {
  if (password.length < 8) {
    setErrorMessage('Password must be at least 8 characters')
    return
  }

  if (password !== confirmPassword) {
    setErrorMessage('Passwords do not match')
    return
  }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register')
      }

      saveToken(data.token)
      navigate('/')
    } catch (err) {
      setErrorMessage(err.message)
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
        <h1 style={{ color: '#1a1a2e', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Start Practicing Today</h1>
        <p style={{ color: '#666', maxWidth: '380px' }}>
          Free to use. Get AI-generated interview questions and instant feedback the moment you sign up.
        </p>

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
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #ccc', marginBottom: '1.2rem', boxSizing: 'border-box' }}
          />

          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #ccc', marginBottom: '0.4rem', boxSizing: 'border-box' }}
          />

          {password.length > 0 && (
            <div style={{ marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.3rem' }}>
                {[1, 2, 3].map((level) => (
                  <div key={level} style={{
                    height: '4px',
                    flex: 1,
                    borderRadius: '2px',
                    backgroundColor: strength >= level ? strengthColors[strength] : '#eee'
                  }} />
                ))}
              </div>
              <span style={{ fontSize: '0.75rem', color: strengthColors[strength] }}>
                {strengthLabels[strength]}
              </span>
            </div>
          )}

          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #ccc', marginBottom: '1.5rem', boxSizing: 'border-box' }}
          />

          <button
            onClick={handleRegister}
            disabled={isLoading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #6d4df5, #4d7bf5)',
              color: 'white',
              border: 'none',
              padding: '0.8rem',
              borderRadius: '999px',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(93,80,245,0.35)'
            }}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
            Already have an account? <Link to="/login" style={{ color: '#5b3df5', fontWeight: 'bold' }}>Log in</Link>
          </p>
        </div>
      </div>
    </FocusedLayout>
  )
}

export default RegisterPage