import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import pdfRoutes from "./routes/pdfRoutes.js";

dotenv.config();
const app = express();

// Enable CORS to allow your Vercel frontend(s) to access backend
app.use(cors({
  origin: [
    "https://new-ai-orchestrator-frontend.vercel.app", // stable
    /\.vercel\.app$/                                   // all previews
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

// Allow backend to accept JSON request bodies
app.use(express.json());

// Route for handling all PDF-related endpoints
// Full path will be: /api/pdf/upload
app.use("/api/pdf", pdfRoutes);

// Connect to MongoDB if URI is provided
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((e) => console.error("MongoDB error:", e));
}

// ✅ Use only process.env.PORT (Render injects this automatically)
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
