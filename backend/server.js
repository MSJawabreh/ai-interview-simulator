const cors = require('cors')

require('dotenv').config()
const express = require('express')
const { GoogleGenAI } = require('@google/genai')

const app = express()
app.use(cors())
app.use(express.json())
const PORT = 3000

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

async function generateWithRetry(prompt, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      })
    } catch (error) {
      const isOverloaded = error.status === 503
      const isLastAttempt = attempt === maxRetries

      if (isOverloaded && !isLastAttempt) {
        console.log(`Gemini overloaded, retrying... (attempt ${attempt + 1})`)
        await new Promise(resolve => setTimeout(resolve, 1500))
      } else {
        throw error
      }
    }
  }
}

app.get('/', (req, res) => {
  res.send('Backend is running!')
})

app.post('/generate-questions', async (req, res) => {
  const { role, numQuestions, interviewType } = req.body

  try {
    const response = await generateWithRetry(
    `Generate ${numQuestions} interview questions for a ${interviewType} ${role} job interview. Keep the difficulty and expectations appropriate for a ${interviewType} candidate. Return ONLY a JSON array of strings, with no extra text, no markdown formatting. Example: ["question 1", "question 2"]`
    )

    const cleanedText = response.text.replace(/```json|```/g, '').trim()
    const questionsArray = JSON.parse(cleanedText)
    res.json({ questions: questionsArray })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to generate questions' })
  }
})

app.post('/evaluate-answer', async (req, res) => {
  const { role, question, answer } = req.body

  try {
    const response = await generateWithRetry(
  `You are an interview coach evaluating a candidate for the role of "${role}".

Question: "${question}"
Candidate's answer: "${answer}"

Give the candidate a score from 1 to 10 and 2-3 sentences of constructive feedback.
Return ONLY a JSON object in this exact shape, with no extra text, no markdown formatting: {"score": <number>, "feedback": "<string>"}`
)

    const cleanedText = response.text.replace(/```json|```/g, '').trim()
    const evaluation = JSON.parse(cleanedText)
    res.json(evaluation)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to evaluate answer' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})