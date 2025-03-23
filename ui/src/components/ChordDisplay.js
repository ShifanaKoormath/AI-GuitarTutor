const ChordDisplay = ({ detectedChords }) => {
    return (
        <div className="flex flex-wrap gap-4 mt-2">
            {detectedChords.map((chord, index) => (
                <div key={index} className="flex flex-col items-center">
                    <p className="text-sm font-medium">{chord.chord}</p>
                    {chord.diagram ? (
                        <img
                            src={chord.diagram.startsWith("/chords") ? chord.diagram : `/chords/${chord.chord}.png`}
                            alt={`Chord ${chord.chord}`}
                            className="w-16 h-16 object-contain"
                        />
                    ) : (
                        <p className="text-xs text-red-500">No Diagram</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ChordDisplay;

