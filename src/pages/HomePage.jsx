import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { isLoggedIn } from '../auth'

function HomePage() {
  return (
    <Layout>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 style={{ fontSize: '3rem', maxWidth: '700px', color: '#1a1a2e', lineHeight: '1.2' }}>
          Walk into your next interview with confidence
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#333', maxWidth: '600px' }}>
          Practice interviews with AI-generated questions tailored to your role, get instant feedback,
          and track your progress over time.
        </p>

        {isLoggedIn() ? (
          <Link to="/create">
            <button style={{
              background: 'linear-gradient(135deg, #6d4df5, #4d7bf5)',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.6rem',
              borderRadius: '999px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '1rem',
              boxShadow: '0 4px 12px rgba(93,80,245,0.35)',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Create New Interview
            </button>
          </Link>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Link to="/register">
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
                Sign Up Free
              </button>
            </Link>
            <Link to="/login">
              <button style={{
                background: 'white',
                color: '#5b3df5',
                border: '2px solid #5b3df5',
                padding: '0.8rem 1.6rem',
                borderRadius: '999px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}>
                Log In
              </button>
            </Link>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '1.5rem',
          marginTop: '3rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.6)',
            borderRadius: '1rem',
            padding: '1.5rem',
            maxWidth: '250px',
            textAlign: 'left',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <h3>Role-tuned questions</h3>
            <p>Every question is generated for your specific role and interview type.</p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.6)',
            borderRadius: '1rem',
            padding: '1.5rem',
            maxWidth: '250px',
            textAlign: 'left',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <h3>Real AI questions</h3>
            <p>Powered by Google Gemini, not a fixed question bank.</p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.6)',
            borderRadius: '1rem',
            padding: '1.5rem',
            maxWidth: '250px',
            textAlign: 'left',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <h3>Practice at your pace</h3>
            <p>Choose how many questions and what difficulty level fits you.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage