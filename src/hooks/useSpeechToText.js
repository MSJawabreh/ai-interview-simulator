import { useState, useRef } from 'react'

function useSpeechToText() {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  const startListening = (onResult, onInterimResult) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Try Chrome or Edge.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript)
      }
      if (onInterimResult) {
        onInterimResult(interimTranscript)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
    recognitionRef.current = recognition
    setIsListening(true)
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  return { isListening, startListening, stopListening }
}

export default useSpeechToText