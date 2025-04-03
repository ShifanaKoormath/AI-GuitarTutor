import React from "react";

const BeginnerGuide = () => {
  return (
    <div className="beginner-guide-container">
      <h2 className="guide-title">📖 Beginner's Guide to Guitar</h2>
      <p className="guide-intro">
        Welcome to the Beginner's Guide! 🎸 Whether you're just starting or looking to refresh your basics, 
        these resources will help you get comfortable with playing the guitar. Below are some essential tutorials to get started.
      </p>

      <h3 className="section-title">🎥 Essential Guitar Tutorials</h3>

      {/* Tutorial: How to Hold a Guitar */}
      <div className="tutorial-container">
        <h4>🎸 How to Hold a Guitar</h4>
        <p>
          The way you hold your guitar impacts your comfort and playing ability. Learn the correct posture 
          for both sitting and standing positions to avoid strain and improve control.
        </p>
        <a 
          href="https://www.youtube.com/watch?v=MlV6WhM9YhE" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="tutorial-link"
        >
          🎬 Watch Video
        </a>
      </div>

      {/* Tutorial: How to Read Chord Diagrams */}
      <div className="tutorial-container">
        <h4>🎼 How to Read Chord Diagrams</h4>
        <p>
          Chord diagrams help you understand finger placements on the fretboard. Mastering them 
          is crucial for playing songs and progressing as a guitarist.
        </p>
        <a 
          href="https://www.youtube.com/watch?v=SoVGWkC8Pr4" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="tutorial-link"
        >
          🎬 Watch Video
        </a>
      </div>

      {/* Tutorial: First Basic Guitar Chords */}
      <div className="tutorial-container">
        <h4>🎵 First Basic Guitar Chords</h4>
        <p>
          Start with the most common beginner-friendly chords like C, G, D, and A minor. These are 
          the foundation for many popular songs.
        </p>
        <a 
          href="https://www.youtube.com/watch?v=TPP8Sioqpt4" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="tutorial-link"
        >
          🎬 Watch Video
        </a>
      </div>

      <p className="guide-outro">Practice regularly and have fun! 🎶</p>
    </div>
  );
};

export default BeginnerGuide;
