import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div style={{
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			zIndex: 100,
			height: '4rem',
			boxSizing: 'border-box',
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			backgroundColor: 'rgba(255,255,255,0.7)',
			borderRadius: '1rem',
			padding: '0 1.5rem',
			margin: '1rem',
		}}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
        <div style={{
          backgroundColor: '#5b3df5',
          color: 'white',
          fontWeight: 'bold',
          width: '2.2rem',
          height: '2.2rem',
          borderRadius: '0.6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          AI
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 'bold' }}>Interview Simulator</div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>AI-powered practice</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <Link to="/" style={{ color: '#333', textDecoration: 'none' }}>Home</Link>
        <Link to="/my-interviews" style={{ color: '#333', textDecoration: 'none' }}>My Interviews</Link>
        <Link to="/leetcode" style={{ color: '#333', textDecoration: 'none' }}>Coding Practice</Link>
      </div>

      <Link to="/create">
        <button style={{
          backgroundColor: '#5b3df5',
          color: 'white',
          border: 'none',
          padding: '0.6rem 1.2rem',
          borderRadius: '999px',
          cursor: 'pointer'
        }}>
          Create Interview
        </button>
      </Link>
    </div>
  )
}

export default Navbar