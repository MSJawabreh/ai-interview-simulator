AI Interview Simulator

A full-stack web app for practicing job interviews with AI-generated questions, instant feedback, and persistent history — built to help prepare for real placement and graduate scheme interviews.

Live demo: not yet deployed Built by Mohammad Saleh Ahmad

What it does
Practice interviews — pick a role, an interview type (Placement/Internship, Graduate Scheme, Experienced Hire), and how many questions you want. Gemini generates real, relevant questions on the spot.
Answer by typing or speaking — built-in speech-to-text lets you answer out loud, with live transcription, the same way you'd talk through an answer in a real interview.
Instant AI feedback — every answer is scored out of 10 with specific, constructive feedback, not just a generic response.
Coding/algorithmic practice — a separate mode focused on LeetCode-style problems by topic (arrays, trees, dynamic programming, etc.), asking you to explain your approach and complexity in writing, the way you'd talk through a solution in a technical interview.
CV-based interviews — upload your actual CV (PDF or DOCX) and get questions built around your real projects and experience, not generic ones.
Accounts and history — sign up, log in, and every completed interview is saved to your account. Revisit, rename, or delete past sessions any time.
Tech stack
Layer	Technology
Frontend	React (Vite), React Router
Backend	Node.js, Express
Database	PostgreSQL
AI	Google Gemini API
Auth	JWT + bcrypt password hashing
File parsing	multer, pdf-parse, mammoth (CV uploads)
Speech	Browser Web Speech API
Project structure
ai-interview-simulator/
├── backend/
│   ├── server.js          — Express app, all API routes
│   ├── db.js               — PostgreSQL connection pool
│   ├── schema.sql           — database table definitions
│   ├── middleware/
│   │   └── auth.js          — JWT verification middleware
│   └── .env.example          — required environment variables
├── src/
│   ├── pages/                — one component per route
│   ├── components/            — Layout, FocusedLayout, Navbar, ProtectedRoute
│   ├── hooks/
│   │   └── useSpeechToText.js  — speech recognition hook
│   ├── auth.js                — token storage helpers
│   └── config.js               — API base URL
Running it locally
1. Prerequisites
Node.js
PostgreSQL running locally
A Google Gemini API key
2. Set up the database
bash
psql -U postgres -c "CREATE DATABASE interview_simulator;"
psql -U postgres -d interview_simulator -f backend/schema.sql
3. Backend
bash
cd backend
npm install
cp .env.example .env   # then fill in your real values
node server.js
4. Frontend
bash
npm install
npm run dev

The app runs at http://localhost:5173, with the API at http://localhost:3000.

How the AI evaluation works

Both question generation and answer evaluation go through a shared retry helper that automatically retries on temporary Gemini overload (503 errors) with a short backoff, while failing fast on genuine errors like quota limits — so a brief AI hiccup doesn't break the user's session.

Security notes
Passwords are hashed with bcrypt before storage — never stored or returned in plain text.
All routes that touch user data or call the AI require a valid JWT, verified via middleware.
Every database query involving a user's data is scoped to their own user_id — one user cannot read, edit, or delete another user's interviews, enforced at the query level.
All SQL queries use parameterized placeholders, not string interpolation.
Real bugs and decisions worth knowing

Building this surfaced a handful of problems that weren't obvious from the outside, and the fixes changed how parts of the system are built.

A library's major version silently changed its entire API. npm install pdf-parse pulled in v2.4.5 by default — a full rewrite exposing a class-based API instead of the simple pdfParse(buffer) function the rest of the code (and most guides) assume. This produced a "pdfParse is not a function" error that looked at first like a PDF-vs-DOCX routing bug, since it only appeared on CV uploads. It wasn't related to routing at all — the fix was pinning the dependency to the older, stable pdf-parse@1.1.1. Any unpinned dependency install is a version-compatibility risk, not just a "does it install" one.

Completed interviews were duplicating on save. React's development mode intentionally runs useEffect twice per mount, and the save logic used Date.now() for a row's ID — two calls close enough together produced the same millisecond value, so two rows landed with identical IDs. Deleting one interview from the list deleted both. Fixed at two levels: crypto.randomUUID() for genuinely unique IDs, and a useRef flag (hasSaved.current) guarding the save so it only runs once regardless of how many times the effect itself fires.

Protecting a route on the backend isn't the whole fix. Adding requireAuth middleware to the question-generation and CV-upload routes was necessary — those routes call the paid Gemini API and were previously callable by anyone, logged in or not. But every frontend page calling those routes also needed its fetch calls updated to actually send the token. Two of four pages were updated in the same pass; the other two silently started failing with generic "AI service may be busy" errors that had nothing to do with Gemini. The lesson: a backend auth change and its matching frontend change are one unit of work, not two, and the way to catch a partial rollout is to actually click through the real user flow afterward, not just check the diff.

Why interviews.results is one JSONB column instead of a separate table. Each interview's per-question scores and feedback are stored as a single JSON blob rather than normalized into their own rows. The data is always read and written as one unit (a full completed interview), never queried by individual question — so the flexibility of a proper join was worth trading for the simplicity of one INSERT per interview and no schema migration every time a new field is added to a result.

Two different page layouts, chosen deliberately. Layout (full navbar) is used on pages meant for browsing — Home, My Interviews. FocusedLayout (a single "← Back" link) is used on task pages — Create Interview, the interview itself, Results — where a full navigation bar competing for attention doesn't fit a flow the user is meant to complete, not browse away from.

Known limitations / next steps
Not yet deployed — currently runs locally only.
Renaming an interview updates the database correctly, but the UI for it is a simple inline edit, not a polished modal.
No automated tests yet.
CV files are used once to generate questions and are never stored.
Why this project

Most interview prep tools give you a static question bank. This project explores what changes when the questions are real and personalized — generated from your actual CV, matched to the actual role and level you're applying for — and when feedback is instant and specific rather than generic. It was also a deliberate way to practice a full, real stack: routing, a genuine database with relationships, authentication done properly (hashed passwords, signed tokens, per-user data scoping), and integrating a third-party AI API with proper error handling — not just the parts that are easy to get right.