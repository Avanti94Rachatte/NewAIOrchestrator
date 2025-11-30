AI-Powered Document Orchestrator
MERN Stack + Gemini AI + n8n Email Automation

This project is an AI-Powered Document Orchestrator that allows users to:

✔ Upload a PDF
✔ Ask a question related to the PDF
✔ Get an AI-generated answer from Gemini
✔ Save the Q/A into MongoDB
✔ Trigger an email notification using n8n

It demonstrates PDF Parsing, LLM Automation, MERN Integration, and Workflow Automation.

Features
🔹 Frontend (React + Tailwind CSS)

Upload PDF

Enter question

Enter email

Display AI-generated answer

Clean UI using Tailwind CSS

🔹 Backend (Node.js + Express)

PDF upload with Multer

Page count validation

PDF → Base64 → Gemini ingestion

Save Q/A to MongoDB

Trigger n8n webhook

Error handling and logging

🔹 AI (Gemini 2.0 Flash)

Reads uploaded PDF

Answers user questions based on document content

🔹 Automation (n8n)

Receives webhook

Sends email to user with answer

Project Structure
backend/
│ server.js
│ .env
│
├── controllers/
│     └── pdfController.js
│
├── routes/
│     └── pdfRoutes.js
│
├── models/
│     └── PdfData.js
│
└── uploads/ (auto-created)

frontend/
│ App.jsx
│ main.jsx
│ index.css
│ tailwind.config.js

🔄 Workflow Overview
1. User uploads PDF & question
2. Backend:

Validates input

Reads PDF → Base64

Sends to Gemini

Gets answer

Saves to MongoDB

Sends webhook to n8n

3. n8n Workflow:

Reads webhook data

Sends email to the user with answer

4. Frontend displays final answer