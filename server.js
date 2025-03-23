const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"], 
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const chordsData = JSON.parse(fs.readFileSync("chords.json", "utf8"));
const songs = JSON.parse(fs.readFileSync("songs.json", "utf8"));

app.use("/chords", express.static(path.join(__dirname, "chords")));

app.post("/upload", upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const expectedChords = {
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

app.get("/search-song/:song", (req, res) => {
    const songQuery = req.params.song.toLowerCase();
    
    const matchedSong = Object.keys(songs).find(song => song.toLowerCase().includes(songQuery));

    if (matchedSong) {
        const songDetails = songs[matchedSong];

        const formattedChords = songDetails.chords.map(item => ({
            timestamp: item.timestamp,
            chord: item.chord,
            diagram: chordsData[item.chord] ? `/chords/${item.chord}.png` : null
        }));

        res.json({
            song: songDetails.song,
            sections: songDetails.sections,
            chords: formattedChords
        });
    } else {
        res.status(404).json({ message: "Song not found in our database." });
    }
});

app.get("/chords/:song", (req, res) => {
    const songName = req.params.song.toLowerCase();
    console.log(`Received request for song: ${songName}`);

    if (songs[songName]) {
        const songData = songs[songName];

        songData.chords = songData.chords.map(chord => ({
            ...chord,
            diagram: chordsData[chord.chord] ? `/chords/${chord.chord}.png` : null
        }));

        res.json(songData);
    } else {
        res.status(404).json({ message: "Song not found." });
    }
});

app.get("/", (req, res) => {
    res.send("AI Guitar Tutor Backend is Running 🚀");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
