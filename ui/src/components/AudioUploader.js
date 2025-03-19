import React, { useState } from "react";
import axios from "axios";

const AudioUploader = ({ onUploadComplete }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError(""); // Clear previous errors
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file!");
            return;
        }

        const formData = new FormData();
        formData.append("audio", file);
        setUploading(true);
        setError("");  

        try {
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("✅ API Response:", response.data);

            if (response.data && response.data.filename) {
                onUploadComplete(response.data); 
            } else {
                setError("Invalid response from server.");
                console.error("🚨 Unexpected response format:", response.data);
            }
        } catch (error) {
            console.error("❌ Upload failed:", error);

            if (error.response) {
                console.error("🔴 Server Error Response:", error.response.data);
                setError(`File upload failed: ${error.response.data.error || "Unknown error"}`);
            } else if (error.request) {
                console.error("🔴 No Response from Server:", error.request);
                setError("File upload failed: No response from server.");
            } else {
                console.error("🔴 Request Error:", error.message);
                setError("File upload failed: Error in request.");
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" accept="audio/*" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default AudioUploader;
