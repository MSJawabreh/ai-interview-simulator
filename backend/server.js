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
  const { role, numQuestions } = req.body

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Generate ${numQuestions} interview questions for a ${role} job interview. Return them as a plain numbered list, nothing else.`,
    })

    res.json({ questions: response.text })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to generate questions' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})