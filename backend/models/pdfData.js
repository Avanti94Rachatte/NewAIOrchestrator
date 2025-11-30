

import mongoose from "mongoose";

// Define MongoDB schema for storing PDF question/answer data
const pdfDataSchema = new mongoose.Schema(
  {
    // Store the uploaded PDF filename
    // unique: ensures only one record per PDF filename
    filename: { type: String, required: true, unique: true }, // ensure one entry per filename
    
    // Store the user question
    question: { type: String, required: true },

    // Store the AI-generated answer
    answer: { type: String, required: true },
  },
  { 
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true }
);

// Custom static method to either update existing record by filename
// OR create a new one if it doesn't exist (upsert)
pdfDataSchema.statics.saveOrUpdate = async function (data) {
  return this.findOneAndUpdate(
    { filename: data.filename }, // match by filename
    data,                        // overwrite with new data
    { upsert: true, new: true }  // create if not exists
  );
};
// Export the model so it can be used in controllers
export default mongoose.model("PdfData", pdfDataSchema);
