import os
import sys
import librosa
import numpy as np
import soundfile as sf

# Mapping of chroma indices to chord names
CHORDS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

def process_audio(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found!")
        return "Failure"

    print(f"Processing audio file: {file_path}")

    # Convert MP3 to WAV (Librosa only reads WAV properly)
    wav_path = file_path.replace('.mp3', '.wav')

    try:
        # Load audio
        y, sr = librosa.load(file_path, sr=22050)  

        # Save as WAV
        sf.write(wav_path, y, sr)  
        print(f"Converted to WAV: {wav_path}")

        # Apply HPSS (Harmonic-Percussive Source Separation)
        y_harmonic, _ = librosa.effects.hpss(y)

        # Extract Tempo
        tempo, _ = librosa.beat.beat_track(y=y_harmonic, sr=sr)
        tempo_value = float(tempo.item())  
        print(f"Estimated Tempo: {tempo_value:.2f} BPM")

        # Extract Key of the Song
        chroma = librosa.feature.chroma_stft(y=y_harmonic, sr=sr)
        key_index = np.argmax(np.sum(chroma, axis=1))
        detected_key = CHORDS[key_index]
        print(f"Detected Key: {detected_key}")

        # Improved Chord Detection
        avg_chroma = np.mean(chroma, axis=1)  # Average chroma values
        chord_indices = np.argsort(avg_chroma)[-3:]  # Get top 3 strongest notes
        detected_chords = [CHORDS[i] for i in chord_indices]
        detected_chords.sort()  # Sort to maintain consistency

        print(f"Estimated Chords: {', '.join(detected_chords)}")

        return {"tempo": tempo_value, "key": detected_key, "chords": detected_chords}
    
    except Exception as e:
        print(f"Error processing audio: {str(e)}")
        return "Failure"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("No file provided")
        sys.exit(1)

    file_path = sys.argv[1]
    result = process_audio(file_path)
