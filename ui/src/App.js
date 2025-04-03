import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import SearchSong from "./SearchSong";
import BeginnerGuide from "./pages/BeginnerGuide"; // ✅ Import Beginner Guide Page

function App() {
  const [file, setFile] = useState(null);
  const [uploadData, setUploadData] = useState(null);
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [newSong, setNewSong] = useState({ name: "", chords: "" });
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError("");
  };

  // Upload selected file
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setUploadData(data);
    } catch (err) {
      setError("Upload error: " + err.message);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Upload recorded audio
  const uploadRecordedAudio = async () => {
    if (!audioURL) {
      setError("No recording found. Please record an audio first.");
      return;
    }

    const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("📥 Received Data from Server:", data);
      setUploadData(data);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload error: " + err.message);
    }
  };

  // Add new song (Admin Panel)
  const handleAddSong = async () => {
    if (!newSong.name || !newSong.chords) {
      setError("Please enter both song name and chords.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/add-song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSong),
      });

      if (!response.ok) {
        throw new Error("Failed to add song.");
      }

      setNewSong({ name: "", chords: "" });
      alert("🎵 Song added successfully!");
    } catch (err) {
      setError("Error adding song: " + err.message);
    }
  };

  return (
    <Router>
      <div className="App">
        <h1 className="App-header">🎸 AI Guitar Tutor</h1>

        {/* 🔗 Navbar */}
         <nav className="navbar">
      <Link to="/" className="nav-link">🏠 Home</Link>
      <Link to="/beginner-guide" className="nav-link">📖 Beginner's Guide</Link>
    </nav>

        <Routes>
          {/* 🎵 Home Page with Features */}
          <Route path="/" element={
  <div className="home-container">
    
    {/* 🎵 Song Search Section */}
    <div className="section-container">
      <SearchSong />
    </div>

    {/* 📤 Audio Upload Section */}
    <div className="section-container">
      <h2>📤 Upload Audio File</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {error && <p className="error-message">❌ {error}</p>}

      {uploadData && (
        <div className="uploaded-info">
          <h3>✅ Upload Successful!</h3>
          <p><strong>Filename:</strong> {uploadData.filename || "Unknown"}</p>
          <p><strong>Tempo:</strong> {uploadData.tempo || "N/A"}</p>
          <p><strong>Key:</strong> {uploadData.key || "N/A"}</p>
          <p><strong>Chords:</strong> {uploadData.chords ? uploadData.chords.join(", ") : "N/A"}</p>
        </div>
      )}
    </div>

    {/* 🎙️ Recording Section */}
    <div className="section-container">
      <h2>🎙️ Record and Upload</h2>
      <button onClick={startRecording} disabled={recording}>🎤 Start Recording</button>
      <button onClick={stopRecording} disabled={!recording}>⏹️ Stop Recording</button>

      {audioURL && (
        <div>
          <h3>🎧 Recorded Audio:</h3>
          <audio controls src={audioURL}></audio>
          <button onClick={uploadRecordedAudio}>📤 Upload Recording</button>
        </div>
      )}
    </div>

  </div>
} />


          {/* ✅ Beginner Guide Route */}
          <Route path="/beginner-guide" element={<BeginnerGuide />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
