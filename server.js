// Import required modules
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Middleware

// Allow requests from any origin (for development only)
app.use(cors({
    origin: "*", // Allow all origins (temporary fix)
    methods: ["GET", "POST"], 
    allowedHeaders: ["Content-Type"]
}));

// OR for better security, allow only specific origins
// app.use(cors({
//     origin: ["http://localhost:3000", "http://192.168.1.5:3000"], // Add both local and network IPs
//     methods: ["GET", "POST"], 
//     allowedHeaders: ["Content-Type"]
// }));app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Ensure the uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Store uploaded song's expected data
let expectedChords = null;

// Expanded song database with more chords & details


// API to upload audio file
app.post("/upload", upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Simulated chord extraction (Replace with real extraction logic)
        expectedChords = {
            filename: req.file.filename,
            tempo: "112.35 BPM",
            key: "C",
            chords: ["B", "C", "G"],
        };

        console.log("✅ File Uploaded:", expectedChords);
        res.json({ ...expectedChords, message: "File uploaded successfully" });
    } catch (err) {
        console.error("❌ Processing Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// API to search for a song and get its chords & details
app.get("/search-song/:song", (req, res) => {
    const songQuery = req.params.song.toLowerCase();
    
    // Read the songs.json file dynamically
    fs.readFile(path.join(__dirname, "songs.json"), "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error reading the song database" });
        }

        // Parse the JSON data
        const songDatabase = JSON.parse(data);

        // Find the song from the database
        const matchedSong = Object.keys(songDatabase).find(song => song.toLowerCase().includes(songQuery));

        if (matchedSong) {
            // Format the response to match the structure you need
            const songDetails = songDatabase[matchedSong];
            res.json({
                song: songDetails.song,
                sections: songDetails.sections,
                chords: songDetails.chords.map(item => ({
                    timestamp: item.timestamp,
                    chord: item.chord
                }))
            });
        } else {
            res.status(404).json({ message: "Song not found in our database." });
        }
    });
});



// Default Route
app.get("/", (req, res) => {
    res.send("AI Guitar Tutor Backend is Running 🚀");
});
const songs = JSON.parse(fs.readFileSync("songs.json", "utf8")); // Load songs

app.get("/chords/:song", (req, res) => {
    const songName = req.params.song.toLowerCase();
    console.log(`Received request for song: ${songName}`);

    if (songs[songName]) {
        res.json(songs[songName]);
    } else {
        res.status(404).json({ message: "Song not found." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
