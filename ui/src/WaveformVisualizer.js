import React, { useEffect, useRef, useState } from "react";

const WaveformVisualizer = () => {
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if (!isListening) return;

        const startAudio = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioContextRef.current = new AudioContext();
                const source = audioContextRef.current.createMediaStreamSource(stream);
                analyserRef.current = audioContextRef.current.createAnalyser();
                source.connect(analyserRef.current);

                analyserRef.current.fftSize = 2048;
                const bufferLength = analyserRef.current.frequencyBinCount;
                dataArrayRef.current = new Uint8Array(bufferLength);

                drawWaveform();
            } catch (err) {
                console.error("Microphone access denied", err);
            }
        };

        startAudio();
    }, [isListening]);

    const drawWaveform = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const draw = () => {
            if (!isListening) return;
            requestAnimationFrame(draw);

            analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

            // Background styling
            ctx.fillStyle = "#111827"; // Dark mode background
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Waveform styling
            ctx.lineWidth = 3;
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, "#4ADE80"); // Green
            gradient.addColorStop(0.5, "#60A5FA"); // Blue
            gradient.addColorStop(1, "#EC4899"); // Pink
            ctx.strokeStyle = gradient;

            ctx.beginPath();
            const sliceWidth = (canvas.width * 1.0) / dataArrayRef.current.length;
            let x = 0;

            for (let i = 0; i < dataArrayRef.current.length; i++) {
                const v = dataArrayRef.current[i] / 128.0;
                const y = v * (canvas.height / 2);
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        };
        draw();
    };

    const toggleListening = () => {
        setIsListening((prev) => !prev);
        if (!isListening && audioContextRef.current) {
            audioContextRef.current.close();
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <button
                onClick={toggleListening}
                className={`px-4 py-2 rounded-md text-white transition-all duration-300 ${
                    isListening ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                }`}
            >
                {isListening ? "🛑 Stop Listening" : "🎙️ Start Listening"}
            </button>
            <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="border mt-4 rounded-lg shadow-md"
            ></canvas>
        </div>
    );
};

export default WaveformVisualizer;
