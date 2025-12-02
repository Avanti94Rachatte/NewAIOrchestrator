// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";  
// import pdfRoutes from "./routes/pdfRoutes.js";

// dotenv.config();
// const app = express();

// // Enable CORS to allow frontend (React) to access backend
// //https://new-ai-orchestrator-frontend.vercel.app
// app.use(cors(
//   {
//     origin: "https://new-ai-orchestrator-frontend.vercel.app",
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// ));

// // Allow backend to accept JSON request bodies
// app.use(express.json());

// // Route for handling all PDF-related endpoints
// app.use("/api/pdf", pdfRoutes);

// // Connect DB if using
// if (process.env.MONGO_URI) {
//   mongoose.connect(process.env.MONGO_URI

// )
//   .then(() => console.log("MongoDB connected"))
//   .catch((e) => console.error("MongoDB error:", e));
// }

// // Start server on defined port (default: 5000)
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));



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
    "https://new-ai-orchestrator-frontend.vercel.app",
    "https://new-ai-orchestrator-frontend-9vc0msvou.vercel.app" // include preview deployment too
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

// Allow backend to accept JSON request bodies
app.use(express.json());

// Route for handling all PDF-related endpoints
// This means full path will be: /api/pdf/upload
app.use("/api/pdf", pdfRoutes);

// Connect to MongoDB if URI is provided
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((e) => console.error("MongoDB error:", e));
}

// Start server on defined port (default: 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
