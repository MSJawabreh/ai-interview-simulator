import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

function CVExplainerPage() {
return (
	<Layout>
		<div style={{ textAlign: 'center', padding: '2rem', maxWidth: '650px', margin: '0 auto' }}>
			<h1 style={{ color: '#1a1a2e' }}>CV-Based Interview Practice</h1>
			<p style={{ color: '#444', fontSize: '1.05rem', lineHeight: '1.5' }}>
				Upload your actual CV, and the AI reads it before generating your interview questions —
				asking you to explain specific projects, skills, and experience you've genuinely listed,
				instead of generic questions for the role.
			</p>
			<p style={{ color: '#666', fontSize: '0.95rem' }}>
				This is great practice for the moment in a real interview when someone points at your CV
				and says "tell me about this" — you want to be ready to explain your own work clearly and
				confidently.
			</p>
			<p style={{ color: '#888', fontSize: '0.85rem' }}>
				Supports PDF and DOCX files. Your CV is only used to generate questions and is never saved.
			</p>

			<Link to="/cv-practice">
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
					Upload Your CV
				</button>
			</Link>
		</div>
	</Layout>
)
}

export default CVExplainerPage