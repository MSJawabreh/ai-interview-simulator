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

const pool = require('./db')

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({ success: true, time: result.rows[0] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Save a new interview
app.post('/interviews', async (req, res) => {
  const { role, results } = req.body

  try {
    const result = await pool.query(
      'INSERT INTO interviews (role, results) VALUES ($1, $2) RETURNING *',
      [role, JSON.stringify(results)]
    )
    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to save interview' })
  }
})

// Get all interviews
app.get('/interviews', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM interviews ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch interviews' })
  }
})

// Delete an interview
app.delete('/interviews/:id', async (req, res) => {
  const { id } = req.params

  try {
    await pool.query('DELETE FROM interviews WHERE id = $1', [id])
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete interview' })
  }
})

const multer = require('multer')
const pdfParse = require('pdf-parse')
const mammoth = require('mammoth')

const upload = multer({ storage: multer.memoryStorage() })

app.post('/generate-questions-from-cv', upload.single('cv'), async (req, res) => {
  const { role, numQuestions, interviewType } = req.body

  if (!req.file) {
    return res.status(400).json({ error: 'No CV file uploaded' })
  }

  try {
    let cvText = ''

    if (req.file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(req.file.buffer)
      cvText = pdfData.text
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer })
      cvText = result.value
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or DOCX.' })
    }

    cvText = cvText.slice(0, 4000)

    const response = await generateWithRetry(
      `You are an interviewer. Here is the candidate's CV:\n\n${cvText}\n\nGenerate ${numQuestions} interview questions for a ${interviewType} ${role} job interview. Base at least some questions on specific projects, skills, or experience mentioned in the CV above. Return ONLY a JSON array of strings, with no extra text, no markdown formatting. Example: ["question 1", "question 2"]`
    )

    const cleanedText = response.text.replace(/```json|```/g, '').trim()
    const questionsArray = JSON.parse(cleanedText)
    res.json({ questions: questionsArray })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to generate questions from CV' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})