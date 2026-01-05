import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import PdfData from "../models/pdfData.js";
import dotenv from "dotenv";
import axios from "axios";
import { PDFDocument } from "pdf-lib";
dotenv.config();

// FIXED Gemini client // Initialize Gemini AI client using API key from .env
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function uploadPdf(req, res) {
  try {
    const file = req.file;
    const { question, email } = req.body;

    // Validate request input
    if (!file || !question || !email) {
      return res.status(400).json({ message: "PDF file, email and question are required." });
    }

    // Build file path and read uploaded PDF file
    const pdfPath = path.join(file.destination, file.filename);
    const pdfBytes = fs.readFileSync(pdfPath);

    // Load PDF and check page count
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();

    // Reject very large PDFs (1000-page limit)
    if (pageCount > 1000) {
      return res.status(400).json({ message: "PDF exceeds 1000-page limit" });
    }

    // Convert full PDF to Base64 so Gemini can read it
    const base64Data = Buffer.from(pdfBytes).toString("base64");

    // Prepare content for Gemini model: PDF + text question
    const contents = [
      { inlineData: { mimeType: "application/pdf", data: base64Data } },
      { text: `Answer the question based on this document:\n\nQuestion: ${question}` }
    ];

    // call Gemini model
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(contents);

    // Extract AI-generated answer
    const answer = result.response?.text() || "No answer generated";

    // Save to DB
    const saved = await PdfData.create({
      filename: file.originalname,
      question,
      answer,
    });

    // Send data to n8n webhook (email automation)
    try {
      await axios.post(
        process.env.N8N_WEBHOOK_URL,{
          email,
          question,
          answer,
          filename: file.originalname,
        }
      );
    } catch (err) {
      console.error("n8n webhook error:", err);
    }

    // Send response back to frontend
    return res.json({ filename: file.originalname, question, answer, id: saved._id });

  } catch (err) {

    // If anything fails, return server error
    console.error("UploadPdf error:", err);
    return res.status(500).json({ message: "Server error", error: err.toString() });
  }
}
