import React, { useState } from "react";
import axios from "axios";

function App() {
  // State variables to store form data
  const [email, setEmail] = useState(""); 
  const [pdf, setPdf] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation  
    if (!pdf || !question || !email) {
      alert("Please provide PDF, question and email");
      return;
    }

  // Prepare form data
    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("question", question);
    formData.append("email", email);

    // Send request to backend
  
    try {
      // Always use environment variable (set in .env.development or .env.production)
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      
      const res = await axios.post(`${API_BASE_URL}/api/pdf/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    
      // Store the answer returned by the server
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      alert("Error uploading or getting response");
    }
    
    
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          PDF AI Powered Document Orchestrator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="file"
            accept="application/pdf"
            onChange={e => setPdf(e.target.files[0])}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          />

          <input
            type="text"
            placeholder="Enter your question"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Ask
          </button>
        </form>

        {answer && (
          <div className="mt-6 p-5 bg-green-100 border border-green-300 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-green-700">Answer:</h2>
            <p className="text-gray-800">{answer}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
