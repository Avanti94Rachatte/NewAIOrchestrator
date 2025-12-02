import express from "express";
import multer from "multer";
import { uploadPdf } from "../controllers/pdfController.js";

const router = express.Router();

// Configure Multer for file uploads
const upload = multer({
    dest: "uploads/",   // folder where uploaded PDFs will be stored
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
  });

  // POST route to upload PDF
// upload.single("pdf") → "pdf" must match the frontend FormData key
router.post("/upload", upload.single("pdf"), uploadPdf);

// Export router so it can be used inside server.js
export default router;
