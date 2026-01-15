// import { GoogleGenerativeAI } from "@google/generative-ai";
// import fs from "fs";
// import path from "path";
// import PdfData from "../models/pdfData.js";
// import dotenv from "dotenv";
// import axios from "axios";
// import { PDFDocument } from "pdf-lib";

// dotenv.config();

// // Initialize Gemini client
// const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export async function uploadPdf(req, res) {
//   try {
//     const file = req.file;
//     const { question, email } = req.body;

//     // ✅ Validate input
//     if (!file || !question || !email) {
//       return res.status(400).json({
//         message: "PDF file, question and email are required"
//       });
//     }

//     const pdfPath = path.join(file.destination, file.filename);

//     if (!fs.existsSync(pdfPath)) {
//       return res.status(400).json({ message: "Uploaded file not found" });
//     }

//     const pdfBytes = fs.readFileSync(pdfPath);

//     // ✅ Check page count
//     const pdfDoc = await PDFDocument.load(pdfBytes);
//     const pageCount = pdfDoc.getPageCount();

//     if (pageCount > 1000) {
//       return res.status(400).json({
//         message: "PDF exceeds 1000-page limit"
//       });
//     }

//     const base64Data = Buffer.from(pdfBytes).toString("base64");

//     let answer = "AI service is temporarily unavailable. Please try again later.";

//     // ✅ SAFE Gemini call (won't crash server)
//     try {
//       const model = ai.getGenerativeModel({
//         model: "gemini-2.0-flash" // ✅ FREE + STABLE
//       });

//       const result = await model.generateContent([
//         {
//           inlineData: {
//             mimeType: "application/pdf",
//             data: base64Data
//           }
//         },
//         {
//           text: `Answer the question based on this document:\n\n${question}`
//         }
//       ]);

//       answer = result.response.text();
//     } catch (aiError) {
//       console.error("Gemini error:", aiError.message);
//     }

//     // ✅ Save to MongoDB
//     const saved = await PdfData.create({
//       filename: file.originalname,
//       question,
//       answer
//     });

//     // ✅ Optional n8n webhook
//     if (process.env.N8N_WEBHOOK_URL) {
//       try {
//         await axios.post(process.env.N8N_WEBHOOK_URL, {
//           email,
//           question,
//           answer,
//           filename: file.originalname
//         });
//       } catch (err) {
//         console.error("n8n webhook failed");
//       }
//     }

//     // ✅ Final response
//     return res.json({
//       success: true,
//       answer,
//       id: saved._id
//     });

//   } catch (err) {
//     console.error("SERVER ERROR:", err);
//     return res.status(500).json({
//       message: "Internal server error"
//     });
//   }
// }


import OpenAI from "openai";
import fs from "fs";
import path from "path";
import PdfData from "../models/pdfData.js";
import dotenv from "dotenv";
import axios from "axios";
import pdfParse from "pdf-parse";

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function uploadPdf(req, res) {
  try {
    const file = req.file;
    const { question, email } = req.body;

    // ✅ Validate input
    if (!file || !question || !email) {
      return res.status(400).json({
        message: "PDF file, question and email are required"
      });
    }

    const pdfPath = path.join(file.destination, file.filename);

    if (!fs.existsSync(pdfPath)) {
      return res.status(400).json({ message: "Uploaded file not found" });
    }

    const pdfBuffer = fs.readFileSync(pdfPath);

    // ✅ Extract text from PDF
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim().length === 0) {
      return res.status(400).json({
        message: "Unable to extract text from PDF"
      });
    }

    let answer = "AI service is temporarily unavailable. Please try again later.";

    // ✅ SAFE OpenAI call
    try {
      const response = await openai.responses.create({
        model: "gpt-4.1-mini", // ✅ Fast + affordable
        input: [
          {
            role: "system",
            content: "You are a helpful assistant that answers questions strictly based on the provided document."
          },
          {
            role: "user",
            content: `Document content:\n${pdfText}\n\nQuestion:\n${question}`
          }
        ]
      });

      answer = response.output_text;
    } catch (aiError) {
      console.error("OpenAI error:", aiError.message);
    }

    // ✅ Save to MongoDB
    const saved = await PdfData.create({
      filename: file.originalname,
      question,
      answer
    });

    // ✅ Optional n8n webhook
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await axios.post(process.env.N8N_WEBHOOK_URL, {
          email,
          question,
          answer,
          filename: file.originalname
        });
      } catch (err) {
        console.error("n8n webhook failed");
      }
    }

    // ✅ Final response
    return res.json({
      success: true,
      answer,
      id: saved._id
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
