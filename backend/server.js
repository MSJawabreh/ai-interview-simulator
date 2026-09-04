const cors = require('cors')

require('dotenv').config()
const express = require('express')
const { GoogleGenAI } = require('@google/genai')

const app = express()
app.use(cors())
app.use(express.json())
const PORT = 3000

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

app.get('/', (req, res) => {
  res.send('Backend is running!')
})

app.post('/generate-questions', async (req, res) => {
  const { role, numQuestions, interviewType } = req.body

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Generate ${numQuestions} interview questions for a ${interviewType} ${role} job interview. Keep the difficulty and expectations appropriate for a ${interviewType} candidate. Return ONLY a JSON array of strings, with no extra text, no markdown formatting. Example: ["question 1", "question 2"]`,
    })

    const cleanedText = response.text.replace(/```json|```/g, '').trim()
    console.log('RAW AI RESPONSE:', cleanedText)
    console.log('TYPE AFTER FIRST PARSE:', typeof JSON.parse(cleanedText))
    const questionsArray = JSON.parse(cleanedText)
    res.json({ questions: questionsArray })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to generate questions' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})