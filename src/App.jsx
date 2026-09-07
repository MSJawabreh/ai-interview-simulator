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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateInterviewPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/my-interviews" element={<MyInterviewsPage />} />
        <Route path="/leetcode" element={<LeetCodePage />} />
        <Route path="/coding-practice" element={<CodingPracticePage />} />
        <Route path="/cv-explainer" element={<CVExplainerPage />} />
        <Route path="/cv-practice" element={<CVPracticePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App