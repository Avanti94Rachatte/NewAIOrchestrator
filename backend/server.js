import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";  
import pdfRoutes from "./routes/pdfRoutes.js";

dotenv.config();
const app = express();

// Enable CORS to allow frontend (React) to access backend
//https://new-ai-orchestrator-frontend.vercel.app
app.use(cors(
  {
    origin: "https://new-ai-orchestrator-frontend.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
  }
));

// Allow backend to accept JSON request bodies
app.use(express.json());

// Route for handling all PDF-related endpoints
app.use("/api/pdf", pdfRoutes);

// Connect DB if using
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI

)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.error("MongoDB error:", e));
}

// Start server on defined port (default: 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
