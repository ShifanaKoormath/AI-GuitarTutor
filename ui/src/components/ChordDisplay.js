import React from "react";

const ChordDisplay = ({ results }) => {
    if (!results) return null;

    return (
        <div>
            <h3>Analysis Results</h3>
            <p><strong>Tempo:</strong> {results.tempo} BPM</p>
            <p><strong>Key:</strong> {results.key}</p>
            <p><strong>Chords:</strong> {results.chords.join(", ")}</p>
        </div>
    );
};

export default ChordDisplay;
