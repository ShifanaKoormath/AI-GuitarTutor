import React, { useState, useEffect, useRef } from "react";
import { PitchDetector } from "pitchy";
import WaveformVisualizer from "./WaveformVisualizer"; // Import visualizer component
import "./App.css";

const SearchSong = () => {
    const [songName, setSongName] = useState("");
    const [songDetails, setSongDetails] = useState(null);
    const [userChords, setUserChords] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState("");
    const [isListening, setIsListening] = useState(false);

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const intervalRef = useRef(null);
    const pitchDetectorRef = useRef(null);
    const handleSearch = async () => {
        if (!songName.trim()) {
            setError("Please enter a song name.");
            return;
        }
    
        setError("");
        setSongDetails(null);
        setFeedback("");
    
        try {
            const response = await fetch(`http://localhost:5000/search-song/${encodeURIComponent(songName)}`);
            const data = await response.json();
    
            if (response.ok) {
                // If chords are objects, extract the 'chord' property from each object
                const formattedChords = data.chords.map(chord => chord.chord); // Access the 'chord' property
    
                setSongDetails({
                    ...data,
                    chords: formattedChords
                });
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Failed to fetch song details. Try again.");
        }
    };
    
    
    // Start Microphone & Detect Chords
    const startListening = async () => {
        setIsListening(true);
        setUserChords([]);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false, // Turn off voice-focused filters
                    noiseSuppression: false, // Disable noise filtering
                    autoGainControl: false,  // Avoid reducing guitar volume
                }
            });
                        audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            mediaStreamRef.current = audioContextRef.current.createMediaStreamSource(stream);
            mediaStreamRef.current.connect(analyserRef.current);

            pitchDetectorRef.current = PitchDetector.forFloat32Array(analyserRef.current.fftSize);

            const detectPitch = () => {
                const buffer = new Float32Array(analyserRef.current.fftSize);
                analyserRef.current.getFloatTimeDomainData(buffer);
                
                const [frequency, clarity] = pitchDetectorRef.current.findPitch(buffer, audioContextRef.current.sampleRate);
            
                if (clarity > 0.6 && frequency && frequency >= 82 && frequency <= 1200) { // Guitar range
                    const detectedChord = getChordFromFrequency(frequency);
                    if (detectedChord) {
                        setUserChords(prevChords => {
                            if (!prevChords.includes(detectedChord)) {
                                return [...prevChords, detectedChord];
                            }
                            return prevChords;
                        });
                    }
                }
            };
            

            intervalRef.current = setInterval(detectPitch, 500);
        } catch (err) {
            setError("Microphone access denied.");
            setIsListening(false);
        }
    };

    // Stop Listening
    const stopListening = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.mediaStream.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setIsListening(false);
    };

    // Convert Frequency to Chord
    const getChordFromFrequency = (freq) => {
        const chordMap = {
            "C": [130.81, 261.63, 523.25],  // C3, C4, C5
            "D": [146.83, 293.66, 587.33],  // D3, D4, D5
            "E": [82.41, 164.81, 329.63, 659.25],  // E2, E3, E4, E5
            "F": [174.61, 349.23, 698.46],  // F3, F4, F5
            "G": [196.00, 392.00, 783.99],  // G3, G4, G5
            "A": [110.00, 220.00, 440.00, 880.00],  // A2, A3, A4, A5
            "B": [123.47, 246.94, 493.88, 987.77],  // B2, B3, B4, B5
        };
    
        let closestChord = null;
        let minDifference = 15; // Slightly relaxed tolerance for better guitar recognition
    
        for (const [chord, frequencies] of Object.entries(chordMap)) {
            frequencies.forEach(f => {
                const diff = Math.abs(f - freq);
                if (diff < minDifference) {
                    closestChord = chord;
                    minDifference = diff;
                }
            });
        }
    
        return closestChord;
    };
    
    
    // Compare detected chords with correct chords
    const checkChords = () => {
        if (!songDetails) {
            setFeedback("Search for a song first.");
            return;
        }

        const correctChords = songDetails.chords.map(chord => chord.toUpperCase());
        const matched = userChords.filter(chord => correctChords.includes(chord)).length;
        const accuracy = ((matched / correctChords.length) * 100).toFixed(2);

        if (accuracy === "100.00") {
            setFeedback("🎉 Perfect! You played all the correct chords!");
        } else if (accuracy >= 50) {
            setFeedback(`👍 Good job! You got ${accuracy}% correct.`);
        } else {
            setFeedback(`😕 Keep practicing! You got only ${accuracy}% right.`);
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h2 className="text-2xl font-bold mb-4">🎵 Search for a Song</h2>
            
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter song name..."
                    value={songName}
                    onChange={(e) => setSongName(e.target.value)}
                    className="border p-2 rounded-md"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    🔍 Search
                </button>
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {songDetails && (
                <div className="mt-4 p-4 border rounded-md shadow-lg bg-gray-100">
                    <h3 className="text-xl font-semibold">{songDetails.song}</h3>
                    <p className="mt-2"><strong>Chords:</strong> {songDetails.chords.join(", ")}</p>
                </div>
            )}

            {songDetails && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">🎸 Play the Song</h3>
                    <button
                        onClick={isListening ? stopListening : startListening}
                        className={`px-4 py-2 rounded-md ${
                            isListening ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                        } text-white`}
                    >
                        {isListening ? "🛑 Stop Listening" : "🎙️ Start Listening"}
                    </button>

                    {/* Waveform Visualizer */}
                    {isListening && <WaveformVisualizer analyser={analyserRef.current} />}

                    <h3 className="text-lg font-semibold mt-4">🎼 Detected Chords:</h3>
                    <p className="p-2 border rounded-md bg-white">{userChords.join(", ") || "None yet"}</p>

                    <button
                        onClick={checkChords}
                        className="bg-green-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-green-600"
                    >
                        ✅ Check Accuracy
                    </button>
                    {feedback && <p className="mt-2 font-semibold">{feedback}</p>}
                </div>
            )}
        </div>
    );
};

export default SearchSong;
