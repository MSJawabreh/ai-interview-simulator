import { Link } from 'react-router-dom'

function FocusedLayout({ children, backTo = '/' }) {
return (
	<div style={{
		minHeight: '100vh',
		width: '100%',
		background: 'linear-gradient(135deg, #d8c9f0, #c8e8e8)',
		padding: '2rem',
		boxSizing: 'border-box',
		overflowX: 'hidden'
	}}>
		<Link to={backTo} style={{
			color: '#5b3df5',
			textDecoration: 'none',
			fontWeight: 'bold',
			display: 'inline-block',
			marginBottom: '1rem'
		}}>
			← Back
		</Link>
		{children}
	</div>
)
}

export default FocusedLayout