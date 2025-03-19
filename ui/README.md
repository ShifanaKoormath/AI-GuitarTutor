🎸 Guitar AI Tutor - Chord Detection and Feedback System 🎵

This web app detects guitar chords from an audio recording and compares them with the chords of a searched song to provide feedback on accuracy.

🚀 Features

🎵 Search for a Song – Fetches the correct chords for a given song.

🎸 Live Chord Detection – Uses the microphone to detect chords in real time.

✅ Accuracy Check – Compares detected chords with the original song's chords and gives feedback.

📈 Waveform Visualizer – Displays the audio waveform for better analysis.

📜 Installation & Setup

1️⃣ Clone the Repository

sh
Copy code

git clone https://github.com/ShifanaKoormath/AI-GuitarTutor.git
cd AI-GuitarTutor

2️⃣ Install Dependencies

Backend (Server)

sh
Copy code

npm install

npm install express multer cors path fs

Frontend (Client)

sh
Copy code

cd ui
npm install
npm install react pitchy


🎯 Running the Application

1️⃣ Start the Backend Server

sh
Copy code

node server.js

The server will run at http://localhost:5000

2️⃣ Start the Frontend (React App)

sh
Copy code

cd ui

npm start

The app will be available at http://localhost:3000

🎤 How to Use

Enter a Song Name and click Search 🎵
View the original chords of the song.
Click Start Listening 🎙️ to detect your played chords.

Play the song on your guitar, and detected chords will appear.

Click Check Accuracy ✅ to compare your chords with the original song.

🛠️ Tech Stack

Frontend: React.js 🎨
Backend: Node.js + Express.js 🌐
Audio Processing: Web Audio API 🎶

🎯 Future Improvements

🎹 Support for other musical instruments
📱 Mobile-friendly version
🧠 AI-based chord prediction

📧 Need Help? Contact us at [your-saniwebdes@gmail.com]

🚀 Happy Playing! 🎸