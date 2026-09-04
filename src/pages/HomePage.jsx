import { Link } from 'react-router-dom'

function HomePage() {
return (
  <div>
    <h1>AI Interview Simulator</h1>
    <p>Practice interviews with AI.</p>
    <Link to="/create">Create New Interview</Link>
  </div>
)
}

export default HomePage