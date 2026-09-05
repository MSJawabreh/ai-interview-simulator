import Navbar from './Navbar'

function Layout({ children }) {
	return (
		<div style={{
			minHeight: '100vh',
			width: '100%',
			background: 'linear-gradient(135deg, #d8c9f0, #c8e8e8)',
		}}>
			<Navbar />
			<div style={{ paddingTop: '6rem' }}>
				{children}
			</div>
		</div>
	)
}

export default Layout