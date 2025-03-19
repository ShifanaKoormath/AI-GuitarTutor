import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const Waveform = ({ audioUrl }) => {
    const waveformRef = useRef(null);

    useEffect(() => {
        if (audioUrl) {
            const wavesurfer = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: "#4F46E5",
                progressColor: "#6366F1",
                barWidth: 3,
                responsive: true,
                height: 100,
            });

            wavesurfer.load(audioUrl);

            return () => wavesurfer.destroy();
        }
    }, [audioUrl]);

    return <div ref={waveformRef} />;
};

export default Waveform;
