import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

function LeetCodePage() {
return (
  <Layout>
    <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '650px', margin: '0 auto' }}>
      <h1 style={{ color: '#1a1a2e' }}>Coding Interview Practice</h1>
      <p style={{ color: '#444', fontSize: '1.05rem', lineHeight: '1.5' }}>
        Real technical interviews often include algorithmic problems — think LeetCode-style questions
        about arrays, strings, trees, and complexity. This mode generates AI-driven coding questions
        and asks you to explain your approach in writing, just like talking through your thinking out
        loud in a real interview.
      </p>
      <p style={{ color: '#666', fontSize: '0.95rem' }}>
        This isn't a code editor — it's practice for the part that trips people up most: clearly
        explaining your reasoning, trade-offs, and time/space complexity under pressure.
      </p>

      <Link to="/coding-practice">
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
          Start Coding Practice
        </button>
      </Link>
    </div>
  </Layout>
)
}

export default LeetCodePage