import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreateInterviewPage from './pages/CreateInterviewPage'
import InterviewPage from './pages/InterviewPage'
import ResultsPage from './pages/ResultsPage'
import MyInterviewsPage from './pages/MyInterviewsPage'
import LeetCodePage from './pages/LeetCodePage'
import CodingPracticePage from './pages/CodingPracticePage'
import CVExplainerPage from './pages/CVExplainerPage'
import CVPracticePage from './pages/CVPracticePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/leetcode" element={<LeetCodePage />} />
        <Route path="/cv-explainer" element={<CVExplainerPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/create" element={<ProtectedRoute><CreateInterviewPage /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
        <Route path="/my-interviews" element={<ProtectedRoute><MyInterviewsPage /></ProtectedRoute>} />
        <Route path="/coding-practice" element={<ProtectedRoute><CodingPracticePage /></ProtectedRoute>} />
        <Route path="/cv-practice" element={<ProtectedRoute><CVPracticePage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App